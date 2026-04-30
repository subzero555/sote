'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, MapPin, Star, ShoppingCart, ArrowLeftRight,
  Gift, LogOut, Shield, ChevronRight, Package,
  CheckCircle, Repeat, Heart, Inbox
} from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import ImageUpload from '@/components/ui/ImageUpload'
import { api } from '@/lib/api'

function getBadges(user: any) {
  const badges = []
  if (user.verificationStatus === 'VERIFIED') {
    badges.push({ label: 'Verified', color: 'var(--green)', bg: 'var(--green-pale)', Icon: CheckCircle })
  }
  if (user.totalDeals >= 10) {
    badges.push({ label: 'Trusted Trader', color: 'var(--gold)', bg: 'var(--gold-pale)', Icon: Star })
  }
  if (user.barterScore >= 30) {
    badges.push({ label: 'Barter Ready', color: 'var(--barter)', bg: 'var(--barter-pale)', Icon: Repeat })
  }
  if (user.giveScore >= 50) {
    badges.push({ label: 'Generous Jirani', color: 'var(--purple)', bg: 'var(--purple-pale)', Icon: Heart })
  }
  return badges
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (!stored) { router.push('/auth'); return }
    setUser(JSON.parse(stored))

    // Refresh user data from server
    api.getMe().then((data: any) => {
      const updated = data.user
      localStorage.setItem('sote_user', JSON.stringify(updated))
      setUser(updated)
    }).catch(() => {})
  }, [])

  function handleLogout() {
    localStorage.removeItem('sote_token')
    localStorage.removeItem('sote_user')
    localStorage.removeItem('sote_phone')
    router.push('/auth')
  }

  async function handleAvatarUpload(url: string) {
    setAvatarUploading(true)
    try {
      const stored = localStorage.getItem('sote_user')
      if (stored) {
        const u = JSON.parse(stored)
        u.avatarInitials = url
        localStorage.setItem('sote_user', JSON.stringify(u))
        setUser((prev: any) => ({ ...prev, avatarInitials: url }))
      }
    } finally {
      setAvatarUploading(false)
    }
  }

  if (!user) return null

  const isAvatarUrl = user.avatarInitials?.startsWith('http')
  const badges = getBadges(user)

  const scores = [
    { label: 'Trade',  value: user.tradeScore || 0,  Icon: ShoppingCart,  color: 'var(--green)',  max: 100 },
    { label: 'Barter', value: user.barterScore || 0, Icon: ArrowLeftRight, color: 'var(--barter)', max: 100 },
    { label: 'Giving', value: user.giveScore || 0,   Icon: Gift,           color: 'var(--purple)', max: 100 },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
        padding: '40px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', width: '220px', height: '220px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
          top: '-80px', right: '-60px',
        }} />
        <div style={{
          position: 'absolute', width: '120px', height: '120px',
          background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
          bottom: '-30px', left: '-20px',
        }} />

        {/* Top row — avatar + name + logout */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', position: 'relative',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

            {/* Avatar with upload */}
            <div style={{ position: 'relative' }}>
              <ImageUpload
                images={isAvatarUrl ? [user.avatarInitials] : []}
                onUpload={handleAvatarUpload}
                maxImages={1}
                circular={true}
              />
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '20px', fontWeight: 700,
                color: 'white', marginBottom: '4px',
              }}>
                {user.name || 'Set your name'}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '13px', color: 'rgba(255,255,255,0.75)',
              }}>
                <MapPin size={12} strokeWidth={2} />
                {user.neighbourhood || 'Add neighbourhood'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'rgba(255,255,255,0.8)', fontSize: '13px',
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            <LogOut size={14} strokeWidth={2} />
            Sign out
          </button>
        </div>

        {/* Badges row */}
        {badges.length > 0 && (
          <div style={{
            display: 'flex', gap: '6px', flexWrap: 'wrap',
            marginBottom: '16px', position: 'relative',
          }}>
            {badges.map((badge) => {
              const BadgeIcon = badge.Icon
              return (
                <div key={badge.label} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px', padding: '4px 12px',
                  fontSize: '12px', color: 'white', fontWeight: 600,
                }}>
                  <BadgeIcon size={11} strokeWidth={2.5} />
                  {badge.label}
                </div>
              )
            })}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          {[
            { label: 'Deals',  value: user.totalDeals || 0 },
            { label: 'Rating', value: (user.rating || 0).toFixed(1), icon: <Star size={14} strokeWidth={2} /> },
            { label: 'Status', value: user.verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified' },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '12px 8px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: stat.label === 'Status' ? '11px' : '20px',
                fontWeight: 900, color: 'white',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '3px',
                marginBottom: '3px',
              }}>
                {stat.icon}{stat.value}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Trust scores */}
        <div style={{
          background: '#ffffff', borderRadius: '16px',
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(26,21,16,0.06)',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '14px', fontWeight: 700 }}>
              Trust Scores
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {user.totalDeals || 0} total deals
            </div>
          </div>
          {scores.map((s, i) => {
            const Icon = s.Icon
            const pct = Math.min((s.value / s.max) * 100, 100)
            return (
              <div key={s.label} style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: i < scores.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${s.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={17} color={s.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-fraunces)',
                      fontSize: '13px', fontWeight: 700, color: s.color,
                    }}>
                      {s.value}
                    </span>
                  </div>
                  <div style={{
                    height: '5px', background: 'var(--border)',
                    borderRadius: '3px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: s.color, borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Badges section */}
        {badges.length > 0 && (
          <div style={{
            background: '#ffffff', borderRadius: '16px',
            border: '1px solid var(--border)', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(26,21,16,0.06)',
          }}>
            <div style={{
              padding: '14px 16px', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-fraunces)', fontSize: '14px', fontWeight: 700,
            }}>
              Badges Earned
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {badges.map((badge) => {
                const BadgeIcon = badge.Icon
                return (
                  <div key={badge.label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '50px',
                    background: badge.bg, color: badge.color,
                    fontSize: '13px', fontWeight: 700,
                    border: `1px solid ${badge.color}20`,
                  }}>
                    <BadgeIcon size={13} strokeWidth={2.5} />
                    {badge.label}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Menu items */}
        {[
          { label: 'My Listings',   Icon: Package,  href: '/my-listings',  sub: 'View and manage your posts' },
          { label: 'My Exchanges',  Icon: Inbox,    href: '/exchanges',    sub: 'Requests sent and received' },
          { label: 'Verification',  Icon: Shield,   href: '/verify',       sub: 'Verify your identity' },
        ].map((item) => {
          const Icon = item.Icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '14px', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                boxShadow: '0 2px 8px rgba(26,21,16,0.04)',
              }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color="var(--green)" strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '15px', fontWeight: 700, marginBottom: '2px',
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {item.sub}
                </div>
              </div>
              <ChevronRight size={18} color="var(--muted)" strokeWidth={2} />
            </button>
          )
        })}

        {/* Phone number display */}
        <div style={{
          background: '#ffffff', borderRadius: '14px',
          border: '1px solid var(--border)', padding: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'var(--cream)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <User size={20} color="var(--muted)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>
              Phone number
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>
              {user.phone || '—'}
            </div>
          </div>
          <div style={{
            fontSize: '11px', fontWeight: 700, padding: '3px 10px',
            borderRadius: '50px', background: 'var(--green-pale)', color: 'var(--green)',
          }}>
            Verified
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}