import { useState, useEffect } from 'react'
import { useAuth } from '../features/auth/useAuth'
import Spinner from '../shared/components/Spinner'
import toast from 'react-hot-toast'
import api from '../shared/lib/axios'

export default function CVTailorPage() {
  const { user } = useAuth()
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applyResult, setApplyResult] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`sm_resume_${user?.id}`)
    if (saved) setResumeId(saved)
  }, [user?.id])

  async function handleTailor() {
    if (!resumeId) { toast.error('Please upload a resume first'); return }
    if (!jobDescription.trim()) { toast.error('Paste a job description first'); return }
    setLoading(true)
    try {
      const res = await api.post('/cv/tailor', { resumeId, jobDescription })
      setResult(res.data.data.tailored)
      toast.success('Resume tailored successfully!')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Tailoring failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoApply() {
    if (!resumeId) return
    setApplying(true)
    try {
      const res = await api.post('/cv/auto-apply', {
        resumeId,
        jobUrl: 'https://linkedin.com/jobs/react-razorpay', // stub URL
      })
      setApplyResult(res.data.data)
      toast.success('Auto-apply workflow initiated!')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Auto-apply failed')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          CV Tailoring
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Paste a job description and we'll tailor your resume for it.
        </p>
      </div>

      {!resumeId && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
          <p style={{ color: 'var(--warning)' }}>⚠ No resume found. Please upload a resume first from the Upload page.</p>
        </div>
      )}

      {resumeId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Job Description
            </p>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              style={{
                width: '100%', background: 'var(--bg-surface)',
                border: '1px solid var(--border)', borderRadius: '8px',
                padding: '12px 14px', color: 'var(--text-primary)',
                fontSize: '14px', outline: 'none', resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
            <button
              onClick={handleTailor}
              disabled={loading}
              style={{
                marginTop: '12px', background: 'var(--accent)',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '11px 24px', fontWeight: 600, fontSize: '14px',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              {loading ? <><Spinner size={16} /> Tailoring...</> : '✦ Tailor My Resume'}
            </button>
          </div>

          {result && (
            <>
              {/* Tailored Summary */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Tailored Summary</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.7 }}>{result.tailoredSummary}</p>
              </div>

              {/* Cover Letter */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Cover Letter Opener</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.7, fontStyle: 'italic' }}>"{result.coverLetterSnippet}"</p>
              </div>

              {/* Highlighted Skills */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Skills to Highlight</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.highlightedSkills?.map((s: string) => (
                    <span key={s} style={{ background: 'rgba(0,174,239,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,174,239,0.2)', borderRadius: '6px', padding: '4px 12px', fontSize: '13px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tailored Bullets */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Rewritten Bullets</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.tailoredBullets?.map((b: string, i: number) => (
                    <li key={i} style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>→</span> {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auto Apply Stub */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '24px',
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Auto Apply
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
                  Stub workflow — simulates auto-filling job applications. Chrome extension integration ready for future.
                </p>

                <button
                  onClick={handleAutoApply}
                  disabled={applying || !!applyResult}
                  style={{
                    background: applyResult ? 'transparent' : 'var(--bg-surface)',
                    color: applyResult ? 'var(--success)' : 'var(--text-primary)',
                    border: `1px solid ${applyResult ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                    borderRadius: '8px', padding: '10px 20px', fontSize: '14px',
                    fontWeight: 600, cursor: (applying || applyResult) ? 'default' : 'pointer',
                    opacity: applying ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  {applying
                    ? <><Spinner size={14} /> Initiating...</>
                    : applyResult
                      ? '✓ Auto-Apply Initiated'
                      : '⚡ Stub Auto Apply'}
                </button>

                {applyResult && (
                  <div style={{
                    marginTop: '16px', padding: '14px',
                    background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '10px',
                  }}>
                    <p style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                      {applyResult.message}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {Object.entries(applyResult.simulatedFields).map(([key, val]) => (
                        <p key={key} style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{key}:</span> {val as string}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}