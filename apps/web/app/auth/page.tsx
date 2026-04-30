'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, ArrowRight, Loader2, Shield, Star, Users } from 'lucide-react'
import { api } from '@/lib/api'

export default function AuthPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function formatPhone(value: string) {
    return value.replace(/\D/g, '').slice(0, 10)
  }

  async function handleSubmit() {
    setError('')
    const normalized = phone.startsWith('0') ? phone : '0' + phone
    if (normalized.length !== 10) { setError('Enter a valid 10-digit Kenyan number'); return }
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
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', fontFamily: 'var(--font-inter)' }}>

      {/* Left — branding panel */}
      <div style={{
        width: '50%', background: 'var(--ink)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '80px 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(91,33,182,0.15)', borderRadius: '50%', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(91,33,182,0.08)', borderRadius: '50%', bottom: '-80px', left: '-60px' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '48px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
              Sote
            </div>
          </Link>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: '48px' }}>
            You are not a stranger here.
          </div>

          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '20px' }}>
            Kenya's neighbourhood trust marketplace
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '48px' }}>
            Trade, barter, gift, donate and share meals — safely within 3km of home, with verified neighbours.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { Icon: Shield, title: 'Phone Verified', sub: 'Every user verified with their Kenyan number' },
              { Icon: Star,   title: 'Trust Scores',   sub: 'Reputation built through every exchange'     },
              { Icon: Users,  title: 'Safe Meetups',   sub: 'Meet at verified community safe spots'       },
            ].map(item => {
              const Icon = item.Icon
              return (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(91,33,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--violet-light)" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 72px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
            Welcome back
          </div>
          <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '40px' }}>
            Enter your phone number to sign in or create an account
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
              Phone number
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: '12px', padding: '14px 16px',
              background: 'var(--white)',
              transition: 'border-color 0.2s',
            }}>
              <Phone size={18} color="var(--muted)" strokeWidth={1.8} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink2)', paddingRight: '12px', borderRight: '1.5px solid var(--border)' }}>+254</span>
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '16px', fontFamily: 'var(--font-inter)',
                  color: 'var(--ink)', outline: 'none',
                }}
              />
            </div>
            {error && <div style={{ fontSize: '13px', color: 'var(--red)', marginTop: '8px' }}>{error}</div>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || phone.length < 9}
            style={{
              width: '100%', padding: '16px',
              background: loading || phone.length < 9 ? 'var(--border)' : 'var(--violet)',
              color: loading || phone.length < 9 ? 'var(--muted)' : 'white',
              border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700,
              cursor: loading || phone.length < 9 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading || phone.length < 9 ? 'none' : '0 8px 24px rgba(91,33,182,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
              : <><ArrowRight size={18} strokeWidth={2.5} /> Get verification code</>
            }
          </button>

          <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, textAlign: 'center' }}>
            By continuing you agree to Sote's terms of service. Your number is never shared with other users.
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}