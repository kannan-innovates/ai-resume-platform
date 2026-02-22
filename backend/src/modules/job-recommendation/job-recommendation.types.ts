
import { Job } from '../../shared/datasets/jobs.dataset'

export interface ScoredJob extends Job {
  matchScore: number
  matchedSkills: string[]
}

export interface JobRecommendationResult {
  resumeId: string
  candidateSkills: string[]
  recommendations: ScoredJob[]
}