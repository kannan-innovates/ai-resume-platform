
import { Resume } from '../resume/resume.model'
import { JOB_SKILLS } from '../../shared/datasets/job-skills.dataset'
import { COURSES } from '../../shared/datasets/courses.dataset'
import { SkillGapResult } from './skill-gap.types'

export async function analyzeSkillGap(resumeId: string, dreamJob: string): Promise<SkillGapResult> {
  
  const resume = await Resume.findById(resumeId)
  if (!resume) throw new Error('Resume not found')

  
  const normalizedJob = dreamJob.toLowerCase().trim()
  const requiredSkills = JOB_SKILLS[normalizedJob]

  if (!requiredSkills) {
    const available = Object.keys(JOB_SKILLS).join(', ')
    throw new Error(`Dream job "${dreamJob}" not found. Available: ${available}`)
  }

  const currentSkills = resume.skills 

  // 3. Compute gap
  const matchedSkills = requiredSkills.filter(skill => currentSkills.includes(skill))
  const missingSkills = requiredSkills.filter(skill => !currentSkills.includes(skill))
  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100)

  // 4. Recommend courses for missing skills only
  const recommendedCourses = COURSES.filter(course => missingSkills.includes(course.skill))

  return {
    resumeId,
    dreamJob: normalizedJob,
    currentSkills,
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage,
    recommendedCourses,
  }
}