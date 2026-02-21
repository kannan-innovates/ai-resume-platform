import api from '../../shared/lib/axios'

export async function getAllResumes() {
  const res = await api.get('/resumes')
  return res.data.data
}

export async function getVaultEntries() {
  const res = await api.get('/admin-vault')
  return res.data.data
}


export async function approveCareerPath(data: {
  resumeId: string
  approvedCareerPath: string
  adminNotes: string
  skillGapSummary: string[]
}) {
  const res = await api.post('/admin-vault', { ...data, status: 'approved' })
  return res.data.data
}

export async function getResumeById(id: string) {
  const res = await api.get(`/resumes/${id}`)
  return res.data.data
}

export async function getSkillGapAdmin(resumeId: string, dreamJob: string) {
  const res = await api.post('/skill-gap/analyze', { resumeId, dreamJob })
  return res.data.data
}

export async function getCareerPivotAdmin(resumeId: string) {
  const res = await api.get(`/career-pivot/${resumeId}/predict`)
  return res.data.data
}