
import { Router } from 'express'
import { jobRecommendationController } from './job-recommendation.controller'

const router = Router()

router.get('/:id/recommend', jobRecommendationController)

export default router