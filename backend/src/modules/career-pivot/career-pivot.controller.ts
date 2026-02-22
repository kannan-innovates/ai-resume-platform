import { Request, Response } from 'express'
import { predictCareerPaths } from './career-pivot.service'

export async function careerPivotController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await predictCareerPaths(id as string)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    const isNotFound = error.message?.includes('not found')
    res.status(isNotFound ? 404 : 500).json({ success: false, message: error.message })
  }
}