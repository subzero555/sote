'use client'

import Link from 'next/link'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  Star, MapPin, Clock
} from 'lucide-react'

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
  TRADE:  {
    label: 'For Sale',
    Icon: ShoppingCart,
    color: 'var(--green)',
    pale: 'var(--green-pale)',
    price: (l: Listing) => `Ksh ${l.price?.toLocaleString()}`,
  },
  BARTER: {
    label: 'Barter',
    Icon: ArrowLeftRight,
    color: 'var(--barter)',
    pale: 'var(--barter-pale)',
    price: () => 'EXCHANGE',
  },
  GIFT:   {
    label: 'Free Gift',
    Icon: Gift,
    color: 'var(--purple)',
    pale: 'var(--purple-pale)',
    price: () => 'FREE',
  },
  DONATE: {
    label: 'Good Home',
    Icon: Heart,
    color: 'var(--warm)',
    pale: 'var(--warm-pale)',
    price: () => 'DONATE',
  },
  MEAL:   {
    label: 'Meal',
    Icon: UtensilsCrossed,
    color: 'var(--teal)',
    pale: 'var(--teal-pale)',
    price: () => 'NOW',
  },
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const cfg = modeConfig[listing.mode]
  const Icon = cfg.Icon
  const timeAgo = new Date(listing.createdAt).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(26,21,16,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}>
        {/* Mode stripe */}
        <div style={{ height: '4px', background: cfg.color }} />

        <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Icon box */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: cfg.pale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: cfg.color,
          }}>
            <Icon size={24} strokeWidth={1.8} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--ink)',
            }}>
              {listing.title}
            </div>

            {/* Meta row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--muted)',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Star size={10} strokeWidth={2} />
                {listing.user.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{listing.user.name || 'Neighbour'}</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <MapPin size={10} strokeWidth={2} />
                {listing.neighbourhood || 'Nearby'}
              </span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Clock size={10} strokeWidth={2} />
                {timeAgo}
              </span>
            </div>

            {/* Price + mode badge */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '50px',
                background: cfg.pale,
                color: cfg.color,
              }}>
                <Icon size={11} strokeWidth={2.5} />
                {cfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Barter wants row */}
        {listing.mode === 'BARTER' && listing.wantedItem && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'var(--barter-pale)',
            borderTop: '1px solid rgba(180,83,9,0.1)',
            fontSize: '12px',
          }}>
            <ArrowLeftRight size={12} strokeWidth={2} color="var(--barter)" />
            <span style={{ fontWeight: 600, color: 'var(--barter)' }}>Wants:</span>
            <span style={{ color: 'var(--muted)' }}>{listing.wantedItem}</span>
          </div>
        )}
      </div>
    </Link>
  )
}