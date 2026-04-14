import { supabaseAdmin } from '../../lib/supabase'

export function calculateGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 900) return 'S'
  if (score >= 750) return 'A'
  if (score >= 600) return 'B'
  if (score >= 450) return 'C'
  return 'D'
}

export async function updateCommitScore(
  userId: string,
  pactCompleted: boolean,
  stakeAmount: number,
): Promise<number> {
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('commit_score,total_staked,total_earned,pacts_completed,pacts_failed')
    .eq('id', userId)
    .single()

  if (fetchError || !user) {
    throw new Error(fetchError?.message || 'Unable to fetch user for commit score update')
  }

  const currentScore = user.commit_score ?? 500
  const positiveDelta = Math.min(80, Math.max(15, Math.round(stakeAmount / 200)))
  const negativeDelta = Math.min(90, Math.max(20, Math.round(stakeAmount / 150)))

  const nextScore = pactCompleted
    ? Math.min(1000, currentScore + positiveDelta)
    : Math.max(0, currentScore - negativeDelta)

  const nextGrade = calculateGrade(nextScore)
  const nextCompleted = (user.pacts_completed ?? 0) + (pactCompleted ? 1 : 0)
  const nextFailed = (user.pacts_failed ?? 0) + (pactCompleted ? 0 : 1)
  const nextTotalStaked = Number(user.total_staked ?? 0) + stakeAmount
  const nextTotalEarned = Number(user.total_earned ?? 0) + (pactCompleted ? Math.round(stakeAmount * 0.25) : 0)

  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      commit_score: nextScore,
      grade: nextGrade,
      pacts_completed: nextCompleted,
      pacts_failed: nextFailed,
      total_staked: nextTotalStaked,
      total_earned: nextTotalEarned,
    })
    .eq('id', userId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return nextScore
}
