import { Resume } from '../resume/resume.model'
import { JOB_SKILLS } from '../../shared/datasets/job-skills.dataset'
import { CareerPivotResult, CareerPath } from './career-pivot.types'

function getDifficulty(matchPercentage: number): 'easy' | 'moderate' | 'hard' {
  if (matchPercentage >= 70) return 'easy'
  if (matchPercentage >= 40) return 'moderate'
  return 'hard'
}

export async function predictCareerPaths(resumeId: string): Promise<CareerPivotResult> {
  const resume = await Resume.findById(resumeId)
  if (!resume) throw new Error('Resume not found')

  const currentSkills = resume.skills

  // Score every job role in our dataset
  const suggestedPaths: CareerPath[] = Object.entries(JOB_SKILLS)
    .map(([role, requiredSkills]) => {
      const matchedSkills = requiredSkills.filter(s => currentSkills.includes(s))
      const missingSkills = requiredSkills.filter(s => !currentSkills.includes(s))
      const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100)

      return {
        role,
        matchPercentage,
        matchedSkills,
        missingSkills,
        transitionDifficulty: getDifficulty(matchPercentage),
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage) // highest match first

  return {
    resumeId,
    currentSkills,
    suggestedPaths,
  }
}