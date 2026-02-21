
import { useRef, useState, type DragEvent } from 'react'
import Spinner from '../../../shared/components/Spinner'
import { uploadResume } from './api'
import toast from 'react-hot-toast'

interface Props {
  onUploaded: (resume: unknown) => void
}

export default function UploadZone({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  

  async function handleFile(file: File) {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowed.includes(file.type)) {
    toast.error('Only PDF or DOCX files are supported.')
    return
  }
  setLoading(true)
  try {
    const resume = await uploadResume(file)
    toast.success('Resume uploaded successfully!')
    onUploaded(resume)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Upload failed. Try again.')
  } finally {
    setLoading(false)
  }
}

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '60px 40px',
        textAlign: 'center',
        cursor: loading ? 'default' : 'pointer',
        background: dragging ? 'rgba(0,174,239,0.05)' : 'var(--bg-surface)',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Spinner size={32} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Processing your resume...</p>
        </div>
      ) : (
        <>
          {/* Upload icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              background: 'rgba(0,174,239,0.1)',
            }}
          >
            <span style={{ fontSize: '28px' }}>↑</span>
          </div>

          <h3
            style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}
          >
            Drop your resume here
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
            or click to browse
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            PDF or DOCX · Max 5MB
          </p>
        </>
      )}

      
    </div>
  )
}