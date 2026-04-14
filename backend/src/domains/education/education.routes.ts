import { Router } from 'express'
import {
  createStudyCircleController,
  getAllEducationPactsController,
  getEducationPactByIdController,
  getStudyCircleStatsController,
  submitStudyProofController,
} from './education.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.get('/pacts', getAllEducationPactsController)
router.get('/pacts/:id', getEducationPactByIdController)
router.post('/pacts', authMiddleware, createStudyCircleController)
router.post('/pacts/:id/proof', authMiddleware, submitStudyProofController)
router.get('/stats', getStudyCircleStatsController)

export default router
