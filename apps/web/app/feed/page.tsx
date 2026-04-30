'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Bell, MapPin, ShoppingCart, ArrowLeftRight,
  Gift, Heart, UtensilsCrossed, Sparkles, ChevronRight, Zap
} from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import BottomNav from '@/components/layout/BottomNav'
import { api } from '@/lib/api'

const MODES = [
  { key: 'all',    label: 'All',    Icon: Sparkles       },
  { key: 'trade',  label: 'Trade',  Icon: ShoppingCart   },
  { key: 'barter', label: 'Barter', Icon: ArrowLeftRight },
  { key: 'gift',   label: 'Gifts',  Icon: Gift           },
  { key: 'donate', label: 'Donate', Icon: Heart          },
  { key: 'meal',   label: 'Meals',  Icon: UtensilsCrossed },
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

  useEffect(() => { loadFeed() }, [mode])

  async function loadFeed() {
    setLoading(true)
    try {
      const data: any = await api.getListings({ mode })
      setListings(data.listings)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function loadStats() {
    try {
      const data: any = await api.getStats()
      setStats(data)
    } catch (err) { console.error(err) }
  }

  const total = stats.trade + stats.barter + stats.gift + stats.donate + stats.meal
  const firstName = user?.name?.split(' ')[0] || 'Jirani'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>

      {/* TopBar — Navy */}
      <div style={{
        background: 'var(--navy)',
        padding: '18px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '26px', fontWeight: 900,
            color: 'var(--gold-light)',
            letterSpacing: '-0.5px', lineHeight: 1,
          }}>
            Sote
          </div>
          <div style={{
            fontSize: '11px', color: 'rgba(255,255,255,0.5)',
            marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            <MapPin size={10} strokeWidth={2.5} />
            {user?.neighbourhood || 'Nairobi'} · 3km radius
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/search')} style={{
            width: '36px', height: '36px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Search size={16} strokeWidth={2} />
          </button>
          <button onClick={() => router.push('/notifications')} style={{
            width: '36px', height: '36px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={16} strokeWidth={2} />
            <div style={{
              position: 'absolute', top: '7px', right: '7px',
              width: '7px', height: '7px',
              background: 'var(--gold-light)', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.15)',
            }} />
          </button>
        </div>
      </div>

      {/* Mode bar */}
      <div style={{
        background: 'var(--white)', padding: '10px 16px',
        display: 'flex', gap: '6px', overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none',
        position: 'sticky', top: '64px', zIndex: 40,
      }}>
        {MODES.map((m) => {
          const Icon = m.Icon
          const isActive = mode === m.key
          return (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 14px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid',
              whiteSpace: 'nowrap', flexShrink: 0,
              background: isActive ? 'var(--navy)' : 'transparent',
              borderColor: isActive ? 'var(--navy)' : 'var(--border)',
              color: isActive ? 'white' : 'var(--muted)',
              transition: 'all 0.18s',
            }}>
              <Icon size={11} strokeWidth={2.5} />
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Greeting */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '20px', fontWeight: 800, color: 'var(--navy)',
        }}>
          Habari, {firstName} 👋
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
          {total > 0 ? `${total} active listings near you` : 'Be the first to post in your area'}
        </div>
      </div>

      {/* Stats strip — navy background */}
      <div style={{
        display: 'flex', margin: '14px 16px 0',
        background: 'var(--navy)', borderRadius: '14px', overflow: 'hidden',
      }}>
        {[
          { label: 'Trade',  value: stats.trade,  Icon: ShoppingCart  },
          { label: 'Barter', value: stats.barter, Icon: ArrowLeftRight },
          { label: 'Gifts',  value: stats.gift,   Icon: Gift           },
          { label: 'Donate', value: stats.donate, Icon: Heart          },
          { label: 'Meals',  value: stats.meal,   Icon: UtensilsCrossed },
        ].map((s, i, arr) => {
          const Icon = s.Icon
          return (
            <div key={s.label} onClick={() => setMode(s.label.toLowerCase())} style={{
              flex: 1, padding: '12px 4px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px' }}>
                <Icon size={12} strokeWidth={2} color="rgba(255,255,255,0.45)" />
              </div>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '18px', fontWeight: 900,
                color: 'var(--gold-light)', lineHeight: 1, marginBottom: '2px',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Widget grid */}
      {mode === 'all' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '14px 16px 0',
        }}>
          {/* Barter — tall left */}
          {stats.barter > 0 && (
            <div
              onClick={() => setMode('barter')}
              style={{
                gridRow: 'span 2',
                background: 'linear-gradient(160deg, #92400e 0%, #b45309 100%)',
                borderRadius: '20px', padding: '20px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                minHeight: '240px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div style={{
                position: 'absolute', right: '-20px', bottom: '-20px',
                opacity: 0.1,
              }}>
                <ArrowLeftRight size={100} strokeWidth={1} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Barter Exchange
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '22px', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '8px' }}>
                  Trade without cash
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  Exchange goods with verified neighbours
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '40px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '4px' }}>
                  {stats.barter}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                  exchanges available
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px', padding: '7px 14px',
                  fontSize: '12px', fontWeight: 700, color: 'white',
                }}>
                  Explore <ChevronRight size={12} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          )}

          {/* Gift widget — top right */}
          {(stats.gift > 0 || stats.donate > 0) && (
            <div
              onClick={() => router.push('/give')}
              style={{
                background: 'linear-gradient(160deg, #4a1870 0%, #7b2d8b 100%)',
                borderRadius: '20px', padding: '18px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                minHeight: '110px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div style={{
                position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.12,
              }}>
                <Gift size={64} strokeWidth={1} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>
                  Community
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
                  {stats.gift + stats.donate} free<br/>items
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '5px 12px',
                fontSize: '11px', fontWeight: 700, color: 'white',
                alignSelf: 'flex-start',
              }}>
                See gifts <ChevronRight size={10} strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* Meal widget — bottom right */}
          {stats.meal > 0 && (
            <div
              onClick={() => setMode('meal')}
              style={{
                background: 'linear-gradient(160deg, #0a5a6e 0%, #0e7490 100%)',
                borderRadius: '20px', padding: '18px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                minHeight: '110px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.55)',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px',
                }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--gold-light)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                  Meals Now
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
                  {stats.meal} hot<br/>meal{stats.meal > 1 ? 's' : ''}
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '5px 12px',
                fontSize: '11px', fontWeight: 700, color: 'white',
                alignSelf: 'flex-start',
              }}>
                Collect <ChevronRight size={10} strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* Empty state widget */}
          {total === 0 && (
            <div
              onClick={() => router.push('/post')}
              style={{
                gridColumn: 'span 2',
                background: 'var(--navy)',
                borderRadius: '20px', padding: '24px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '6px' }}>
                Start the community
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                Be the first to post in your neighbourhood
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'var(--gold)', borderRadius: '50px',
                padding: '10px 20px', fontSize: '14px', fontWeight: 700, color: 'white',
              }}>
                <Zap size={14} strokeWidth={2.5} />
                Post something
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feed header */}
      {listings.length > 0 && (
        <div style={{
          padding: '20px 20px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>
            {mode === 'all' ? 'Near You Now' : `${MODES.find(m => m.key === mode)?.label} listings`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {listings.length} {listings.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      )}

      {/* Cards */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--white)', borderRadius: '16px',
              border: '1px solid var(--border)', padding: '14px 16px',
              display: 'flex', gap: '12px',
              opacity: 0.6,
            }}>
              <div style={{ width: '88px', height: '96px', borderRadius: '12px', background: 'var(--border)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                <div style={{ height: '14px', background: 'var(--border)', borderRadius: '6px', width: '70%' }} />
                <div style={{ height: '11px', background: 'var(--border)', borderRadius: '6px', width: '40%' }} />
                <div style={{ height: '16px', background: 'var(--border)', borderRadius: '6px', width: '30%' }} />
              </div>
            </div>
          ))
        ) : listings.length === 0 && mode !== 'all' ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--navy-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Sparkles size={26} color="var(--navy)" strokeWidth={1.5} />
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: '14px' }}>Be the first to post in this category</div>
          </div>
        ) : (
          listings.map((listing, i) => (
            <div key={listing.id} style={{ animation: `cardIn 0.35s ease ${i * 0.04}s both` }}>
              <ListingCard listing={listing} />
            </div>
          ))
        )}
      </div>

      <BottomNav />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}