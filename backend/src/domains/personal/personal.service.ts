import { supabaseAdmin } from '../../lib/supabase'

type CreatePersonalPactInput = {
  title: string
  description?: string
  stakePerMember: number
  deadline: string
  verificationMethod: string
  creatorId: string
  memberIds: string[]
  goalType?: 'fitness' | 'habit' | 'learning' | 'side-project'
}

export async function getAllPersonalPacts(userId?: string) {
  if (!userId) {
    const { data, error } = await supabaseAdmin
      .from('pacts')
      .select('*')
      .eq('category', 'personal')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  const { data: memberships, error: memberError } = await supabaseAdmin
    .from('pact_members')
    .select('pact_id')
    .eq('user_id', userId)

  if (memberError) throw new Error(memberError.message)

  const pactIds = memberships.map((row) => row.pact_id)
  if (pactIds.length === 0) return []

  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .eq('category', 'personal')
    .in('id', pactIds)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getPersonalPactById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*, pact_members(*), proof_submissions(*)')
    .eq('id', id)
    .eq('category', 'personal')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createPersonalPact(input: CreatePersonalPactInput) {
  const uniqueMemberIds = Array.from(new Set([input.creatorId, ...input.memberIds]))

  const { data: pact, error: pactError } = await supabaseAdmin
    .from('pacts')
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: 'personal',
      status: 'active',
      stake_per_member: input.stakePerMember,
      total_stake: input.stakePerMember * uniqueMemberIds.length,
      deadline: input.deadline,
      verification_method: input.verificationMethod,
      creator_id: input.creatorId,
      proof_data: {
        goal_type: input.goalType ?? 'habit',
        current_progress: 0,
      },
    })
    .select('*')
    .single()

  if (pactError || !pact) throw new Error(pactError?.message || 'Failed to create personal pact')

  const members = uniqueMemberIds.map((memberId) => ({
    pact_id: pact.id,
    user_id: memberId,
    proof_status: 'pending' as const,
  }))

  const { error: memberError } = await supabaseAdmin.from('pact_members').insert(members)
  if (memberError) throw new Error(memberError.message)

  return pact
}

export async function updateGoalProgress(pactId: string, memberId: string, progress: number) {
  const bounded = Math.min(100, Math.max(0, progress))

  const { data, error } = await supabaseAdmin
    .from('proof_submissions')
    .insert({
      pact_id: pactId,
      member_id: memberId,
      proof_type: 'api_verified',
      proof_data: {
        progress: bounded,
        updated_at: new Date().toISOString(),
      },
      submitted_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function verifyStravaData(pactId: string, memberId: string, stravaToken: string) {
  const mockData = {
    token_preview: `${stravaToken.slice(0, 4)}****`,
    distance_km: 42.6,
    activities_synced: 9,
    verified: true,
    checked_at: new Date().toISOString(),
  }

  const { data, error } = await supabaseAdmin
    .from('proof_submissions')
    .insert({
      pact_id: pactId,
      member_id: memberId,
      proof_type: 'strava_data',
      proof_data: mockData,
      submitted_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
      verified_by: memberId,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getActiveChallenges() {
  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .eq('category', 'personal')
    .eq('status', 'active')
    .order('total_stake', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return data
}
