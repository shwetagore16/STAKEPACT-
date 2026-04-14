import { Router } from 'express'
import {
  assignVerifierController,
  createLegalPactController,
  getAllLegalPactsController,
  getLegalPactByIdController,
  searchVerifiersController,
  verifierSignOffController,
} from './legal.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.get('/pacts', getAllLegalPactsController)
router.get('/pacts/:id', getLegalPactByIdController)
router.post('/pacts', authMiddleware, createLegalPactController)
router.post('/pacts/:id/verifier', authMiddleware, assignVerifierController)
router.post('/pacts/:id/signoff', authMiddleware, verifierSignOffController)
router.get('/verifiers', searchVerifiersController)

export default router
