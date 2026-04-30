'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, MapPin, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('sote_token')) router.push('/auth')
  }, [])

  async function handleSubmit() {
    setError('')
    if (name.trim().length < 2) { setError('Enter your full name'); return }
    if (neighbourhood.trim().length < 2) { setError('Enter your neighbourhood'); return }
    setLoading(true)
    try {
      const data: any = await api.updateProfile({ name: name.trim(), neighbourhood: neighbourhood.trim() })
      localStorage.setItem('sote_user', JSON.stringify(data.user))
      router.push('/feed')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
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
            <Sparkles size={30} color="var(--violet-light)" strokeWidth={1.8} />
          </div>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '16px' }}>One last step</div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
            Tell your neighbours who you are. Your name and area help build trust in your community.
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 72px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>Set up your profile</div>
          <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '40px' }}>Your neighbours will see your name and area</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Your name</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)' }}>
                <User size={17} color="var(--muted)" strokeWidth={1.8} />
                <input type="text" placeholder="e.g. Wanjiku Mwangi" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Your neighbourhood</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)' }}>
                <MapPin size={17} color="var(--muted)" strokeWidth={1.8} />
                <input type="text" placeholder="e.g. Kawangware, Nairobi" value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none' }} />
              </div>
            </div>
          </div>

          {error && <div style={{ fontSize: '14px', color: 'var(--red)', marginBottom: '16px' }}>{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              background: loading ? 'var(--border)' : 'var(--violet)',
              color: loading ? 'var(--muted)' : 'white',
              border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(91,33,182,0.35)',
            }}
          >
            {loading ? <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> : <><ArrowRight size={18} strokeWidth={2.5} /> Enter Sote</>}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}