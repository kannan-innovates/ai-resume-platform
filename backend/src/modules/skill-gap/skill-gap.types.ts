import { Course } from '../../shared/datasets/courses.dataset'

export interface SkillGapResult {
  resumeId: string
  dreamJob: string
  currentSkills: string[]
  requiredSkills: string[]
  missingSkills: string[]
  matchedSkills: string[]
  matchPercentage: number
  recommendedCourses: Course[]
}