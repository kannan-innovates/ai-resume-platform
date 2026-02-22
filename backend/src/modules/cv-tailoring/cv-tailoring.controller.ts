
import { Request, Response } from 'express'
import { tailorResume, autoApplyStub } from './cv-tailoring.service'

export async function tailorResumeController(req: Request, res: Response) {
  try {
    const { resumeId, jobDescription } = req.body
    if (!resumeId || !jobDescription) {
      res.status(400).json({ success: false, message: 'resumeId and jobDescription are required' })
      return
    }
    const result = await tailorResume(resumeId, jobDescription)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500).json({
      success: false, message: error.message
    })
  }
}

export async function autoApplyController(req: Request, res: Response) {
  try {
    const { resumeId, jobUrl } = req.body
    if (!resumeId || !jobUrl) {
      res.status(400).json({ success: false, message: 'resumeId and jobUrl are required' })
      return
    }
    const result = await autoApplyStub(resumeId, jobUrl)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}