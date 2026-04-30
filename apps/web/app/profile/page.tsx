'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, MapPin, Star, ShoppingCart, ArrowLeftRight,
  Gift, LogOut, Shield, ChevronRight, Package
} from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (!stored) { router.push('/auth'); return }
    setUser(JSON.parse(stored))
  }, [])

  function handleLogout() {
    localStorage.removeItem('sote_token')
    localStorage.removeItem('sote_user')
    localStorage.removeItem('sote_phone')
    router.push('/auth')
  }

  if (!user) return null

  const scores = [
    { label: 'Trade',  value: user.tradeScore || 0,  Icon: ShoppingCart,  color: 'var(--green)' },
    { label: 'Barter', value: user.barterScore || 0, Icon: ArrowLeftRight, color: 'var(--barter)' },
    { label: 'Giving', value: user.giveScore || 0,   Icon: Gift,           color: 'var(--purple)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
        padding: '40px 20px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '200px', height: '200px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
          top: '-60px', right: '-40px',
        }} />
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-fraunces)',
              fontSize: '24px', fontWeight: 700, color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              {user.avatarInitials || <User size={28} strokeWidth={1.5} />}
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
            Out
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '8px', marginTop: '20px',
        }}>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '22px', fontWeight: 900, color: 'white',
            }}>
              {user.totalDeals || 0}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              Deals
            </div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '22px', fontWeight: 900, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}>
              <Star size={16} strokeWidth={2} style={{ marginTop: '2px' }} />
              {(user.rating || 0).toFixed(1)}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              Rating
            </div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '22px', fontWeight: 900, color: 'white',
            }}>
              {user.verificationStatus === 'VERIFIED' ? '✓' : '—'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              Verified
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Trust scores */}
        <div style={{
          background: '#ffffff', borderRadius: '16px',
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-fraunces)',
            fontSize: '14px', fontWeight: 700,
          }}>
            Trust Scores
          </div>
          {scores.map((s, i) => {
            const Icon = s.Icon
            return (
              <div key={s.label} style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: i < scores.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px',
                  background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={s.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    {s.label}
                  </div>
                  <div style={{
                    height: '5px', background: 'var(--border)',
                    borderRadius: '3px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(s.value, 100)}%`,
                      background: s.color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '16px', fontWeight: 700,
                  color: s.color,
                }}>
                  {s.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* Menu items */}
        {[
          { label: 'My Listings', Icon: Package, href: '/feed' },
          { label: 'Verification', Icon: Shield, href: '#' },
        ].map((item) => {
          const Icon = item.Icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px', background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={19} color="var(--green)" strokeWidth={1.8} />
              </div>
              <div style={{
                flex: 1, fontFamily: 'var(--font-fraunces)',
                fontSize: '15px', fontWeight: 600,
              }}>
                {item.label}
              </div>
              <ChevronRight size={18} color="var(--muted)" strokeWidth={2} />
            </button>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}