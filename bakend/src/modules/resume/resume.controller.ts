import { Request, Response } from 'express'
import { processAndSaveResume } from './resume.service'

export async function uploadResume(req: Request, res: Response) {
     try {
          if (!req.file) {
               res.status(400).json({ success: false, message: 'No file uploaded' })
               return
          }
          const resume = await processAndSaveResume(req.file, req.user?.userId as string)
          res.status(201).json({
               success: true,
               message: 'Resume uploaded and processed successfully',
               data: resume,
          })
     } catch (error: any) {
          const isClientError = error.message?.includes('Unsupported file type')
          res.status(isClientError ? 400 : 500).json({
               success: false,
               message: error.message || 'Internal server error',
          })
     }
}

export async function getAllResumes(req: Request, res: Response) {
     try {
          const { Resume } = await import('./resume.model')
          const filter = req.user?.role === 'admin' ? {} : { userId: req.user?.userId }
          const resumes = await Resume.find(filter, '-rawText')
          res.status(200).json({ success: true, data: resumes })
     } catch (error: any) {
          res.status(500).json({ success: false, message: error.message })
     }
}

export async function getResumeById(req: Request, res: Response) {
     try {
          const { Resume } = await import('./resume.model')
          const resume = await Resume.findById(req.params.id)
          if (!resume) {
               res.status(404).json({ success: false, message: 'Resume not found' })
               return
          }
          res.status(200).json({ success: true, data: resume })
     } catch (error: any) {
          res.status(500).json({ success: false, message: error.message })
     }
}