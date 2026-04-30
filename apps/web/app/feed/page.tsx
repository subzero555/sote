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
  { key: 'all',    label: 'All',    Icon: Sparkles        },
  { key: 'trade',  label: 'Trade',  Icon: ShoppingCart    },
  { key: 'barter', label: 'Barter', Icon: ArrowLeftRight  },
  { key: 'gift',   label: 'Gifts',  Icon: Gift            },
  { key: 'donate', label: 'Donate', Icon: Heart           },
  { key: 'meal',   label: 'Meals',  Icon: UtensilsCrossed },
]

const WIDGET_PHOTOS = {
  barter: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  gift:   'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
  meal:   'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  trade:  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
}

function Widget({
  photo, overlayColor, label, title, sub, count, btnLabel, btnColor, tall, onClick, blink
}: any) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 300)}
      style={{
        borderRadius: '20px', overflow: 'hidden',
        position: 'relative', cursor: 'pointer',
        height: tall ? '248px' : '116px',
        boxShadow: hovered
          ? '0 8px 32px rgba(28,16,40,0.22)'
          : 'var(--shadow)',
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${photo})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: hovered ? 'brightness(0.25) saturate(0.7)' : 'brightness(0.85)',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'filter 0.35s ease, transform 0.35s ease',
      }} />

      {/* Overlay tint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: overlayColor,
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }} />

      {/* Default content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 16px',
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
      }}>
        {blink && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '9px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '1px', color: 'rgba(255,255,255,0.6)',
            marginBottom: '5px', fontFamily: 'var(--font-inter)',
          }}>
            <div style={{
              width: '6px', height: '6px',
              background: '#FCD34D', borderRadius: '50%',
              animation: 'blink 1s infinite',
            }} />
            {label}
          </div>
        )}
        {!blink && (
          <div style={{
            fontSize: '9px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '1px', color: 'rgba(255,255,255,0.6)',
            marginBottom: '5px', fontFamily: 'var(--font-inter)',
          }}>
            {label}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-syne)',
          fontSize: tall ? '18px' : '15px',
          fontWeight: 700, color: 'white', lineHeight: 1.2,
        }}>
          {title}
        </div>
        {count && (
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>
            {count}
          </div>
        )}
      </div>

      {/* Hover content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px', textAlign: 'center',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        gap: '8px',
      }}>
        <div style={{
          fontFamily: 'var(--font-syne)',
          fontSize: '16px', fontWeight: 700,
          color: 'white', lineHeight: 1.3,
        }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            {sub}
          </div>
        )}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'white', color: btnColor || 'var(--violet)',
          border: 'none', borderRadius: '50px',
          padding: '9px 18px', fontSize: '13px', fontWeight: 700,
          fontFamily: 'var(--font-inter)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          marginTop: '4px',
        }}>
          {btnLabel}
          <ChevronRight size={13} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )
}

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
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      paddingBottom: '88px', maxWidth: '480px', margin: '0 auto',
    }}>

      {/* TopBar */}
      <div style={{
        background: 'var(--ink)', padding: '16px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '26px', fontWeight: 800,
            color: 'var(--violet-light)', letterSpacing: '-1px', lineHeight: 1,
          }}>
            Sote
          </div>
          <div style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.35)',
            marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px',
            fontStyle: 'italic', fontFamily: 'var(--font-inter)',
          }}>
            <MapPin size={9} strokeWidth={2.5} />
            {user?.neighbourhood || 'Nairobi'} · 3km
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/search')} style={{
            width: '36px', height: '36px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Search size={16} strokeWidth={2} />
          </button>
          <button onClick={() => router.push('/notifications')} style={{
            width: '36px', height: '36px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={16} strokeWidth={2} />
            <div style={{
              position: 'absolute', top: '7px', right: '7px',
              width: '6px', height: '6px',
              background: 'var(--violet-light)', borderRadius: '50%',
            }} />
          </button>
        </div>
      </div>

      {/* Mode bar */}
      <div style={{
        background: 'var(--white)', padding: '10px 16px',
        display: 'flex', gap: '6px', overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none', position: 'sticky', top: '62px', zIndex: 40,
      }}>
        {MODES.map((m) => {
          const Icon = m.Icon
          const isActive = mode === m.key
          return (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 14px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              border: '1.5px solid', whiteSpace: 'nowrap', flexShrink: 0,
              background: isActive ? 'var(--violet)' : 'transparent',
              borderColor: isActive ? 'var(--violet)' : 'var(--border)',
              color: isActive ? 'white' : 'var(--muted)',
              transition: 'all 0.18s',
              fontFamily: 'var(--font-inter)',
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
          fontFamily: 'var(--font-syne)',
          fontSize: '20px', fontWeight: 700, color: 'var(--ink)',
        }}>
          Habari, {firstName}
        </div>
        <div style={{
          fontSize: '13px', color: 'var(--muted)', marginTop: '2px',
          fontFamily: 'var(--font-inter)',
        }}>
          {total > 0 ? `${total} active listings near you` : 'Be the first to post in your area'}
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex', margin: '14px 16px 0',
        background: 'var(--ink)', borderRadius: '14px', overflow: 'hidden',
      }}>
        {[
          { label: 'Trade',  value: stats.trade  },
          { label: 'Barter', value: stats.barter },
          { label: 'Gifts',  value: stats.gift   },
          { label: 'Donate', value: stats.donate },
          { label: 'Meals',  value: stats.meal   },
        ].map((s, i, arr) => (
          <div key={s.label} onClick={() => setMode(s.label.toLowerCase())} style={{
            flex: 1, padding: '12px 4px', textAlign: 'center',
            borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            cursor: 'pointer',
          }}>
            <div style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '18px', fontWeight: 800,
              color: 'var(--violet-light)', lineHeight: 1, marginBottom: '2px',
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: '9px', color: 'rgba(255,255,255,0.35)',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px',
              fontFamily: 'var(--font-inter)',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Widgets */}
      {mode === 'all' && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '10px', padding: '14px 16px 0',
        }}>
          {stats.barter > 0 && (
            <Widget
              photo={WIDGET_PHOTOS.barter}
              overlayColor="linear-gradient(180deg,rgba(120,53,15,0.15) 0%,rgba(120,53,15,0.88) 100%)"
              label="Barter Exchange"
              title="Trade without cash"
              sub="Exchange goods with verified neighbours"
              count={`${stats.barter} near you`}
              btnLabel="Explore Barter"
              btnColor="var(--barter)"
              tall={true}
              onClick={() => setMode('barter')}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats.gift > 0 || stats.donate > 0) && (
              <Widget
                photo={WIDGET_PHOTOS.gift}
                overlayColor="linear-gradient(180deg,rgba(157,23,77,0.15) 0%,rgba(157,23,77,0.88) 100%)"
                label="Community"
                title={`${stats.gift + stats.donate} free items`}
                sub="Gifts and donations from your neighbours"
                btnLabel="See Gifts"
                btnColor="var(--gift)"
                onClick={() => router.push('/give')}
              />
            )}
            {stats.meal > 0 && (
              <Widget
                photo={WIDGET_PHOTOS.meal}
                overlayColor="linear-gradient(180deg,rgba(7,89,133,0.15) 0%,rgba(7,89,133,0.88) 100%)"
                label="Meals Now"
                title="Hot food nearby"
                sub="Collect before it expires — always free"
                btnLabel="Collect Now"
                btnColor="var(--meal)"
                blink={true}
                onClick={() => setMode('meal')}
              />
            )}
            {total === 0 && (
              <Widget
                photo={WIDGET_PHOTOS.trade}
                overlayColor="linear-gradient(180deg,rgba(91,33,182,0.15) 0%,rgba(91,33,182,0.88) 100%)"
                label="Get Started"
                title="Post your first listing"
                sub="Start the community in your neighbourhood"
                btnLabel="Post Now"
                btnColor="var(--violet)"
                onClick={() => router.push('/post')}
              />
            )}
          </div>

          {total === 0 && !stats.barter && (
            <div
              onClick={() => router.push('/post')}
              style={{
                gridColumn: 'span 2',
                background: 'var(--violet)',
                borderRadius: '20px', padding: '24px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '6px',
              }}>
                You are not a stranger here.
              </div>
              <div style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                marginBottom: '16px', fontFamily: 'var(--font-inter)',
              }}>
                Start your neighbourhood community today
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'white', color: 'var(--violet)',
                border: 'none', borderRadius: '50px',
                padding: '10px 20px', fontSize: '14px', fontWeight: 700,
                fontFamily: 'var(--font-inter)', cursor: 'pointer',
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
          <div style={{
            fontFamily: 'var(--font-syne)', fontSize: '16px',
            fontWeight: 700, color: 'var(--ink)',
          }}>
            {mode === 'all' ? 'Near You Now' : `${MODES.find(m => m.key === mode)?.label} listings`}
          </div>
          <div style={{
            fontSize: '12px', color: 'var(--muted)',
            fontFamily: 'var(--font-inter)',
          }}>
            {listings.length} {listings.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      )}

      {/* Cards */}
      <div style={{
        padding: '0 16px', display: 'flex',
        flexDirection: 'column', gap: '10px', marginBottom: '24px',
      }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--white)', borderRadius: '16px',
              border: '1px solid var(--border)', overflow: 'hidden',
              display: 'flex', opacity: 0.5,
            }}>
              <div style={{ width: '88px', height: '96px', background: 'var(--cream-dark)' }} />
              <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '14px', background: 'var(--cream-dark)', borderRadius: '6px', width: '70%' }} />
                <div style={{ height: '11px', background: 'var(--cream-dark)', borderRadius: '6px', width: '40%' }} />
                <div style={{ height: '16px', background: 'var(--cream-dark)', borderRadius: '6px', width: '30%' }} />
              </div>
            </div>
          ))
        ) : listings.length === 0 && mode !== 'all' ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--violet-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Sparkles size={26} color="var(--violet)" strokeWidth={1.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-syne)', fontSize: '16px',
              fontWeight: 700, color: 'var(--ink)', marginBottom: '6px',
            }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}>
              Be the first to post in this category
            </div>
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
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}