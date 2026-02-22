
import { Request, Response } from 'express'
import { createVaultEntry, getAllVaultEntries, getVaultEntryByResume } from './admin-vault.service'

export async function createVaultEntryController(req: Request, res: Response) {
  try {
    const entry = await createVaultEntry(req.body)
    res.status(201).json({ success: true, data: entry })
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500).json({
      success: false, message: error.message
    })
  }
}

export async function getAllVaultEntriesController(_req: Request, res: Response) {
  try {
    const entries = await getAllVaultEntries()
    res.status(200).json({ success: true, data: entries })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function getVaultByResumeController(req: Request, res: Response) {
  try {
    const entry = await getVaultEntryByResume(req.params.resumeId as string)
    if (!entry) {
      res.status(404).json({ success: false, message: 'No vault entry for this resume' })
      return
    }
    res.status(200).json({ success: true, data: entry })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}