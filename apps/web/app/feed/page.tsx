'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, ShoppingCart, ArrowLeftRight, Gift,
  Heart, UtensilsCrossed, MapPin, Bell, Search,
  ChevronRight, Zap
} from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import BottomNav from '@/components/layout/BottomNav'
import { api } from '@/lib/api'

const MODES = [
  { key: 'all',    label: 'All',    Icon: Sparkles,       activeColor: '#1a1510' },
  { key: 'trade',  label: 'Trade',  Icon: ShoppingCart,   activeColor: 'var(--green)' },
  { key: 'barter', label: 'Barter', Icon: ArrowLeftRight, activeColor: 'var(--barter)' },
  { key: 'gift',   label: 'Gifts',  Icon: Gift,           activeColor: 'var(--purple)' },
  { key: 'donate', label: 'Donate', Icon: Heart,          activeColor: 'var(--warm)' },
  { key: 'meal',   label: 'Meals',  Icon: UtensilsCrossed, activeColor: 'var(--teal)' },
]

export default function FeedPage() {
  const router = useRouter()
  const [mode, setMode] = useState('all')
  const [listings, setListings] = useState<any[]>([])
  const [stats, setStats] = useState({ trade: 0, barter: 0, gift: 0, donate: 0, meal: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (stored) setUser(JSON.parse(stored))
    loadStats()
  }, [])

  useEffect(() => {
    loadFeed()
  }, [mode])

  async function loadFeed() {
    setLoading(true)
    try {
      const data: any = await api.getListings({ mode })
      setListings(data.listings)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const data: any = await api.getStats()
      setStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const totalActive = stats.trade + stats.barter + stats.gift + stats.donate + stats.meal

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>

      {/* TopBar */}
      <div style={{
        background: '#ffffff', padding: '16px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 8px rgba(26,21,16,0.06)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '24px', fontWeight: 900, color: 'var(--green)',
            letterSpacing: '-0.5px', lineHeight: 1,
          }}>
            Sote
          </div>
          <div style={{
            fontSize: '12px', color: 'var(--muted)',
            marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            <MapPin size={11} strokeWidth={2.5} />
            {user?.neighbourhood || 'Nairobi'} · 3km radius
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push('/search')}
            style={{
              width: '38px', height: '38px', background: 'var(--cream)',
              border: '1px solid var(--border)', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--ink2)',
            }}>
            <Search size={17} strokeWidth={2} />
          </button>
          <button
            onClick={() => router.push('/notifications')}
            style={{
              width: '38px', height: '38px', background: 'var(--cream)',
              border: '1px solid var(--border)', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--ink2)', position: 'relative',
            }}>
            <Bell size={17} strokeWidth={2} />
            {/* notification dot */}
            <div style={{
              position: 'absolute', top: '7px', right: '7px',
              width: '7px', height: '7px',
              background: 'var(--warm)', borderRadius: '50%',
              border: '2px solid white',
            }} />
          </button>
        </div>
      </div>

      {/* Mode filter bar */}
      <div style={{
        background: '#ffffff', padding: '10px 16px',
        display: 'flex', gap: '8px', overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: '65px', zIndex: 40,
        scrollbarWidth: 'none',
      }}>
        {MODES.map((m) => {
          const Icon = m.Icon
          const isActive = mode === m.key
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '50px',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                whiteSpace: 'nowrap', flexShrink: 0,
                background: isActive ? m.activeColor : 'transparent',
                borderColor: isActive ? m.activeColor : 'var(--border)',
                color: isActive ? 'white' : 'var(--muted)',
                transition: 'all 0.18s',
              }}
            >
              <Icon size={12} strokeWidth={2.5} />
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Hero greeting */}
      {user && (
        <div style={{
          padding: '16px 20px 0',
        }}>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '20px', fontWeight: 700,
            color: 'var(--ink)',
          }}>
            Habari, {user.name?.split(' ')[0] || 'Jirani'} 👋
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
            {totalActive} active listings in your area
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div style={{
        display: 'flex', margin: '14px 16px 0',
        background: '#ffffff', borderRadius: '14px',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(26,21,16,0.04)',
      }}>
        {[
          { label: 'Trade',  value: stats.trade,  color: 'var(--green)',  Icon: ShoppingCart },
          { label: 'Barter', value: stats.barter, color: 'var(--barter)', Icon: ArrowLeftRight },
          { label: 'Gifts',  value: stats.gift,   color: 'var(--purple)', Icon: Gift },
          { label: 'Donate', value: stats.donate, color: 'var(--warm)',   Icon: Heart },
          { label: 'Meals',  value: stats.meal,   color: 'var(--teal)',   Icon: UtensilsCrossed },
        ].map((s, i, arr) => {
          const Icon = s.Icon
          return (
            <div
              key={s.label}
              onClick={() => setMode(s.label.toLowerCase())}
              style={{
                flex: 1, padding: '10px 4px', textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px' }}>
                <Icon size={13} strokeWidth={2} color={s.color} />
              </div>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '17px', fontWeight: 900,
                color: s.color, lineHeight: 1, marginBottom: '2px',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Barter banner — show when barter listings exist */}
      {stats.barter > 0 && (mode === 'all' || mode === 'barter') && (
        <div
          onClick={() => setMode('barter')}
          style={{
            margin: '14px 16px 0',
            background: 'linear-gradient(135deg, #92400e, #b45309)',
            borderRadius: '18px', padding: '20px',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute', width: '180px', height: '180px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
            top: '-60px', right: '-40px',
          }} />
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px',
          }}>
            Barter Exchange
          </div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '19px', fontWeight: 900, color: 'white',
            marginBottom: '5px', lineHeight: 1.2,
          }}>
            Trade without cash
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', maxWidth: '220px', lineHeight: 1.5 }}>
            Exchange goods with verified neighbours — no money needed
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Electronics', 'Clothing', 'Food', 'Tools'].map(cat => (
              <div key={cat} style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '4px 12px',
                fontSize: '12px', color: 'white', fontWeight: 600,
              }}>
                {cat}
              </div>
            ))}
          </div>
          <div style={{
            position: 'absolute', right: '16px', bottom: '-8px',
            opacity: 0.2,
          }}>
            <ArrowLeftRight size={64} strokeWidth={1} color="white" />
          </div>
        </div>
      )}

      {/* Meal urgency strip */}
      {stats.meal > 0 && (mode === 'all' || mode === 'meal') && (
        <div
          onClick={() => setMode('meal')}
          style={{
            margin: '12px 16px 0',
            background: 'linear-gradient(135deg, #0e7490, #0891b2)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            width: '10px', height: '10px', background: '#f5c842',
            borderRadius: '50%', flexShrink: 0,
            animation: 'blink 1s infinite',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '2px',
            }}>
              {stats.meal} meal{stats.meal > 1 ? 's' : ''} available now
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              Collect before they expire — free food from neighbours
            </div>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          <div style={{ position: 'absolute', right: '12px', opacity: 0.15 }}>
            <UtensilsCrossed size={48} strokeWidth={1} color="white" />
          </div>
        </div>
      )}

      {/* Community giving banner */}
      {(stats.gift > 0 || stats.donate > 0) && (mode === 'all' || mode === 'gift' || mode === 'donate') && (
        <div
          onClick={() => router.push('/give')}
          style={{
            margin: '12px 16px 0',
            background: 'linear-gradient(135deg, #4a1870, #7b2d8b)',
            borderRadius: '18px', padding: '20px',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
          }}
        >
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px',
          }}>
            Community Giving
          </div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '19px', fontWeight: 900, color: 'white', marginBottom: '5px',
          }}>
            {stats.gift + stats.donate} items need good homes
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', maxWidth: '220px', lineHeight: 1.5 }}>
            Free gifts and donations from your neighbours
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px', padding: '7px 16px',
            fontSize: '13px', fontWeight: 600, color: 'white',
            marginTop: '12px',
          }}>
            <Gift size={13} strokeWidth={2.5} />
            See all gifts
          </div>
          <div style={{
            position: 'absolute', right: '16px', bottom: '-8px', opacity: 0.15,
          }}>
            <Gift size={64} strokeWidth={1} color="white" />
          </div>
        </div>
      )}

      {/* Post CTA for empty feed */}
      {!loading && listings.length === 0 && (
        <div style={{
          margin: '12px 16px 0',
          background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
          borderRadius: '18px', padding: '20px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '19px', fontWeight: 900, color: 'white', marginBottom: '6px',
          }}>
            Be the first to post
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '14px' }}>
            Your neighbourhood is waiting. Start the community.
          </div>
          <button
            onClick={() => router.push('/post')}
            style={{
              background: 'white', color: 'var(--green)',
              border: 'none', borderRadius: '50px',
              padding: '10px 20px',
              fontFamily: 'var(--font-fraunces)',
              fontSize: '14px', fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Zap size={14} strokeWidth={2.5} />
            Post something
          </button>
        </div>
      )}

      {/* Feed section header */}
      {listings.length > 0 && (
        <div style={{
          padding: '20px 20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 700 }}>
            {mode === 'all' ? 'Near You Now' : MODES.find(m => m.key === mode)?.label + ' listings'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {listings.length} {listings.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      )}

      {/* Cards */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {loading ? (
          // Skeleton loader
          [1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#ffffff', borderRadius: '16px',
              border: '1px solid var(--border)', padding: '14px 16px',
              display: 'flex', gap: '12px',
              animation: 'pulse 1.5s ease infinite',
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'var(--border)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '14px', background: 'var(--border)', borderRadius: '6px', width: '70%' }} />
                <div style={{ height: '11px', background: 'var(--border)', borderRadius: '6px', width: '40%' }} />
                <div style={{ height: '16px', background: 'var(--border)', borderRadius: '6px', width: '30%' }} />
              </div>
            </div>
          ))
        ) : (
          listings.map((listing, i) => (
            <div
              key={listing.id}
              style={{
                animation: `cardIn 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <ListingCard listing={listing} />
            </div>
          ))
        )}
      </div>

      <BottomNav />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes cardIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}