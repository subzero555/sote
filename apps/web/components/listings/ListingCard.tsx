'use client'

import React from 'react'
import Link from 'next/link'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  Star, MapPin, Clock, CheckCircle, Shield
} from 'lucide-react'

interface Listing {
  id: string
  mode: 'TRADE' | 'BARTER' | 'GIFT' | 'DONATE' | 'MEAL'
  title: string
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
    barterScore?: number
    giveScore?: number
  }
}

const modeConfig = {
  TRADE:  { label: 'For Sale',  Icon: ShoppingCart,   color: 'var(--navy)',   pale: 'var(--navy-pale)',   price: (l: Listing) => `KES ${l.price?.toLocaleString()}` },
  BARTER: { label: 'Barter',   Icon: ArrowLeftRight,  color: 'var(--barter)', pale: 'var(--barter-pale)', price: () => 'EXCHANGE'  },
  GIFT:   { label: 'Free Gift', Icon: Gift,            color: 'var(--gift)',   pale: 'var(--gift-pale)',   price: () => 'FREE'      },
  DONATE: { label: 'Good Home', Icon: Heart,           color: 'var(--donate)', pale: 'var(--donate-pale)', price: () => 'DONATE'    },
  MEAL:   { label: 'Meal',      Icon: UtensilsCrossed, color: 'var(--meal)',   pale: 'var(--meal-pale)',   price: () => 'NOW'       },
}

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const cfg = modeConfig[listing.mode]
  const Icon = cfg.Icon
  const hasImage = listing.images && listing.images.length > 0
  const isAvatarUrl = listing.user.avatarInitials?.startsWith('http')
  const isVerified = listing.user.verificationStatus === 'VERIFIED'
  const isBarterReady = (listing.user.barterScore || 0) >= 30

  const isMealUrgent = listing.mode === 'MEAL' && listing.expiresAt
  let mealLeft = ''
  if (isMealUrgent && listing.expiresAt) {
    const mins = Math.floor((new Date(listing.expiresAt).getTime() - Date.now()) / 60000)
    mealLeft = mins > 0 ? `${mins}min left` : 'Expiring'
  }

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'var(--white)', borderRadius: '16px',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)', display: 'flex',
        transition: 'box-shadow 0.15s',
      }}>
        {/* Image / icon col */}
        <div style={{
          width: '88px', flexShrink: 0,
          background: hasImage ? '#000' : cfg.pale,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', minHeight: '96px', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '3px', background: cfg.color,
          }} />
          {hasImage ? (
            <img src={listing.images![0]} alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          ) : (
            <Icon size={28} color={cfg.color} strokeWidth={1.2} style={{ opacity: 0.65 }} />
          )}
          {isMealUrgent && mealLeft && (
            <div style={{
              position: 'absolute', bottom: '4px', left: '4px', right: '4px',
              background: 'rgba(14,116,144,0.9)', borderRadius: '4px',
              padding: '2px 4px', fontSize: '9px', color: 'white',
              fontWeight: 700, textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
            }}>
              <div style={{ width: '5px', height: '5px', background: 'var(--gold-light)', borderRadius: '50%', flexShrink: 0 }} />
              {mealLeft}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '14px', fontWeight: 700, color: 'var(--navy)',
            marginBottom: '4px', lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {listing.title}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', color: 'var(--muted)', marginBottom: '8px',
          }}>
            <MapPin size={10} strokeWidth={2} />
            {listing.neighbourhood || 'Nearby'}
            <span>·</span>
            <Clock size={10} strokeWidth={2} />
            {timeAgo(listing.createdAt)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '16px', fontWeight: 900, color: cfg.color,
            }}>
              {cfg.price(listing)}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '50px',
              background: cfg.pale, color: cfg.color,
            }}>
              <Icon size={9} strokeWidth={2.5} />
              {cfg.label}
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            paddingTop: '8px', borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px',
              background: cfg.pale, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-fraunces)',
              fontSize: '8px', fontWeight: 700, color: cfg.color, flexShrink: 0,
            }}>
              {isAvatarUrl
                ? <img src={listing.user.avatarInitials} alt="av" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : listing.user.avatarInitials || '?'
              }
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink2)' }}>
              {listing.user.name || 'Neighbour'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={9} strokeWidth={2} color="var(--gold)" />
              {listing.user.rating?.toFixed(1) || '0.0'}
            </span>
            {isVerified && (
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                borderRadius: '50px', background: 'var(--green-pale)', color: 'var(--green)',
                display: 'flex', alignItems: 'center', gap: '2px',
              }}>
                <CheckCircle size={8} strokeWidth={2.5} />
                Verified
              </span>
            )}
            {isBarterReady && listing.mode === 'BARTER' && (
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                borderRadius: '50px', background: 'var(--barter-pale)', color: 'var(--barter)',
                display: 'flex', alignItems: 'center', gap: '2px',
              }}>
                <Shield size={8} strokeWidth={2.5} />
                Barter Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {listing.mode === 'BARTER' && listing.wantedItem && (
        <div style={{
          background: 'var(--barter-pale)',
          borderLeft: '3px solid var(--barter)',
          borderRadius: '0 0 16px 16px',
          padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', marginTop: '-4px',
        }}>
          <ArrowLeftRight size={11} strokeWidth={2} color="var(--barter)" />
          <span style={{ fontWeight: 600, color: 'var(--barter)' }}>Wants:</span>
          <span style={{ color: 'var(--ink2)' }}>{listing.wantedItem}</span>
        </div>
      )}
    </Link>
  )
}