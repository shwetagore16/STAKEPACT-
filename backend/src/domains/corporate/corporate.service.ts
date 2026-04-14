import { supabaseAdmin } from '../../lib/supabase'
import type { Json } from '../../lib/supabase.types'

type MilestoneStatus = 'pending' | 'completed' | 'missed'

type Milestone = {
  id: string
  title: string
  dueDate: string
  status: MilestoneStatus
}

type CreateCorporatePactInput = {
  title: string
  description?: string
  stakePerMember: number
  deadline: string
  verificationMethod: string
  creatorId: string
  memberIds: string[]
  milestones: Milestone[]
}

function parseMilestones(proofData: Json | null): Milestone[] {
  if (!proofData || typeof proofData !== 'object' || Array.isArray(proofData)) return []
  const raw = (proofData as { milestones?: unknown }).milestones
  if (!Array.isArray(raw)) return []

  return raw.filter((item): item is Milestone => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as Milestone
    return Boolean(candidate.id && candidate.title && candidate.dueDate && candidate.status)
  })
}

export async function getAllCorporatePacts() {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .eq('category', 'corporate')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getCorporatePactById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*, pact_members(*), proof_submissions(*)')
    .eq('id', id)
    .eq('category', 'corporate')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createCorporatePact(input: CreateCorporatePactInput) {
  const uniqueMemberIds = Array.from(new Set([input.creatorId, ...input.memberIds]))

  const { data: pact, error: pactError } = await supabaseAdmin
    .from('pacts')
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: 'corporate',
      status: 'active',
      stake_per_member: input.stakePerMember,
      total_stake: input.stakePerMember * uniqueMemberIds.length,
      deadline: input.deadline,
      verification_method: input.verificationMethod,
      creator_id: input.creatorId,
      proof_data: {
        milestones: input.milestones,
      },
    })
    .select('*')
    .single()

  if (pactError || !pact) throw new Error(pactError?.message || 'Failed to create corporate pact')

  const memberRows = uniqueMemberIds.map((userId) => ({
    pact_id: pact.id,
    user_id: userId,
    proof_status: 'pending' as const,
  }))

  const { error: memberError } = await supabaseAdmin.from('pact_members').insert(memberRows)
  if (memberError) throw new Error(memberError.message)

  return pact
}

export async function updateMilestone(milestoneId: string, status: MilestoneStatus) {
  const { data: pacts, error } = await supabaseAdmin
    .from('pacts')
    .select('id,proof_data')
    .eq('category', 'corporate')

  if (error) throw new Error(error.message)

  for (const pact of pacts) {
    const milestones = parseMilestones(pact.proof_data)
    const match = milestones.find((milestone) => milestone.id === milestoneId)
    if (!match) continue

    const updated = milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, status } : milestone,
    )

    const { data, error: updateError } = await supabaseAdmin
      .from('pacts')
      .update({ proof_data: { milestones: updated } })
      .eq('id', pact.id)
      .select('*')
      .single()

    if (updateError) throw new Error(updateError.message)
    return data
  }

  throw new Error('Milestone not found')
}

export async function getMilestones(pactId: string) {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('proof_data')
    .eq('id', pactId)
    .eq('category', 'corporate')
    .single()

  if (error) throw new Error(error.message)
  return parseMilestones(data.proof_data)
}
