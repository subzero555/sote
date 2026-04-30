'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/api'
import { Sparkles, ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed, Building2 } from 'lucide-react'

const MODES = [
  { key: 'all',    label: 'All',    Icon: Sparkles },
  { key: 'trade',  label: 'Trade',  Icon: ShoppingCart },
  { key: 'barter', label: 'Barter', Icon: ArrowLeftRight },
  { key: 'gift',   label: 'Gifts',  Icon: Gift },
  { key: 'donate', label: 'Donate', Icon: Heart },
  { key: 'meal',   label: 'Meals',  Icon: UtensilsCrossed },
]

const modeActiveColors: Record<string, string> = {
  all:    '#1a1510',
  trade:  'var(--green)',
  barter: 'var(--barter)',
  gift:   'var(--purple)',
  donate: 'var(--warm)',
  meal:   'var(--teal)',
}

const STATS = [
  { label: 'Trade',  key: 'trade',  color: 'var(--green)',  Icon: ShoppingCart },
  { label: 'Barter', key: 'barter', color: 'var(--barter)', Icon: ArrowLeftRight },
  { label: 'Gifts',  key: 'gift',   color: 'var(--purple)', Icon: Gift },
  { label: 'Donate', key: 'donate', color: 'var(--warm)',   Icon: Heart },
  { label: 'Meals',  key: 'meal',   color: 'var(--teal)',   Icon: UtensilsCrossed },
]

export default function FeedPage() {
  const [mode, setMode] = useState('all')
  const [listings, setListings] = useState<any[]>([])
  const [stats, setStats] = useState({ trade: 0, barter: 0, gift: 0, donate: 0, meal: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeed()
    loadStats()
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>
      <TopBar />

      {/* Mode filter bar */}
      <div style={{
        background: '#ffffff',
        padding: '12px 16px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: '65px',
        zIndex: 40,
        scrollbarWidth: 'none',
      }}>
        {MODES.map((m) => {
          const Icon = m.Icon
          return (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1.5px solid',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
              background: mode === m.key ? modeActiveColors[m.key] : 'transparent',
              borderColor: mode === m.key ? modeActiveColors[m.key] : 'var(--border)',
              color: mode === m.key ? 'white' : 'var(--muted)',
            }}>
              <Icon size={13} strokeWidth={2.5} />
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex',
        margin: '16px 16px 0',
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {STATS.map((s, i) => {
          const Icon = s.Icon
          const value = stats[s.key as keyof typeof stats]
          return (
            <div key={s.label} style={{
              flex: 1, padding: '12px 6px', textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <Icon size={14} strokeWidth={2} color={s.color} />
              </div>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '19px', fontWeight: 900,
                color: s.color, lineHeight: 1, marginBottom: '3px',
              }}>
                {value}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feed */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 700 }}>
            Near You Now
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px', marginBottom: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={24} color="var(--green)" strokeWidth={1.5} />
              </div>
            </div>
            <div style={{ fontSize: '14px' }}>Loading...</div>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '16px',
                background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={28} color="var(--green)" strokeWidth={1.5} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: '14px' }}>Be the first to post in your neighbourhood</div>
          </div>
        ) : (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}