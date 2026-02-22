
import { Router } from 'express'
import { tailorResumeController, autoApplyController } from './cv-tailoring.controller'

const router = Router()

router.post('/tailor', tailorResumeController)
router.post('/auto-apply', autoApplyController)

export default router