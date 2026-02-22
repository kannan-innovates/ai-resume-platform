// src/modules/admin-vault/admin-vault.service.ts

import { AdminVault } from './admin-vault.model'
import { Resume } from '../resume/resume.model'
import { CreateVaultEntry } from './admin-vault.types'

export async function createVaultEntry(data: CreateVaultEntry) {
  
  const resume = await Resume.findById(data.resumeId)
  if (!resume) throw new Error('Resume not found')

  
  resume.status = 'approved'
  await resume.save()

  const entry = await AdminVault.create(data)
  return entry
}

export async function getAllVaultEntries() {
  return AdminVault.find().populate('resumeId', 'fileName skills status')
}

export async function getVaultEntryByResume(resumeId: string) {
  return AdminVault.findOne({ resumeId }).populate('resumeId')
}