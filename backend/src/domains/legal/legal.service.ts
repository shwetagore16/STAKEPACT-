import { createHash } from 'crypto'
import { supabaseAdmin } from '../../lib/supabase'
import type { Json } from '../../lib/supabase.types'

type CreateLegalPactInput = {
  title: string
  description?: string
  stakePerMember: number
  deadline: string
  verificationMethod: string
  creatorId: string
  memberIds: string[]
  verifier?: {
    id?: string
    name: string
    email?: string
    license?: string
  }
}

type VerifierInput = {
  id?: string
  name: string
  email?: string
  license?: string
}

export async function getAllLegalPacts() {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .eq('category', 'legal')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getLegalPactById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*, pact_members(*), proof_submissions(*)')
    .eq('id', id)
    .eq('category', 'legal')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createLegalPact(input: CreateLegalPactInput) {
  const uniqueMemberIds = Array.from(new Set([input.creatorId, ...input.memberIds]))

  const { data: pact, error: pactError } = await supabaseAdmin
    .from('pacts')
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: 'legal',
      status: 'active',
      stake_per_member: input.stakePerMember,
      total_stake: input.stakePerMember * uniqueMemberIds.length,
      deadline: input.deadline,
      verification_method: input.verificationMethod,
      creator_id: input.creatorId,
      proof_data: input.verifier ? { verifier: input.verifier } : null,
    })
    .select('*')
    .single()

  if (pactError || !pact) throw new Error(pactError?.message || 'Failed to create legal pact')

  const members = uniqueMemberIds.map((userId) => ({
    pact_id: pact.id,
    user_id: userId,
    proof_status: 'pending' as const,
  }))

  const { error: memberError } = await supabaseAdmin.from('pact_members').insert(members)
  if (memberError) throw new Error(memberError.message)

  return pact
}

export async function assignVerifier(pactId: string, verifierData: VerifierInput) {
  const { data: current, error: fetchError } = await supabaseAdmin
    .from('pacts')
    .select('proof_data')
    .eq('id', pactId)
    .eq('category', 'legal')
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const existing = (current.proof_data ?? {}) as Record<string, Json>
  const updatedProofData: Record<string, Json> = {
    ...existing,
    verifier: verifierData as unknown as Json,
  }

  const { data, error } = await supabaseAdmin
    .from('pacts')
    .update({ proof_data: updatedProofData })
    .eq('id', pactId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function verifierSignOff(pactId: string, verifierId: string, signature: string) {
  const { data: latest, error: latestError } = await supabaseAdmin
    .from('proof_submissions')
    .select('id,proof_data')
    .eq('pact_id', pactId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError) throw new Error(latestError.message)

  if (latest?.id) {
    const mergedProofData = {
      ...((latest.proof_data ?? {}) as Record<string, Json>),
      verifier_signature: signature,
      signoff_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('proof_submissions')
      .update({
        verified_at: new Date().toISOString(),
        verified_by: verifierId,
        proof_data: mergedProofData,
      })
      .eq('id', latest.id)
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  const { data, error } = await supabaseAdmin
    .from('proof_submissions')
    .insert({
      pact_id: pactId,
      member_id: verifierId,
      proof_type: 'api_verified',
      proof_data: {
        verifier_signature: signature,
        signoff_at: new Date().toISOString(),
      },
      verified_at: new Date().toISOString(),
      verified_by: verifierId,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export function generateDocumentHash(fileBuffer: Buffer): string {
  return createHash('sha256').update(fileBuffer).digest('hex')
}

const verifierDirectory = [
  { id: 'v-1', name: 'Aditi Rao', expertise: 'Contract Law', city: 'Bengaluru' },
  { id: 'v-2', name: 'Raghav Menon', expertise: 'Tax Compliance', city: 'Mumbai' },
  { id: 'v-3', name: 'Nisha Verma', expertise: 'IP Filings', city: 'Delhi' },
  { id: 'v-4', name: 'Parth Desai', expertise: 'Regulatory Affairs', city: 'Ahmedabad' },
]

export function searchVerifiers(query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return verifierDirectory

  return verifierDirectory.filter((verifier) =>
    [verifier.name, verifier.expertise, verifier.city]
      .join(' ')
      .toLowerCase()
      .includes(normalized),
  )
}
