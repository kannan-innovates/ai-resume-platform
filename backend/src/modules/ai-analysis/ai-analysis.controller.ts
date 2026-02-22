
import { Request, Response } from 'express'
import { analyzeResume } from './ai-analysis.service'

export async function analyzeResumeController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await analyzeResume(id as string)

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: result,
    })
  } catch (error: any) {
    const isNotFound = error.message?.includes('not found')
    res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Analysis failed',
    })
  }
}