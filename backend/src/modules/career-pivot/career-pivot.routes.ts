import { Router } from 'express'
import { careerPivotController } from './career-pivot.controller'

const router = Router()

router.get('/:id/predict', careerPivotController)

export default router