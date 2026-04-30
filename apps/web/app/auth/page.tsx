'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function AuthPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '')
    return digits.slice(0, 10)
  }

  async function handleSubmit() {
    setError('')
    const normalized = phone.startsWith('0') ? phone : '0' + phone
    if (normalized.length !== 10) {
      setError('Enter a valid 10-digit Kenyan number')
      return
    }

    setLoading(true)
    try {
      await api.requestOtp(normalized)
      localStorage.setItem('sote_phone', normalized)
      router.push('/auth/verify')
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
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
      {/* Header */}
      <div style={{ paddingTop: '80px', marginBottom: '48px' }}>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '48px',
          fontWeight: 900,
          color: 'var(--green)',
          lineHeight: 1,
          marginBottom: '12px',
        }}>
          Sote
        </div>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '26px',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--ink2)',
          marginBottom: '10px',
        }}>
          All of us, together.
        </div>
        <div style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7 }}>
          Kenya's neighbourhood marketplace — trade, barter, gift and share within 3km of home.
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px 24px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(26,21,16,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: '6px',
        }}>
          Enter your number
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
          We'll send a verification code via SMS
        </div>

        {/* Phone input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1.5px solid',
          borderColor: error ? 'var(--red)' : 'var(--border)',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '12px',
          background: 'var(--cream)',
          transition: 'border-color 0.2s',
        }}>
          <Phone size={18} color="var(--muted)" strokeWidth={1.8} />
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--ink2)',
            paddingRight: '8px',
            borderRight: '1.5px solid var(--border)',
          }}>
            +254
          </span>
          <input
            type="tel"
            placeholder="0712 345 678"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              fontFamily: 'var(--font-epilogue)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
        </div>

        {error && (
          <div style={{
            fontSize: '13px',
            color: 'var(--red)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || phone.length < 9}
          style={{
            width: '100%',
            padding: '16px',
            background: loading || phone.length < 9 ? 'var(--border)' : 'var(--green)',
            color: loading || phone.length < 9 ? 'var(--muted)' : 'white',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-fraunces)',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading || phone.length < 9 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              Get verification code
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '24px',
        fontSize: '12px',
        color: 'var(--muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        By continuing you agree to Sote's terms of service.{' '}
        Your number is never shared with other users.
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