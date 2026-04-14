import { Router } from 'express'
import { supabaseAdmin } from '../../lib/supabase'
import { authMiddleware } from '../middleware/auth.middleware'
import { sendError, sendSuccess } from '../utils/response'

const router = Router()

type UploadBody = {
  fileName: string
  fileContentBase64: string
  contentType?: string
}

router.post('/upload', authMiddleware, async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const body = req.body as UploadBody
  if (!body.fileName || !body.fileContentBase64) {
    return sendError(res, 'fileName and fileContentBase64 are required', 400)
  }

  const binary = Buffer.from(body.fileContentBase64, 'base64')
  const safeFileName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${req.user.id}/${Date.now()}-${safeFileName}`

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from('proofs')
    .upload(storagePath, binary, {
      upsert: false,
      contentType: body.contentType || 'application/octet-stream',
    })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabaseAdmin.storage.from('proofs').getPublicUrl(storagePath)

  return sendSuccess(res, {
    path: storagePath,
    publicUrl: data.publicUrl,
  }, 201)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('proof_submissions')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) throw new Error(error.message)
  return sendSuccess(res, data)
})

export default router
