'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { api } from '@/lib/api'

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('sote_phone')
    if (!stored) { router.push('/auth'); return }
    setPhone(stored)
    inputs.current[0]?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    if (value && index < 5) inputs.current[index + 1]?.focus()
    if (newCode.every(d => d !== '')) handleVerify(newCode.join(''))
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  async function handleVerify(fullCode?: string) {
    const otp = fullCode || code.join('')
    if (otp.length !== 6) return
    setError('')
    setLoading(true)

    try {
      const data: any = await api.verifyOtp(phone, otp)
      localStorage.setItem('sote_token', data.token)
      localStorage.setItem('sote_user', JSON.stringify(data.user))

      if (data.isNewUser) {
        router.push('/auth/profile')
      } else {
        router.push('/feed')
      }
    } catch (err: any) {
      setError('Invalid code. Please try again.')
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await api.requestOtp(phone)
      setError('')
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } catch {
      setError('Failed to resend. Try again.')
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
      {/* Back button */}
      <button
        onClick={() => router.push('/auth')}
        style={{
          marginTop: '56px',
          alignSelf: 'flex-start',
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--muted)',
          fontSize: '14px',
          fontWeight: 500,
          padding: '8px 0',
        }}
      >
        <ArrowLeft size={18} strokeWidth={2} />
        Back
      </button>

      {/* Header */}
      <div style={{ marginTop: '32px', marginBottom: '40px' }}>
        <div style={{
          width: '52px', height: '52px',
          background: 'var(--green-pale)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <MessageSquare size={26} color="var(--green)" strokeWidth={1.8} />
        </div>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '26px',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          Check your messages
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
          We sent a 6-digit code to<br />
          <strong style={{ color: 'var(--ink)' }}>{phone}</strong>
        </div>
      </div>

      {/* OTP inputs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {code.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              flex: 1,
              height: '58px',
              textAlign: 'center',
              fontSize: '24px',
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 700,
              border: '1.5px solid',
              borderColor: digit ? 'var(--green)' : error ? 'var(--red)' : 'var(--border)',
              borderRadius: '12px',
              background: digit ? 'var(--green-pale)' : '#ffffff',
              color: 'var(--ink)',
              outline: 'none',
              transition: 'all 0.15s',
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{
          fontSize: '13px',
          color: 'var(--red)',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      <button
        onClick={() => handleVerify()}
        disabled={loading || code.some(d => !d)}
        style={{
          width: '100%',
          padding: '16px',
          background: loading || code.some(d => !d) ? 'var(--border)' : 'var(--green)',
          color: loading || code.some(d => !d) ? 'var(--muted)' : 'white',
          border: 'none',
          borderRadius: '12px',
          fontFamily: 'var(--font-fraunces)',
          fontSize: '16px',
          fontWeight: 700,
          cursor: loading || code.some(d => !d) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {loading ? (
          <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
        ) : 'Verify code'}
      </button>

      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
        Didn't receive it?{' '}
        <button
          onClick={handleResend}
          style={{
            background: 'none', border: 'none',
            color: 'var(--green)', fontWeight: 600,
            cursor: 'pointer', fontSize: '13px',
          }}
        >
          Resend code
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