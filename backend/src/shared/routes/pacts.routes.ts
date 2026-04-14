import { Router } from 'express'
import { supabaseAdmin } from '../../lib/supabase'
import { authMiddleware } from '../middleware/auth.middleware'
import { sendError, sendSuccess } from '../utils/response'

const router = Router()

router.get('/', async (req, res) => {
  const categoryParam = typeof req.query.category === 'string' ? req.query.category : undefined
  const allowedCategories = ['education', 'corporate', 'legal', 'government', 'personal'] as const
  const category = allowedCategories.find((item) => item === categoryParam)

  let query = supabaseAdmin
    .from('pacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return sendSuccess(res, data)
})

router.get('/:id', async (req, res) => {
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
    .eq('id', req.params.id)
    .single()

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

router.post('/:id/vote', authMiddleware, async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const proofSubmissionId = String(req.body.proofSubmissionId || '')
  const voteValue = req.body.vote === 'reject' ? 'reject' : 'approve'

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from('pact_members')
    .select('id')
    .eq('pact_id', req.params.id)
    .eq('user_id', req.user.id)
    .maybeSingle()

  if (membershipError) throw new Error(membershipError.message)
  if (!membership) return sendError(res, 'Only pact members can vote', 403)

  const { data, error } = await supabaseAdmin
    .from('votes')
    .insert({
      pact_id: req.params.id,
      proof_submission_id: proofSubmissionId,
      voter_id: req.user.id,
      vote: voteValue,
      voted_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return sendSuccess(res, data, 201)
})

router.get('/:id/votes', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('votes')
    .select('*, users (id, name, email)')
    .eq('pact_id', req.params.id)
    .order('voted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

export default router
