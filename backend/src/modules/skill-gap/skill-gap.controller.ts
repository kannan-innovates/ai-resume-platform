
import { Request, Response } from 'express'
import { analyzeSkillGap } from './skill-gap.service'

export async function skillGapController(req: Request, res: Response) {
  try {
    const { resumeId, dreamJob } = req.body

    if (!resumeId || !dreamJob) {
      res.status(400).json({ success: false, message: 'resumeId and dreamJob are required' })
      return
    }

    const result = await analyzeSkillGap(resumeId, dreamJob)

    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    const isNotFound = error.message?.includes('not found')
    const isBadInput = error.message?.includes('not found. Available')
    res.status(isNotFound || isBadInput ? 400 : 500).json({
      success: false,
      message: error.message,
    })
  }
}