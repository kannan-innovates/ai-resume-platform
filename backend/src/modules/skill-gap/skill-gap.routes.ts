
import { Router } from 'express'
import { skillGapController } from './skill-gap.controller'

const router = Router()

router.post('/analyze', skillGapController)

export default router