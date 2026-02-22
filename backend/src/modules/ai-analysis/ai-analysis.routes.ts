import { Router } from 'express'
import { analyzeResumeController } from './ai-analysis.controller'

const router = Router()


router.post('/:id/analyze', analyzeResumeController)

export default router