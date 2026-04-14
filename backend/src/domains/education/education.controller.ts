import type { Request, Response } from 'express'
import {
  createStudyCircle,
  getAllEducationPacts,
  getEducationPactById,
  getStudyCircleStats,
  submitStudyProof,
} from './education.service'
import { sendError, sendSuccess } from '../../shared/utils/response'

export async function getAllEducationPactsController(_req: Request, res: Response) {
  const pacts = await getAllEducationPacts()
  return sendSuccess(res, pacts)
}

export async function getEducationPactByIdController(req: Request, res: Response) {
  const pact = await getEducationPactById(req.params.id)
  return sendSuccess(res, pact)
}

export async function createStudyCircleController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const pact = await createStudyCircle({
    title: String(req.body.title || ''),
    description: req.body.description ? String(req.body.description) : undefined,
    stakePerMember: Number(req.body.stakePerMember || 0),
    deadline: String(req.body.deadline || new Date().toISOString()),
    verificationMethod: String(req.body.verificationMethod || 'group-vote'),
    creatorId: req.user.id,
    memberIds: Array.isArray(req.body.memberIds) ? req.body.memberIds.map(String) : [],
  })

  return sendSuccess(res, pact, 201)
}

export async function submitStudyProofController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const proof = await submitStudyProof(req.params.id, req.user.id, {
    proofType: req.body.proofType,
    proofUrl: req.body.proofUrl,
    proofData: req.body.proofData,
  })

  return sendSuccess(res, proof, 201)
}

export async function getStudyCircleStatsController(_req: Request, res: Response) {
  const stats = await getStudyCircleStats()
  return sendSuccess(res, stats)
}
