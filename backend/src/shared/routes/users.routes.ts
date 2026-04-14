import { Router } from 'express'
import { supabaseAdmin } from '../../lib/supabase'
import { authMiddleware } from '../middleware/auth.middleware'
import { sendError, sendSuccess } from '../utils/response'

const router = Router()

router.get('/me', authMiddleware, async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single()

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

router.put('/me', authMiddleware, async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const payload = {
    name: req.body.name,
    wallet_address: req.body.wallet_address,
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(payload)
    .eq('id', req.user.id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

router.get('/leaderboard', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id,name,commit_score,grade,total_staked,total_earned')
    .order('commit_score', { ascending: false })
    .limit(10)

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

router.get('/:id/pacts', async (req, res) => {
  const { data: memberships, error: membershipError } = await supabaseAdmin
    .from('pact_members')
    .select('pact_id')
    .eq('user_id', req.params.id)

  if (membershipError) throw new Error(membershipError.message)

  const pactIds = memberships.map((row) => row.pact_id)
  if (pactIds.length === 0) return sendSuccess(res, [])

  const { data, error } = await supabaseAdmin
    .from('pacts')
    .select('*')
    .in('id', pactIds)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

export default router
