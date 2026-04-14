import { Router } from 'express'
import {
  addToWaitlistController,
  getGovernmentInfoController,
  getWaitlistCountController,
} from './government.controller'

const router = Router()

router.get('/waitlist/count', getWaitlistCountController)
router.post('/waitlist', addToWaitlistController)
router.get('/info', getGovernmentInfoController)

export default router
