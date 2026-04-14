import type { Request, Response } from 'express'
import { addToWaitlist, getWaitlistCount } from './government.service'
import { sendSuccess } from '../../shared/utils/response'

export async function getWaitlistCountController(_req: Request, res: Response) {
  const count = await getWaitlistCount()
  return sendSuccess(res, { count })
}

export async function addToWaitlistController(req: Request, res: Response) {
  const waitlistEntry = await addToWaitlist({
    email: String(req.body.email || ''),
    organization: String(req.body.organization || ''),
    role: String(req.body.role || ''),
    use_case: String(req.body.use_case || ''),
  })

  return sendSuccess(res, waitlistEntry, 201)
}

export async function getGovernmentInfoController(_req: Request, res: Response) {
  const count = await getWaitlistCount()
  return sendSuccess(res, {
    status: 'coming-soon',
    message: 'Government and public-sector pacts are in private preview.',
    waitlistCount: count,
  })
}
