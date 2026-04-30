'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Bell, MapPin, ShoppingCart, ArrowLeftRight,
  Gift, Heart, UtensilsCrossed, Plus, User,
  ChevronRight, SlidersHorizontal, Clock, Star,
  CheckCircle, Shield, Inbox, Zap, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

const MODES = [
  { key: 'all',    label: 'All Listings',    Icon: TrendingUp      },
  { key: 'trade',  label: 'For Sale',         Icon: ShoppingCart    },
  { key: 'barter', label: 'Barter',          Icon: ArrowLeftRight  },
  { key: 'gift',   label: 'Free Gifts',       Icon: Gift            },
  { key: 'donate', label: 'Donate',           Icon: Heart           },
  { key: 'meal',   label: 'Meal Share',       Icon: UtensilsCrossed },
]

const CATEGORIES = [
  'Electronics', 'Furniture', 'Clothing', 'Food & Groceries',
  'Books', 'Tools', 'Kids & Baby', 'Sports', 'Garden',
  'Appliances', 'Services', 'Other',
]

const modeStyle: Record<string, { color: string; pale: string; label: string }> = {
  TRADE:  { color: 'var(--trade)',  pale: 'var(--trade-pale)',  label: 'For Sale'  },
  BARTER: { color: 'var(--barter)', pale: 'var(--barter-pale)', label: 'Barter'    },
  GIFT:   { color: 'var(--gift)',   pale: 'var(--gift-pale)',   label: 'Free Gift' },
  DONATE: { color: 'var(--donate)', pale: 'var(--donate-pale)', label: 'Donate'    },
  MEAL:   { color: 'var(--meal)',   pale: 'var(--meal-pale)',   label: 'Meal'      },
}

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function ListingCard({ listing }: { listing: any }) {
  const ms = modeStyle[listing.mode] || modeStyle.TRADE
  const hasImg = listing.images?.length > 0
  const isUrl = listing.user?.avatarInitials?.startsWith('http')
  const verified = listing.user?.verificationStatus === 'VERIFIED'
  const isMeal = listing.mode === 'MEAL' && listing.expiresAt
  let mealLeft = ''
  if (isMeal) {
    const mins = Math.floor((new Date(listing.expiresAt).getTime() - Date.now()) / 60000)
    mealLeft = mins > 0 ? `${mins}min left` : 'Expiring'
  }

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'var(--white)', borderRadius: '16px',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer', height: '100%',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 8px 32px rgba(91,33,182,0.14)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'var(--shadow-sm)'
        }}
      >
        {/* Image */}
        <div style={{
          height: '180px', position: 'relative', overflow: 'hidden',
          background: hasImg ? '#000' : ms.pale,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {hasImg ? (
            <img src={listing.images[0]} alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ opacity: 0.3 }}>
              {listing.mode === 'TRADE' && <ShoppingCart size={48} color={ms.color} strokeWidth={1} />}
              {listing.mode === 'BARTER' && <ArrowLeftRight size={48} color={ms.color} strokeWidth={1} />}
              {listing.mode === 'GIFT' && <Gift size={48} color={ms.color} strokeWidth={1} />}
              {listing.mode === 'DONATE' && <Heart size={48} color={ms.color} strokeWidth={1} />}
              {listing.mode === 'MEAL' && <UtensilsCrossed size={48} color={ms.color} strokeWidth={1} />}
            </div>
          )}

          {/* Mode badge */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(28,16,40,0.75)',
            backdropFilter: 'blur(4px)',
            borderRadius: '50px', padding: '4px 10px',
            fontSize: '11px', fontWeight: 700, color: 'white',
            fontFamily: 'var(--font-inter)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: ms.color, flexShrink: 0 }} />
            {ms.label}
          </div>

          {/* Meal timer */}
          {isMeal && mealLeft && (
            <div style={{
              position: 'absolute', bottom: '10px', left: '12px',
              background: 'rgba(8,145,178,0.92)', borderRadius: '50px',
              padding: '4px 10px', fontSize: '11px', color: 'white',
              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--font-inter)',
            }}>
              <div style={{ width: '6px', height: '6px', background: '#FCD34D', borderRadius: '50%' }} />
              {mealLeft}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
            marginBottom: '6px', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </div>

          <div style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '18px', fontWeight: 800,
            color: ms.color, marginBottom: '8px',
          }}>
            {listing.mode === 'TRADE'
              ? `KES ${listing.price?.toLocaleString()}`
              : listing.mode === 'BARTER' ? 'EXCHANGE'
              : listing.mode === 'GIFT' || listing.mode === 'DONATE' ? 'FREE'
              : 'NOW'}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: 'var(--muted)',
            marginBottom: '12px', fontFamily: 'var(--font-inter)',
          }}>
            <MapPin size={11} strokeWidth={2} />
            {listing.neighbourhood || 'Nearby'}
            <span>·</span>
            <Clock size={11} strokeWidth={2} />
            {timeAgo(listing.createdAt)}
          </div>

          {listing.mode === 'BARTER' && listing.wantedItem && (
            <div style={{
              background: 'var(--barter-pale)', borderRadius: '8px',
              padding: '7px 10px', fontSize: '12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '10px', fontFamily: 'var(--font-inter)',
            }}>
              <ArrowLeftRight size={11} strokeWidth={2} color="var(--barter)" />
              <span style={{ fontWeight: 600, color: 'var(--barter)' }}>Wants:</span>
              <span style={{ color: 'var(--ink2)' }}>{listing.wantedItem}</span>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            paddingTop: '10px', borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              background: ms.pale, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-syne)',
              fontSize: '9px', fontWeight: 700, color: ms.color, flexShrink: 0,
            }}>
              {isUrl
                ? <img src={listing.user.avatarInitials} alt="av" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : listing.user?.avatarInitials || '?'
              }
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink2)', fontFamily: 'var(--font-inter)' }}>
              {listing.user?.name || 'Neighbour'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'var(--font-inter)' }}>
              <Star size={10} strokeWidth={2} color="var(--gold)" />
              {listing.user?.rating?.toFixed(1) || '0.0'}
            </span>
            {verified && (
              <span style={{
                fontSize: '10px', fontWeight: 600, padding: '2px 7px',
                borderRadius: '50px', background: 'var(--trade-pale)', color: 'var(--trade)',
                display: 'flex', alignItems: 'center', gap: '2px',
                fontFamily: 'var(--font-inter)', marginLeft: 'auto',
              }}>
                <CheckCircle size={9} strokeWidth={2.5} />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function Widget({ photo, overlay, label, title, sub, btnLabel, btnColor, blink, onClick }: any) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px', overflow: 'hidden', position: 'relative',
        cursor: 'pointer', height: '160px',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${photo})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: hovered ? 'brightness(0.2) saturate(0.6)' : 'brightness(0.75)',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'filter 0.35s, transform 0.35s',
      }} />
      <div style={{
        position: 'absolute', inset: 0, background: overlay,
        opacity: hovered ? 0 : 1, transition: 'opacity 0.35s',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px',
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.28s, transform 0.28s',
      }}>
        {blink && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
            <div style={{ width: '6px', height: '6px', background: '#FCD34D', borderRadius: '50%', animation: 'blink 1s infinite' }} />
            <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)' }}>{label}</span>
          </div>
        )}
        {!blink && <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)', marginBottom: '5px', fontFamily: 'var(--font-inter)' }}>{label}</div>}
        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{title}</div>
      </div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', gap: '10px',
      }}>
        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{title}</div>
        {sub && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontFamily: 'var(--font-inter)' }}>{sub}</div>}
        <div style={{
          background: 'white', color: btnColor || 'var(--violet)',
          borderRadius: '50px', padding: '9px 20px',
          fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-inter)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {btnLabel} →
        </div>
      </div>
    </div>
  )
}

