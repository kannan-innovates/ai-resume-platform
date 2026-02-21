// src/pages/AdminPage.tsx

import { useEffect, useState } from 'react'
import { getAllResumes, getVaultEntries, approveCareerPath } from '../features/admin/api'
import Badge from '../shared/components/Badge'
import Spinner from '../shared/components/Spinner'
import toast from 'react-hot-toast'

const JOB_OPTIONS = [
  'fullstack developer', 'frontend developer', 'backend developer',
  'devops engineer', 'data scientist', 'ml engineer', 'mobile developer',
]

const TABS = ['All Resumes', 'Approved Vault']

export default function AdminPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [vault, setVault] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('All Resumes')
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  // Approval form state
  const [careerPath, setCareerPath] = useState('')
  const [notes, setNotes] = useState('')

  const [reviewResume, setReviewResume] = useState<any>(null)
const [reviewData, setReviewData] = useState<{ skillGap?: any; careerPivot?: any }>({})
const [reviewLoading, setReviewLoading] = useState(false)
const [reviewJob, setReviewJob] = useState('')


  useEffect(() => {
    Promise.all([getAllResumes(), getVaultEntries()])
      .then(([r, v]) => { setResumes(r); setVault(v) })
      .finally(() => setLoading(false))
  }, [])

  async function handleApprove(resume: any) {
    if (!careerPath) return
    setApproving(resume._id)
    try {
      await approveCareerPath({
        resumeId: resume._id,
        approvedCareerPath: careerPath,
        adminNotes: notes,
        skillGapSummary: resume.skills?.slice(0, 3) ?? [],
      })
      // Refresh
      const [r, v] = await Promise.all([getAllResumes(), getVaultEntries()])
      setResumes(r)
      setVault(v)
      setReviewResume(null)
      setCareerPath('')
      setNotes('')
      toast.success('Career path approved!')
    } catch (e) {
      console.error(e)
      toast.error('Approval failed. Try again.')
    } finally {
      setApproving(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96"><Spinner size={36} /></div>
  )

  return (
    <>
      <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review resumes, approve career paths, manage vault.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Resumes', value: resumes.length, color: 'var(--accent)' },
          { label: 'Analyzed', value: resumes.filter(r => r.status === 'analyzed' || r.status === 'approved').length, color: 'var(--success)' },
          { label: 'Approved', value: vault.length, color: 'var(--warning)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: '36px', fontWeight: 700, fontFamily: 'Bricolage Grotesque' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', width: 'fit-content' }}
      >
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* All Resumes Tab */}
      {activeTab === 'All Resumes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resumes.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No resumes uploaded yet.</p>
          )}
          {resumes.map(resume => (
            <div
              key={resume._id}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>{resume.fileName}</h4>
                    <Badge label={resume.status} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {resume.skills?.length} skills · {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={async () => {
                      const { getResumeById } = await import('../features/admin/api')
                      const full = await getResumeById(resume._id)
                      setReviewResume(full)
                      setReviewData({})
                      setReviewJob('')
                      setCareerPath('')
                      setNotes('')
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vault Tab */}
      {activeTab === 'Approved Vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {vault.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No approved career paths yet.</p>
          )}
          {vault.map((entry: any) => (
            <div
              key={entry._id}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: '4px', textTransform: 'capitalize' }}>
                    {entry.approvedCareerPath}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {entry.resumeId?.fileName ?? 'Resume'} · {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge label={entry.status} />
              </div>

              {entry.adminNotes && (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', marginBottom: '10px' }}>
                  "{entry.adminNotes}"
                </p>
              )}

              {entry.skillGapSummary?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {entry.skillGapSummary.map((s: string) => (
                    <span key={s} style={{ background: 'rgba(0,174,239,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,174,239,0.2)', borderRadius: '6px', padding: '2px 10px', fontSize: '12px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
      {/* Resume Review Drawer */}
      {reviewResume && (
        <div style={{
          position: 'fixed', top: 0, right: 0,
          width: '520px', height: '100vh',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
          zIndex: 100, overflowY: 'auto', padding: '32px 28px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>
              Resume Review
            </h3>
            <button
              onClick={() => { setReviewResume(null); setReviewData({}) }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
            >✕</button>
          </div>

          {/* Resume info */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{reviewResume.fileName}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>{reviewResume.skills?.length} skills detected</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {reviewResume.skills?.map((s: string) => (
                <span key={s} style={{ background: 'rgba(0,174,239,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,174,239,0.2)', borderRadius: '6px', padding: '2px 10px', fontSize: '12px' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* AI Analysis summary */}
          {reviewResume.aiAnalysis && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>ATS Score</p>
              <p style={{ color: 'var(--accent)', fontSize: '32px', fontWeight: 700, fontFamily: 'Bricolage Grotesque', marginBottom: '8px' }}>
                {reviewResume.aiAnalysis.ats_score}<span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/100</span>
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.6 }}>{reviewResume.aiAnalysis.summary}</p>
            </div>
          )}

          {/* Skill Gap check */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Check Skill Gap</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={reviewJob}
                onChange={e => setReviewJob(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Select role...</option>
                {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <button
                onClick={async () => {
                  if (!reviewJob) return
                  setReviewLoading(true)
                  try {
                    const { getSkillGapAdmin } = await import('../features/admin/api')
                    const gap = await getSkillGapAdmin(reviewResume._id, reviewJob)
                    setReviewData(p => ({ ...p, skillGap: gap }))
                  } catch { toast.error('Failed to load skill gap') }
                  finally { setReviewLoading(false) }
                }}
                style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                {reviewLoading ? '...' : 'Go'}
              </button>
            </div>

            {reviewData.skillGap && (
              <div style={{ marginTop: '14px' }}>
                <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '24px', fontFamily: 'Bricolage Grotesque' }}>{reviewData.skillGap.matchPercentage}% match</p>
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden', margin: '8px 0 12px' }}>
                  <div style={{ height: '100%', width: `${reviewData.skillGap.matchPercentage}%`, background: 'var(--accent)', borderRadius: '999px' }} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>Missing:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {reviewData.skillGap.missingSkills?.map((s: string) => (
                    <span key={s} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '2px 10px', fontSize: '12px' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Approve section */}
          {reviewResume.status === 'analyzed' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Approve Career Path</p>
              <select
                value={careerPath}
                onChange={e => setCareerPath(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', marginBottom: '10px' }}
              >
                <option value="">Select career path...</option>
                {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Admin notes (optional)"
                rows={2}
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'none', marginBottom: '10px' }}
              />
              <button
                onClick={() => handleApprove(reviewResume)}
                disabled={!careerPath || approving === reviewResume._id}
                style={{ width: '100%', background: 'var(--success)', border: 'none', borderRadius: '8px', padding: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', opacity: (!careerPath || approving) ? 0.6 : 1 }}
              >
                {approving === reviewResume._id ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}