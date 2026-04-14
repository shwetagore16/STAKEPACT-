import type { Request, Response } from 'express'
import {
  createPersonalPact,
  getActiveChallenges,
  getAllPersonalPacts,
  getPersonalPactById,
  updateGoalProgress,
  verifyStravaData,
} from './personal.service'
import { sendError, sendSuccess } from '../../shared/utils/response'

export async function getAllPersonalPactsController(req: Request, res: Response) {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const pacts = await getAllPersonalPacts(userId)
  return sendSuccess(res, pacts)
}

export async function getPersonalPactByIdController(req: Request, res: Response) {
  const pact = await getPersonalPactById(req.params.id)
  return sendSuccess(res, pact)
}

export async function createPersonalPactController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const pact = await createPersonalPact({
    title: String(req.body.title || ''),
    description: req.body.description ? String(req.body.description) : undefined,
    stakePerMember: Number(req.body.stakePerMember || 0),
    deadline: String(req.body.deadline || new Date().toISOString()),
    verificationMethod: String(req.body.verificationMethod || 'manual-proof'),
    creatorId: req.user.id,
    memberIds: Array.isArray(req.body.memberIds) ? req.body.memberIds.map(String) : [],
    goalType: req.body.goalType,
  })

  return sendSuccess(res, pact, 201)
}

export async function updateGoalProgressController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const progress = await updateGoalProgress(
    req.params.id,
    req.user.id,
    Number(req.body.progress || 0),
  )

  return sendSuccess(res, progress)
}

export async function getActiveChallengesController(_req: Request, res: Response) {
  const challenges = await getActiveChallenges()
  return sendSuccess(res, challenges)
}

export async function verifyStravaDataController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const payload = await verifyStravaData(
    String(req.body.pactId || ''),
    req.user.id,
    String(req.body.stravaToken || ''),
  )

  return sendSuccess(res, payload)
}
