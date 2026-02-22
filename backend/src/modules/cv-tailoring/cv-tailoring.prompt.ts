
export function buildTailoringPrompt(rawText: string, jobDescription: string): string {
     return `
You are an expert resume writer and career coach.
Given the candidate's resume and a job description, rewrite the resume summary and skills section to be tailored for that specific job.
Return a JSON object ONLY — no markdown, no explanation.

Resume:
"""
${rawText}
"""

Job Description:
"""
${jobDescription}
"""

Return exactly this JSON:
{
  "tailoredSummary": "rewritten profile summary optimized for this job",
  "highlightedSkills": ["skill1", "skill2"],
  "tailoredBullets": ["achievement rewritten for this job", "another bullet"],
  "coverLetterSnippet": "2-3 sentence cover letter opener for this role"
}

Return ONLY the JSON. No text before or after.
`
}