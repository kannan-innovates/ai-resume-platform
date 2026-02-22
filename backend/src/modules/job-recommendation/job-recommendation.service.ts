// src/modules/job-recommendation/job-recommendation.service.ts

import { Resume } from '../resume/resume.model'
import { AdminVault } from '../admin-vault/admin-vault.model'
import { JOBS } from '../../shared/datasets/jobs.dataset'
import { JobRecommendationResult, ScoredJob } from './job-recommendation.types'

// ─── Simulated Platform Fetchers (Stubs) ─────────────────────────
// In production these would call real APIs:
// Naukri: https://developer.naukri.com
// LinkedIn: https://api.linkedin.com/v2/jobSearch
// Indeed: https://apis.indeed.com/ads/apisearch

function fetchFromNaukri(skills: string[]) {
  return JOBS.filter(j => j.platform === 'naukri')
}

function fetchFromLinkedIn(skills: string[]) {
  return JOBS.filter(j => j.platform === 'linkedin')
}

function fetchFromIndeed(skills: string[]) {
  return JOBS.filter(j => j.platform === 'indeed')
}

// ─── Scoring Engine ───────────────────────────────────────────────

function scoreJobs(candidateSkills: string[]): ScoredJob[] {
  // Aggregate jobs from all platforms
  const allJobs = [
    ...fetchFromNaukri(candidateSkills),
    ...fetchFromLinkedIn(candidateSkills),
    ...fetchFromIndeed(candidateSkills),
  ]

  return allJobs
    .map(job => {
      const matchedSkills = job.requiredSkills.filter(s => candidateSkills.includes(s))
      const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
      return { ...job, matchScore, matchedSkills }
    })
    .filter(job => job.matchScore > 0)          // exclude zero matches
    .sort((a, b) => b.matchScore - a.matchScore) // highest match first
}

// ─── Main Service ─────────────────────────────────────────────────

export async function getJobRecommendations(resumeId: string): Promise<JobRecommendationResult> {
  const resume = await Resume.findById(resumeId)
  if (!resume) throw new Error('Resume not found')

  let candidateSkills = [...resume.skills]

  
  const vaultEntry = await AdminVault.findOne({ resumeId })
  if (vaultEntry) {
    const { JOB_SKILLS } = await import('../../shared/datasets/job-skills.dataset')
    const targetSkills = JOB_SKILLS[vaultEntry.approvedCareerPath] || []
    
    targetSkills.forEach(skill => {
      if (!candidateSkills.includes(skill)) candidateSkills.push(skill)
    })
  }

  const recommendations = scoreJobs(candidateSkills)

  return {
    resumeId,
    candidateSkills: resume.skills, 
    recommendations,
  }
}