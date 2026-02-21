import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A2F45',
          color: '#F0F6FF',
          border: '1px solid #1E3A5F',
          fontSize: '14px',
          fontFamily: 'DM Sans, sans-serif',
        },
        success: {
          iconTheme: { primary: '#10B981', secondary: '#1A2F45' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#1A2F45' },
        },
      }}
    />
  </StrictMode>
)