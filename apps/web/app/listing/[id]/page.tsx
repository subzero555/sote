'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, MapPin, Star, ShoppingCart, ArrowLeftRight,
  Gift, LogOut, Shield, ChevronRight, Package,
  CheckCircle, Repeat, Heart, Inbox, Edit3
} from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { api } from '@/lib/api'

function getBadges(user: any) {
  const badges = []
  if (user.verificationStatus === 'VERIFIED') badges.push({ label: 'Verified', color: 'var(--trade)', bg: 'var(--trade-pale)', Icon: CheckCircle })
  if ((user.totalDeals || 0) >= 10) badges.push({ label: 'Trusted Trader', color: 'var(--gold)', bg: 'var(--gold-pale)', Icon: Star })
  if ((user.barterScore || 0) >= 30) badges.push({ label: 'Barter Ready', color: 'var(--barter)', bg: 'var(--barter-pale)', Icon: Repeat })
  if ((user.giveScore || 0) >= 50) badges.push({ label: 'Generous Jirani', color: 'var(--gift)', bg: 'var(--gift-pale)', Icon: Heart })
  return badges
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (!stored) { router.push('/auth'); return }
    setUser(JSON.parse(stored))
    api.getMe().then((data: any) => {
      localStorage.setItem('sote_user', JSON.stringify(data.user))
      setUser(data.user)
    }).catch(() => {})
  }, [])

  function handleLogout() {
    localStorage.removeItem('sote_token')
    localStorage.removeItem('sote_user')
    localStorage.removeItem('sote_phone')
    router.push('/auth')
  }

  async function handleAvatarUpload(url: string) {
    const stored = localStorage.getItem('sote_user')
    if (stored) {
      const u = JSON.parse(stored)
      u.avatarInitials = url
      localStorage.setItem('sote_user', JSON.stringify(u))
      setUser((prev: any) => ({ ...prev, avatarInitials: url }))
    }
  }

  if (!user) return null

  const isAvatarUrl = user.avatarInitials?.startsWith('http')
  const badges = getBadges(user)
  const scores = [
    { label: 'Trade Score',  value: user.tradeScore || 0,  Icon: ShoppingCart,  color: 'var(--trade)',  max: 100 },
    { label: 'Barter Score', value: user.barterScore || 0, Icon: ArrowLeftRight, color: 'var(--barter)', max: 100 },
    { label: 'Give Score',   value: user.giveScore || 0,   Icon: Gift,           color: 'var(--gift)',   max: 100 },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--ink)', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/feed" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px' }}>Sote</div>
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            Back to feed
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: '#FCA5A5', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            <LogOut size={14} strokeWidth={2} /> Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left — profile card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

            {/* Avatar + name */}
            <div style={{ background: 'var(--ink)', borderRadius: '24px', padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(91,33,182,0.15)', borderRadius: '50%', top: '-60px', right: '-60px' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <ImageUpload
                    images={isAvatarUrl ? [user.avatarInitials] : []}
                    onUpload={handleAvatarUpload}
                    maxImages={1}
                    circular={true}
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{user.name || 'Set your name'}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
                  <MapPin size={12} strokeWidth={2} />
                  {user.neighbourhood || 'Add neighbourhood'}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {badges.map(badge => {
                    const BadgeIcon = badge.Icon
                    return (
                      <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50px', padding: '5px 12px', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                        <BadgeIcon size={10} strokeWidth={2.5} />
                        {badge.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: 'Deals',  value: user.totalDeals || 0 },
                  { label: 'Rating', value: (user.rating || 0).toFixed(1) },
                  { label: 'Status', value: user.verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified' },
                ].map((s, i, arr) => (
                  <div key={s.label} style={{ padding: '16px 12px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: 'var(--violet)', marginBottom: '3px' }}>{s.value}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--ink2)' }}>Phone:</strong> {user.phone}
              </div>
            </div>

            {/* Menu */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {[
                { label: 'My Listings',   Icon: Package,  href: '/my-listings', sub: 'View and manage your posts'  },
                { label: 'My Exchanges',  Icon: Inbox,    href: '/exchanges',   sub: 'Requests sent and received'  },
                { label: 'Verification',  Icon: Shield,   href: '#',            sub: 'Verify your identity'        },
              ].map((item, i, arr) => {
                const Icon = item.Icon
                return (
                  <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-pale)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color="var(--violet)" strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px', fontFamily: 'var(--font-inter)' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.sub}</div>
                      </div>
                      <ChevronRight size={16} color="var(--muted)" strokeWidth={2} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right — trust scores + badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
              Your Profile
            </div>

            {/* Trust scores */}
            <div style={{ background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700 }}>Trust Scores</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{user.totalDeals || 0} total deals completed</div>
              </div>
              <div style={{ padding: '24px' }}>
                {scores.map(s => {
                  const Icon = s.Icon
                  const pct = Math.min((s.value / s.max) * 100, 100)
                  return (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={s.color} strokeWidth={2} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{s.label}</span>
                          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: s.color }}>{s.value}</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--cream-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Badges */}
            <div style={{ background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Badges</div>
              {badges.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {badges.map(badge => {
                    const BadgeIcon = badge.Icon
                    return (
                      <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '50px', background: badge.bg, color: badge.color, fontSize: '13px', fontWeight: 700, border: `1px solid ${badge.color}20` }}>
                        <BadgeIcon size={14} strokeWidth={2.5} />
                        {badge.label}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
                  Complete exchanges to earn badges. Verified gets you the first one — just post and start trading.
                </div>
              )}
            </div>

            {/* How to earn */}
            <div style={{ background: 'var(--violet-pale)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(91,33,182,0.15)' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: 'var(--violet)', marginBottom: '16px' }}>How to build your score</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { action: 'Complete a trade',    points: '+10 Trade Score'    },
                  { action: 'Complete a barter',   points: '+10 Barter Score'   },
                  { action: 'Give a gift',         points: '+10 Give Score'     },
                  { action: 'Complete 10 deals',   points: 'Trusted Trader badge' },
                  { action: 'Complete 3 barters',  points: 'Barter Ready badge'   },
                  { action: 'Give 5 gifts',        points: 'Generous Jirani badge' },
                ].map(item => (
                  <div key={item.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--ink2)' }}>{item.action}</span>
                    <span style={{ fontWeight: 600, color: 'var(--violet)' }}>{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}