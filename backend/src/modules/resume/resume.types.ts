export interface ParsedResume {
     rawText: string
     skills: string[]
     education: string[]
     experience: string[]
     location: string
     fileName: string
     fileType: 'pdf' | 'docx'
}