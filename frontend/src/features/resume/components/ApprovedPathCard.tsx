import { useEffect, useState } from 'react'
import api from '../../../shared/lib/axios'
import Spinner from '../../../shared/components/Spinner'

export default function ApprovedPathCard({ resumeId }: { resumeId: string }) {
  const [entry, setEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/admin-vault/resume/${resumeId}`)
      .then(res => setEntry(res.data.data))
      .catch(() => setEntry(null))
      .finally(() => setLoading(false))
  }, [resumeId])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Spinner size={20} /></div>
  if (!entry) return null

  return (
    <div style={{
      background: 'rgba(16,185,129,0.06)',
      border: '1px solid rgba(16,185,129,0.25)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px' }}>✓</span>
        <p style={{ color: 'var(--success)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Admin Approved Career Path
        </p>
      </div>

      {/* Approved role */}
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
        Recommended Role
      </p>
      <p style={{
        color: 'var(--text-primary)',
        fontSize: '22px',
        fontWeight: 700,
        fontFamily: 'Bricolage Grotesque',
        textTransform: 'capitalize',
        marginBottom: '16px',
      }}>
        {entry.approvedCareerPath}
      </p>

      {/* Admin notes */}
      {entry.adminNotes && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            Admin Notes
          </p>
          <p style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            lineHeight: 1.6,
            fontStyle: 'italic',
            background: 'rgba(0,0,0,0.15)',
            padding: '12px 14px',
            borderRadius: '8px',
          }}>
            "{entry.adminNotes}"
          </p>
        </div>
      )}

      {/* Skill gaps admin flagged */}
      {entry.skillGapSummary?.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Skills to Work On
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {entry.skillGapSummary.map((s: string) => (
              <span key={s} style={{
                background: 'rgba(245,158,11,0.1)',
                color: 'var(--warning)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '6px',
                padding: '3px 12px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Approved date */}
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px' }}>
        Approved on {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}
