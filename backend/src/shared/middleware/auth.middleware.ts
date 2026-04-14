import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../../lib/supabase'

export type AuthUser = {
  id: string
  email: string | null
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token', code: 'UNAUTHORIZED' })
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token format', code: 'UNAUTHORIZED' })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token', code: 'UNAUTHORIZED' })
  }

  req.user = {
    id: data.user.id,
    email: data.user.email ?? null,
  }

  next()
}
