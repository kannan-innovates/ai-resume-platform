export interface AIAnalysisResult {
  summary: string
  strengths: string[]
  weaknesses: string[]
  missing_keywords: string[]
  ats_score: number          // 0-100
  improvement_suggestions: string[]
}