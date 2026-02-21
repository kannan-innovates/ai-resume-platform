import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import UploadZone from '../features/resume/components/UploadZone'
import ResumeCard from '../features/resume/components/ResumeCard'
import { analyzeResume,getResumeById } from '../features/resume/components/api'
import toast from 'react-hot-toast'
import Spinner from '../shared/components/Spinner'
import ApprovedPathCard from '../features/resume/components/ApprovedPathCard'

export default function HomePage() {
  const [resume, setResume] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  // On mount — restore last uploaded resume from localStorage
  useEffect(() => {
    const savedId = localStorage.getItem(`sm_resume_${user?.id}`)
    if (savedId) {
      getResumeById(savedId)
        .then(setResume)
        .catch(() => {
          // Resume deleted or not found — clear it
          localStorage.removeItem(`sm_resume_${user?.id}`)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user?.id])

  function handleUploaded(resume: any) {
    // Save resume ID per user so it survives refresh
    localStorage.setItem(`sm_resume_${user?.id}`, resume._id)
    setResume(resume)
  }

  function handleClear() {
    localStorage.removeItem(`sm_resume_${user?.id}`)
    setResume(null)
  }

  async function handleAnalyze() {
    if (!resume) return
    setAnalyzing(true)
    try {
      const result = await analyzeResume(resume._id)
      setResume((prev: any) => ({ ...prev, status: 'analyzed', aiAnalysis: result.analysis }))
      toast.success('AI analysis complete!')
    } catch {
      toast.error('Analysis failed. Try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner size={36} />
    </div>
  )

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Upload Resume
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Upload your resume and let SkillMount analyze your career potential.
        </p>
      </div>

      {!resume && <UploadZone onUploaded={handleUploaded} />}

      {resume && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ResumeCard
            resume={resume}
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
          />

          {/* Approved Career Path Banner */}
          {resume?.status === 'approved' && (
            <ApprovedPathCard resumeId={resume._id} />
          )}

          {resume.status === 'analyzed' && (
            <button
              onClick={() => navigate(`/dashboard/${resume._id}`)}
              style={{
                background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: '10px',
                padding: '14px', fontSize: '15px', fontWeight: 600,
                cursor: 'pointer', width: '100%',
              }}
            >
              View Full Dashboard →
            </button>
          )}

          <button
            onClick={handleClear}
            style={{
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border)', borderRadius: '10px',
              padding: '12px', fontSize: '14px', cursor: 'pointer', width: '100%',
            }}
          >
            Upload a different resume
          </button>
        </div>
      )}
    </div>
  )
}