import { supabaseAdmin } from '../../lib/supabase'
import type { Json } from '../../lib/supabase.types'

type CreateStudyCircleInput = {
  title: string
  description?: string
  stakePerMember: number
  deadline: string
  verificationMethod: string
  creatorId: string
  memberIds: string[]
}

type SubmitProofInput = {
  proofType: 'document' | 'github_url' | 'strava_data' | 'api_verified'
  proofUrl?: string
  proofData?: Json
}

export async function getAllEducationPacts() {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .eq('category', 'education')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getEducationPactById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select(`
      *,
      pact_members (
        id,
        user_id,
        proof_status,
        joined_at,
        users (id, name, email, wallet_address)
      ),
      proof_submissions (
        id,
        member_id,
        proof_type,
        proof_url,
        proof_data,
        submitted_at,
        verified_at,
        verified_by
      )
    `)
    .eq('id', id)
    .eq('category', 'education')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createStudyCircle(payload: CreateStudyCircleInput) {
  const uniqueMemberIds = Array.from(new Set([payload.creatorId, ...payload.memberIds]))
  const totalStake = uniqueMemberIds.length * payload.stakePerMember

  const { data: pact, error: pactError } = await supabaseAdmin
    .from('pacts')
    .insert({
      title: payload.title,
      description: payload.description ?? null,
      category: 'education',
      status: 'active',
      stake_per_member: payload.stakePerMember,
      total_stake: totalStake,
      deadline: payload.deadline,
      verification_method: payload.verificationMethod,
      creator_id: payload.creatorId,
      proof_data: {
        type: 'study-circle',
      },
    })
    .select('*')
    .single()

  if (pactError || !pact) {
    throw new Error(pactError?.message || 'Unable to create education pact')
  }

  const memberRows = uniqueMemberIds.map((userId) => ({
    pact_id: pact.id,
    user_id: userId,
    proof_status: 'pending' as const,
  }))

  const { error: memberError } = await supabaseAdmin
    .from('pact_members')
    .insert(memberRows)

  if (memberError) throw new Error(memberError.message)

  return pact
}

export async function submitStudyProof(
  pactId: string,
  memberId: string,
  proofInput: SubmitProofInput,
) {
  const { data, error } = await supabaseAdmin
    .from('proof_submissions')
    .insert({
      pact_id: pactId,
      member_id: memberId,
      proof_type: proofInput.proofType,
      proof_url: proofInput.proofUrl ?? null,
      proof_data: proofInput.proofData ?? null,
      submitted_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  await supabaseAdmin
    .from('pact_members')
    .update({ proof_status: 'submitted' })
    .eq('pact_id', pactId)
    .eq('user_id', memberId)

  return data
}

export async function getStudyCircleStats() {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('status,total_stake')
    .eq('category', 'education')

  if (error) throw new Error(error.message)

  const total = data.length
  const totalStaked = data.reduce((sum, pact) => sum + Number(pact.total_stake ?? 0), 0)
  const completed = data.filter((pact) => pact.status === 'completed').length
  const successRate = total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2))

  return {
    totalPacts: total,
    totalStaked,
    successRate,
  }
}
