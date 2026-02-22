
export interface CreateVaultEntry {
  resumeId: string
  approvedCareerPath: string
  adminNotes?: string
  skillGapSummary?: string[]
  status?: 'approved' | 'rejected' | 'needs_review'
}