
import { Request, Response } from 'express'
import { getJobRecommendations } from './job-recommendation.service'

export async function jobRecommendationController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await getJobRecommendations(id as string)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500).json({
      success: false,
      message: error.message,
    })
  }
}