import type { Request, Response } from 'express'
import {
  assignVerifier,
  createLegalPact,
  generateDocumentHash,
  getAllLegalPacts,
  getLegalPactById,
  searchVerifiers,
  verifierSignOff,
} from './legal.service'
import { sendError, sendSuccess } from '../../shared/utils/response'

export async function getAllLegalPactsController(_req: Request, res: Response) {
  const pacts = await getAllLegalPacts()
  return sendSuccess(res, pacts)
}

export async function getLegalPactByIdController(req: Request, res: Response) {
  const pact = await getLegalPactById(req.params.id)
  return sendSuccess(res, pact)
}

export async function createLegalPactController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const pact = await createLegalPact({
    title: String(req.body.title || ''),
    description: req.body.description ? String(req.body.description) : undefined,
    stakePerMember: Number(req.body.stakePerMember || 0),
    deadline: String(req.body.deadline || new Date().toISOString()),
    verificationMethod: String(req.body.verificationMethod || 'designated-verifier'),
    creatorId: req.user.id,
    memberIds: Array.isArray(req.body.memberIds) ? req.body.memberIds.map(String) : [],
    verifier: req.body.verifier,
  })

  return sendSuccess(res, pact, 201)
}

export async function assignVerifierController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const pact = await assignVerifier(req.params.id, {
    id: req.body.id,
    name: String(req.body.name || ''),
    email: req.body.email,
    license: req.body.license,
  })

  return sendSuccess(res, pact)
}

export async function verifierSignOffController(req: Request, res: Response) {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const signed = await verifierSignOff(req.params.id, req.user.id, String(req.body.signature || ''))
  return sendSuccess(res, signed)
}

export async function searchVerifiersController(req: Request, res: Response) {
  const q = String(req.query.q || '')
  const verifiers = searchVerifiers(q)
  return sendSuccess(res, verifiers)
}

export async function generateDocumentHashController(req: Request, res: Response) {
  const raw = String(req.body.base64 || '')
  const buffer = Buffer.from(raw, 'base64')
  const hash = generateDocumentHash(buffer)
  return sendSuccess(res, { hash })
}
