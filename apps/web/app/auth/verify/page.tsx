'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
    if (e.key === 'Backspace' && !code[index] && index > 0) inputs.current[index - 1]?.focus()
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
      router.push(data.isNewUser ? '/auth/profile' : '/feed')
    } catch {
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
    } catch { setError('Failed to resend. Try again.') }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', fontFamily: 'var(--font-inter)' }}>

      {/* Left panel */}
      <div style={{ width: '50%', background: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(91,33,182,0.15)', borderRadius: '50%', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '48px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>Sote</div>
          </Link>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: '48px' }}>You are not a stranger here.</div>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(91,33,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <MessageSquare size={30} color="var(--violet-light)" strokeWidth={1.8} />
          </div>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '16px' }}>Check your messages</div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
            We sent a 6-digit verification code to<br />
            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{phone}</strong>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 72px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <button onClick={() => router.push('/auth')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '14px', fontWeight: 500, marginBottom: '32px', fontFamily: 'var(--font-inter)', padding: 0 }}>
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>

          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>Enter your code</div>
          <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '32px' }}>6-digit code sent to {phone}</div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                type="tel" maxLength={1} value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  flex: 1, height: '64px', textAlign: 'center',
                  fontSize: '28px', fontFamily: 'var(--font-syne)', fontWeight: 700,
                  border: '1.5px solid',
                  borderColor: digit ? 'var(--violet)' : error ? 'var(--red)' : 'var(--border)',
                  borderRadius: '14px',
                  background: digit ? 'var(--violet-pale)' : 'var(--white)',
                  color: 'var(--ink)', outline: 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>

          {error && <div style={{ fontSize: '14px', color: 'var(--red)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

          <button
            onClick={() => handleVerify()}
            disabled={loading || code.some(d => !d)}
            style={{
              width: '100%', padding: '16px',
              background: loading || code.some(d => !d) ? 'var(--border)' : 'var(--violet)',
              color: loading || code.some(d => !d) ? 'var(--muted)' : 'white',
              border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700,
              cursor: loading || code.some(d => !d) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginBottom: '20px',
              boxShadow: loading || code.some(d => !d) ? 'none' : '0 8px 24px rgba(91,33,182,0.35)',
            }}
          >
            {loading ? <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> : 'Verify code'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            Didn't receive it?{' '}
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--violet)', fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-inter)' }}>
              Resend code
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}