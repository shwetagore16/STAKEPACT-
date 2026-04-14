import { Router } from 'express'
import {
  createPersonalPactController,
  getActiveChallengesController,
  getAllPersonalPactsController,
  getPersonalPactByIdController,
  updateGoalProgressController,
  verifyStravaDataController,
} from './personal.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.get('/pacts', getAllPersonalPactsController)
router.get('/pacts/:id', getPersonalPactByIdController)
router.post('/pacts', authMiddleware, createPersonalPactController)
router.put('/pacts/:id/progress', authMiddleware, updateGoalProgressController)
router.get('/challenges', getActiveChallengesController)
router.post('/verify/strava', authMiddleware, verifyStravaDataController)

export default router
