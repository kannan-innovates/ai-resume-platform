export interface CareerPath {
  role: string
  matchPercentage: number
  matchedSkills: string[]
  missingSkills: string[]
  transitionDifficulty: 'easy' | 'moderate' | 'hard'
}

export interface CareerPivotResult {
  resumeId: string
  currentSkills: string[]
  suggestedPaths: CareerPath[]
}