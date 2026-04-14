import type { Request, Response } from 'express'
import {
  createCorporatePact,
  getAllCorporatePacts,
  getCorporatePactById,
  updateMilestone,
} from './corporate.service'
import { sendError, sendSuccess } from '../../shared/utils/response'

export async function getAllCorporatePactsController(_req: Request, res: Response) {
  const pacts = await getAllCorporatePacts()
  return sendSuccess(res, pacts)
}

export async function getCorporatePactByIdController(req: Request, res: Response) {
  const pact = await getCorporatePactById(req.params.id)
  return sendSuccess(res, pact)
}

export async function createCorporatePactController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const pact = await createCorporatePact({
    title: String(req.body.title || ''),
    description: req.body.description ? String(req.body.description) : undefined,
    stakePerMember: Number(req.body.stakePerMember || 0),
    deadline: String(req.body.deadline || new Date().toISOString()),
    verificationMethod: String(req.body.verificationMethod || 'milestone'),
    creatorId: req.user.id,
    memberIds: Array.isArray(req.body.memberIds) ? req.body.memberIds.map(String) : [],
    milestones: Array.isArray(req.body.milestones) ? req.body.milestones : [],
  })

  return sendSuccess(res, pact, 201)
}

export async function updateMilestoneController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const milestone = await updateMilestone(
    req.params.milestoneId,
    req.body.status === 'completed' || req.body.status === 'missed' ? req.body.status : 'pending',
  )

  return sendSuccess(res, milestone)
}
