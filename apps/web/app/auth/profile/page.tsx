'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('sote_token')
    if (!token) router.push('/auth')
  }, [])

  async function handleSubmit() {
    setError('')
    if (name.trim().length < 2) { setError('Enter your full name'); return }
    if (neighbourhood.trim().length < 2) { setError('Enter your neighbourhood'); return }

    setLoading(true)
    try {
      const data: any = await api.updateProfile({
        name: name.trim(),
        neighbourhood: neighbourhood.trim(),
      })
      localStorage.setItem('sote_user', JSON.stringify(data.user))
      router.push('/feed')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 24px',
    }}>
      <div style={{ paddingTop: '80px', marginBottom: '40px' }}>
        <div style={{
          width: '52px', height: '52px',
          background: 'var(--green-pale)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <User size={26} color="var(--green)" strokeWidth={1.8} />
        </div>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '26px',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          Set up your profile
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
          Your neighbours will see your name and area. No other details are shared.
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px 24px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(26,21,16,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Name input */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
            Your name
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            padding: '14px 16px',
            background: 'var(--cream)',
          }}>
            <User size={17} color="var(--muted)" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="e.g. Wanjiku Mwangi"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Neighbourhood input */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
            Your neighbourhood
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            padding: '14px 16px',
            background: 'var(--cream)',
          }}>
            <MapPin size={17} color="var(--muted)" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="e.g. Kawangware, Nairobi"
              value={neighbourhood}
              onChange={e => setNeighbourhood(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ fontSize: '13px', color: 'var(--red)' }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? 'var(--border)' : 'var(--green)',
            color: loading ? 'var(--muted)' : 'white',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-fraunces)',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          {loading ? (
            <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              Enter Sote
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}