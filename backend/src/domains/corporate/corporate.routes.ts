import { Router } from 'express'
import {
  createCorporatePactController,
  getAllCorporatePactsController,
  getCorporatePactByIdController,
  updateMilestoneController,
} from './corporate.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.get('/pacts', getAllCorporatePactsController)
router.get('/pacts/:id', getCorporatePactByIdController)
router.post('/pacts', authMiddleware, createCorporatePactController)
router.put('/pacts/:id/milestones/:milestoneId', authMiddleware, updateMilestoneController)

export default router
