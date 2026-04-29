'use client'

import Link from 'next/link'

interface Listing {
  id: string
  mode: 'TRADE' | 'BARTER' | 'GIFT' | 'DONATE' | 'MEAL'
  title: string
  emoji: string
  price?: number
  wantedItem?: string
  neighbourhood?: string
  createdAt: string
  user: {
    name?: string
    avatarInitials?: string
    rating: number
    totalDeals: number
  }
}

const modeConfig = {
  TRADE:  { label: '🛒 For Sale',   color: 'var(--green)',  pale: 'var(--green-pale)',  price: (l: Listing) => `Ksh ${l.price?.toLocaleString()}` },
  BARTER: { label: '🔄 Barter',     color: 'var(--barter)', pale: 'var(--barter-pale)', price: () => 'EXCHANGE' },
  GIFT:   { label: '🎁 Free Gift',  color: 'var(--purple)', pale: 'var(--purple-pale)', price: () => 'FREE' },
  DONATE: { label: '❤️ Good Home',  color: 'var(--warm)',   pale: 'var(--warm-pale)',   price: () => 'DONATE' },
  MEAL:   { label: '🍽️ Meal',       color: 'var(--teal)',   pale: 'var(--teal-pale)',   price: () => 'NOW' },
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const cfg = modeConfig[listing.mode]
  const timeAgo = new Date(listing.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(26,21,16,0.08)',
        cursor: 'pointer',
      }}>
        {/* Mode stripe */}
        <div style={{ height: '4px', background: cfg.color }} />

        <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Emoji */}
          <div style={{
            width: '52px', height: '52px',
            borderRadius: '12px',
            background: cfg.pale,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
          }}>
            {listing.emoji}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {listing.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
              {listing.user.name || 'Neighbour'} · ⭐{listing.user.rating.toFixed(1)} · {listing.neighbourhood || 'Nearby'} · {timeAgo}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '16px',
                fontWeight: 900,
                color: cfg.color,
              }}>
                {cfg.price(listing)}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '50px',
                background: cfg.pale,
                color: cfg.color,
              }}>
                {cfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Barter wants row */}
        {listing.mode === 'BARTER' && listing.wantedItem && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px',
            background: 'var(--barter-pale)',
            borderTop: '1px solid rgba(180,83,9,0.1)',
            fontSize: '12px',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--barter)' }}>🟡 Offering</span>
            <span style={{ color: 'var(--barter-mid)' }}>⇌</span>
            <span style={{ color: 'var(--muted)' }}>Wants: {listing.wantedItem}</span>
          </div>
        )}
      </div>
    </Link>
  )
}