export default function FeedPage() {
  const router = useRouter()
  const [mode, setMode] = useState('all')
  const [category, setCategory] = useState('')
  const [listings, setListings] = useState<any[]>([])
  const [stats, setStats] = useState({ trade: 0, barter: 0, gift: 0, donate: 0, meal: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (stored) setUser(JSON.parse(stored))
    loadStats()
  }, [])

  useEffect(() => { loadFeed() }, [mode, category])

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); setSearching(false); return }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const data: any = await api.getListings({ mode: 'all' })
        const q = search.toLowerCase()
        setSearchResults(data.listings.filter((l: any) =>
          l.title.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.neighbourhood?.toLowerCase().includes(q)
        ))
      } catch (e) { console.error(e) }
      finally { setSearching(false) }
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  async function loadFeed() {
    setLoading(true)
    try {
      const data: any = await api.getListings({ mode })
      setListings(data.listings)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function loadStats() {
    try {
      const data: any = await api.getStats()
      setStats(data)
    } catch (e) { console.error(e) }
  }

  const total = stats.trade + stats.barter + stats.gift + stats.donate + stats.meal
  const displayed = search.trim() ? searchResults : listings
  const firstName = user?.name?.split(' ')[0] || null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* TOP NAVBAR */}
      <nav style={{
        background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 100,
        padding: '0 40px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(28,16,40,0.2)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '26px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px', lineHeight: 1 }}>
              Sote
            </div>
          </Link>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            You are not a stranger here.
          </div>
        </div>

        {/* Search */}
        <div style={{
          flex: 1, maxWidth: '520px', margin: '0 40px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px', padding: '10px 16px',
        }}>
          <Search size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search listings, categories, neighbourhoods..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'white', fontSize: '14px', outline: 'none',
              fontFamily: 'var(--font-inter)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button onClick={() => router.push('/notifications')} style={{
            width: '38px', height: '38px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={17} strokeWidth={2} />
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: 'var(--violet-light)', borderRadius: '50%' }} />
          </button>

          {user ? (
            <button onClick={() => router.push('/profile')} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', padding: '7px 14px',
              cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
              fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-inter)',
            }}>
              <User size={15} strokeWidth={2} />
              {firstName || 'Profile'}
            </button>
          ) : (
            <button onClick={() => router.push('/auth')} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px', padding: '8px 16px',
              cursor: 'pointer', color: 'rgba(255,255,255,0.75)',
              fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-inter)',
            }}>
              Sign in
            </button>
          )}

          <button onClick={() => router.push('/post')} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'var(--violet)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '9px 18px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-inter)',
            boxShadow: '0 4px 14px rgba(91,33,182,0.4)',
          }}>
            <Plus size={15} strokeWidth={2.5} />
            Post listing
          </button>
        </div>
      </nav>

      {/* MODE BAR */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex', gap: '0',
        position: 'sticky', top: '60px', zIndex: 90,
        boxShadow: '0 1px 8px rgba(28,16,40,0.05)',
      }}>
        {MODES.map(m => {
          const Icon = m.Icon
          const isActive = mode === m.key
          return (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '14px 20px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', border: 'none', background: 'transparent',
              borderBottom: isActive ? '2px solid var(--violet)' : '2px solid transparent',
              color: isActive ? 'var(--violet)' : 'var(--muted)',
              fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap',
              transition: 'color 0.15s',
              marginBottom: '-1px',
            }}>
              <Icon size={14} strokeWidth={2} />
              {m.label}
            </button>
          )
        })}
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '32px 40px',
        display: 'grid',
        gridTemplateColumns: '240px 1fr 280px',
        gap: '28px',
        alignItems: 'start',
      }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ position: 'sticky', top: '120px' }}>

          {/* Neighbourhood stats */}
          <div style={{
            background: 'var(--ink)', borderRadius: '16px',
            padding: '20px', marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-syne)', fontSize: '14px',
              fontWeight: 700, color: 'white', marginBottom: '14px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <MapPin size={14} strokeWidth={2} color="var(--violet-light)" />
              {user?.neighbourhood || 'Your area'} · 3km
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'For Sale',  value: stats.trade,  color: 'var(--trade)'  },
                { label: 'Barter',   value: stats.barter, color: 'var(--barter)' },
                { label: 'Gifts',    value: stats.gift,   color: 'var(--gift)'   },
                { label: 'Donate',   value: stats.donate, color: 'var(--donate)' },
                { label: 'Meals',    value: stats.meal,   color: 'var(--meal)'   },
                { label: 'Total',    value: total,        color: 'var(--violet-light)' },
              ].map(s => (
                <div key={s.label} onClick={() => setMode(s.label.toLowerCase())} style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '10px',
                  textAlign: 'center', cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '3px' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'var(--font-inter)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by type */}
          <div style={{
            background: 'var(--white)', borderRadius: '16px',
            border: '1px solid var(--border)', overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700 }}>
              Filter
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
                Categories
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(category === cat ? '' : cat)} style={{
                    padding: '5px 11px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    border: '1px solid',
                    borderColor: category === cat ? 'var(--violet)' : 'var(--border)',
                    background: category === cat ? 'var(--violet-pale)' : 'transparent',
                    color: category === cat ? 'var(--violet)' : 'var(--muted)',
                    fontFamily: 'var(--font-inter)',
                    transition: 'all 0.15s',
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* My account */}
          {user && (
            <div style={{
              background: 'var(--white)', borderRadius: '16px',
              border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700 }}>
                My Account
              </div>
              {[
                { label: 'My Listings',  Icon: ShoppingCart, href: '/my-listings' },
                { label: 'My Exchanges', Icon: Inbox,         href: '/exchanges'   },
                { label: 'Profile',      Icon: User,          href: '/profile'     },
              ].map(item => {
                const Icon = item.Icon
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 16px', fontSize: '13px', fontWeight: 500,
                      color: 'var(--ink2)', cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-inter)',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-pale)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Icon size={15} strokeWidth={2} color="var(--violet)" />
                      {item.label}
                      <ChevronRight size={14} strokeWidth={2} color="var(--muted)" style={{ marginLeft: 'auto' }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </aside>

        {/* MAIN FEED */}
        <main>
          {/* Feed header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '20px',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--ink)' }}>
                {search.trim()
                  ? `Results for "${search}"`
                  : mode === 'all' ? 'Near You Now'
                  : MODES.find(m => m.key === mode)?.label}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px', fontFamily: 'var(--font-inter)' }}>
                {displayed.length > 0
                  ? `${displayed.length} listing${displayed.length !== 1 ? 's' : ''}`
                  : loading ? 'Loading...' : 'No listings found'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select style={{
                padding: '8px 14px', borderRadius: '10px',
                border: '1px solid var(--border)', fontSize: '13px',
                color: 'var(--ink2)', fontFamily: 'var(--font-inter)',
                background: 'var(--white)', cursor: 'pointer', outline: 'none',
              }}>
                <option>Most recent</option>
                <option>Nearest first</option>
                <option>Price: low to high</option>
              </select>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', opacity: 0.5 }}>
                  <div style={{ height: '180px', background: 'var(--cream-dark)' }} />
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ height: '14px', background: 'var(--cream-dark)', borderRadius: '6px', width: '80%' }} />
                    <div style={{ height: '18px', background: 'var(--cream-dark)', borderRadius: '6px', width: '40%' }} />
                    <div style={{ height: '11px', background: 'var(--cream-dark)', borderRadius: '6px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && displayed.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '80px 40px',
              background: 'var(--white)', borderRadius: '20px',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'var(--violet-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Zap size={32} color="var(--violet)" strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                {search.trim() ? 'Nothing found' : 'Be the first to post'}
              </div>
              <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '24px', fontFamily: 'var(--font-inter)' }}>
                {search.trim()
                  ? `No listings match "${search}". Try a different search.`
                  : 'Your neighbourhood is waiting. Start the community.'}
              </div>
              <button onClick={() => router.push('/post')} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--violet)', color: 'white', border: 'none',
                borderRadius: '12px', padding: '13px 28px',
                fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,33,182,0.35)',
              }}>
                <Plus size={16} strokeWidth={2.5} />
                Post something
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && displayed.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {displayed.map((listing, i) => (
                <div key={listing.id} style={{ animation: `cardIn 0.35s ease ${i * 0.04}s both` }}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* RIGHT PANEL */}
        <aside style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Post CTA */}
          <div style={{
            background: 'var(--violet)', borderRadius: '16px',
            padding: '20px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
              You are not a stranger here.
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px', lineHeight: 1.6, fontFamily: 'var(--font-inter)' }}>
              Post a listing and connect with verified neighbours within 3km.
            </div>
            <button onClick={() => router.push('/post')} style={{
              width: '100%', padding: '11px',
              background: 'white', color: 'var(--violet)',
              border: 'none', borderRadius: '10px',
              fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px',
            }}>
              <Plus size={15} strokeWidth={2.5} />
              Post a listing
            </button>
          </div>

          {/* Widgets */}
          {stats.barter > 0 && (
            <Widget
              photo="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
              overlay="linear-gradient(180deg,rgba(120,53,15,0.1) 0%,rgba(120,53,15,0.92) 100%)"
              label={`${stats.barter} exchanges near you`}
              title="Barter Exchange"
              sub="Trade goods with verified neighbours — no cash needed"
              btnLabel="Explore Barter"
              btnColor="var(--barter)"
              onClick={() => setMode('barter')}
            />
          )}

          {stats.meal > 0 && (
            <Widget
              photo="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80"
              overlay="linear-gradient(180deg,rgba(7,89,133,0.1) 0%,rgba(7,89,133,0.92) 100%)"
              label="Meals Now"
              title="Hot food nearby"
              sub="Free meals from neighbours — collect before they expire"
              btnLabel="See Meals"
              btnColor="var(--meal)"
              blink={true}
              onClick={() => setMode('meal')}
            />
          )}

          {(stats.gift > 0 || stats.donate > 0) && (
            <Widget
              photo="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80"
              overlay="linear-gradient(180deg,rgba(157,23,77,0.1) 0%,rgba(157,23,77,0.92) 100%)"
              label="Community Giving"
              title={`${stats.gift + stats.donate} free items`}
              sub="Gifts and donations from your neighbours — no conditions"
              btnLabel="See Gifts"
              btnColor="var(--gift)"
              onClick={() => router.push('/give')}
            />
          )}

          {/* Trust note */}
          <div style={{
            background: 'var(--white)', borderRadius: '16px',
            border: '1px solid var(--border)', padding: '18px',
          }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
              Safe & Trusted
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '14px', fontFamily: 'var(--font-inter)' }}>
              Every exchange happens between phone-verified neighbours. Meet at safe community spots.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: 'Phone Verified', color: 'var(--trade)', bg: 'var(--trade-pale)' },
                { label: 'Safe Meetups',   color: 'var(--violet)', bg: 'var(--violet-pale)' },
                { label: 'Trust Scores',   color: 'var(--barter)', bg: 'var(--barter-pale)' },
              ].map(t => (
                <div key={t.label} style={{
                  fontSize: '10px', fontWeight: 700, padding: '4px 10px',
                  borderRadius: '50px', background: t.bg, color: t.color,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: 'var(--font-inter)',
                }}>
                  <CheckCircle size={9} strokeWidth={2.5} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )
}