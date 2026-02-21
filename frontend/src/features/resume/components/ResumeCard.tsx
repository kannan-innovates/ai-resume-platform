// src/features/resume/components/ResumeCard.tsx

import Badge from '../../../shared/components/Badge'

interface Props {
  resume: any
  onAnalyze: () => void
  analyzing: boolean
}

export default function ResumeCard({ resume, onAnalyze, analyzing }: Props) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '28px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className="text-lg font-semibold mb-1"
            style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)' }}
          >
            {resume.fileName}
          </h3>
          <div className="flex items-center gap-2">
            <Badge label={resume.status} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              {resume.fileType.toUpperCase()} · {new Date(resume.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={analyzing || resume.status === 'analyzed' || resume.status === 'approved'}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: analyzing ? 'default' : 'pointer',
            opacity: (analyzing || resume.status !== 'pending') ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {analyzing 
            ? 'Analyzing...' 
            : resume.status === 'approved' 
              ? 'Approved ✓' 
              : resume.status === 'analyzed' 
                ? 'Analyzed ✓' 
                : 'Run AI Analysis'}
        </button>
      </div>

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Detected Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill: string) => (
              <span
                key={skill}
                style={{
                  background: 'rgba(0,174,239,0.08)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(0,174,239,0.2)',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Education
          </p>
          {resume.education.map((e: string, i: number) => (
            <p key={i} style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{e}</p>
          ))}
        </div>
      )}

      {/* Location */}
      {resume.location && (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          📍 {resume.location}
        </p>
      )}
    </div>
  )
}