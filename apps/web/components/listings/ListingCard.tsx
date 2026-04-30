'use client'

import React from 'react'
import Link from 'next/link'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  Star, MapPin, Clock, Shield, CheckCircle
} from 'lucide-react'

interface Listing {
  id: string
  mode: 'TRADE' | 'BARTER' | 'GIFT' | 'DONATE' | 'MEAL'
  title: string
  emoji?: string
  images?: string[]
  price?: number
  wantedItem?: string
  neighbourhood?: string
  expiresAt?: string
  createdAt: string
  user: {
    name?: string
    avatarInitials?: string
    rating: number
    totalDeals: number
    verificationStatus?: string
    tradeScore?: number
    barterScore?: number
    giveScore?: number
  }
}

const modeConfig = {
  TRADE:  { label: 'For Sale',  Icon: ShoppingCart,   color: 'var(--green)',  pale: 'var(--green-pale)',  price: (l: Listing) => `KES ${l.price?.toLocaleString()}` },
  BARTER: { label: 'Barter',   Icon: ArrowLeftRight,  color: 'var(--barter)', pale: 'var(--barter-pale)', price: () => 'EXCHANGE' },
  GIFT:   { label: 'Free Gift', Icon: Gift,            color: 'var(--purple)', pale: 'var(--purple-pale)', price: () => 'FREE' },
  DONATE: { label: 'Good Home', Icon: Heart,           color: 'var(--warm)',   pale: 'var(--warm-pale)',   price: () => 'DONATE' },
  MEAL:   { label: 'Meal',      Icon: UtensilsCrossed, color: 'var(--teal)',   pale: 'var(--teal-pale)',   price: () => 'NOW' },
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getUserBadges(user: Listing['user']): string[] {
  const badges: string[] = []
  if (user.verificationStatus === 'VERIFIED') badges.push('Verified')
  if ((user.totalDeals || 0) >= 10) badges.push('Trusted')
  if ((user.barterScore || 0) >= 30) badges.push('Barter Ready')
  if ((user.giveScore || 0) >= 50) badges.push('Generous')
  return badges
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const cfg = modeConfig[listing.mode]
  const Icon = cfg.Icon
  const timeAgo = getTimeAgo(listing.createdAt)
  const badges = getUserBadges(listing.user)
  const hasImage = listing.images && listing.images.length > 0
  const isAvatarUrl = listing.user.avatarInitials?.startsWith('http')

  // Meal urgency
  const isMealUrgent = listing.mode === 'MEAL' && listing.expiresAt
  let mealTimeLeft = ''
  if (isMealUrgent && listing.expiresAt) {
    const mins = Math.floor((new Date(listing.expiresAt).getTime() - Date.now()) / 60000)
    if (mins > 0) mealTimeLeft = `${mins}min left`
    else mealTimeLeft = 'Expiring'
  }

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(26,21,16,0.07)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}>
        {/* Mode stripe */}
        <div style={{ height: '3px', background: cfg.color }} />

        <div style={{ display: 'flex', gap: '0' }}>
          {/* Image or icon */}
          <div style={{
            width: '90px', flexShrink: 0,
            background: hasImage ? '#000' : cfg.pale,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
            minHeight: '100px',
          }}>
            {hasImage ? (
              <img
                src={listing.images![0]}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            ) : (
              <Icon size={32} color={cfg.color} strokeWidth={1.2} style={{ opacity: 0.7 }} />
            )}
            {isMealUrgent && mealTimeLeft && (
              <div style={{
                position: 'absolute', bottom: '4px', left: '4px', right: '4px',
                background: 'rgba(14,116,144,0.9)', borderRadius: '4px',
                padding: '2px 4px', fontSize: '9px', color: 'white',
                fontWeight: 700, textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
              }}>
                <div style={{ width: '5px', height: '5px', background: '#f5c842', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                {mealTimeLeft}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>

            {/* Title */}
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '14px', fontWeight: 700,
              marginBottom: '4px', lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {listing.title}
            </div>

            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', color: 'var(--muted)', marginBottom: '8px',
              flexWrap: 'wrap',
            }}>
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

            {/* Price + badge row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '16px', fontWeight: 900, color: cfg.color,
              }}>
                {cfg.price(listing)}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '10px', fontWeight: 700,
                padding: '3px 8px', borderRadius: '50px',
                background: cfg.pale, color: cfg.color,
              }}>
                <Icon size={10} strokeWidth={2.5} />
                {cfg.label}
              </div>
            </div>

            {/* Seller row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              paddingTop: '8px', borderTop: '1px solid var(--border)',
            }}>
              {/* Avatar */}
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px',
                background: cfg.pale, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-fraunces)',
                fontSize: '9px', fontWeight: 700, color: cfg.color,
                flexShrink: 0,
              }}>
                {isAvatarUrl ? (
                  <img src={listing.user.avatarInitials} alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  listing.user.avatarInitials || '?'
                )}
              </div>

              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink2)' }}>
                {listing.user.name || 'Neighbour'}
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--muted)' }}>
                <Star size={10} strokeWidth={2} color="var(--gold)" />
                {listing.user.rating?.toFixed(1) || '0.0'}
              </span>

              {/* Inline badges */}
              {badges.slice(0, 2).map(badge => (
                <div key={badge} style={{
                  display: 'flex', alignItems: 'center', gap: '2px',
                  fontSize: '9px', fontWeight: 700,
                  padding: '2px 6px', borderRadius: '50px',
                  background: badge === 'Verified' ? 'var(--green-pale)' : 'var(--barter-pale)',
                  color: badge === 'Verified' ? 'var(--green)' : 'var(--barter)',
                }}>
                  {badge === 'Verified' ? <CheckCircle size={8} strokeWidth={2.5} /> : <Shield size={8} strokeWidth={2.5} />}
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barter wants row */}
        {listing.mode === 'BARTER' && listing.wantedItem && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px',
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

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </Link>
  )
}