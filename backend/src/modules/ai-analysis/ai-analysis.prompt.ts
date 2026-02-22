export function buildResumeAnalysisPrompt(rawText: string): string {
  return `
You are an expert ATS (Applicant Tracking System) and career coach AI.
Analyze the following resume text and return a JSON object ONLY — no explanation, no markdown, no code blocks.

Resume Text:
"""
${rawText}
"""

Return exactly this JSON structure:
{
  "summary": "2-3 sentence professional summary of the candidate",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "missing_keywords": ["keyword1", "keyword2", "keyword3"],
  "ats_score": 75,
  "improvement_suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Rules:
- ats_score must be a number between 0 and 100
- strengths must have at least 3 items
- missing_keywords are important industry keywords absent from the resume
- improvement_suggestions must be actionable and specific
- Return ONLY the JSON. No text before or after.
`
}