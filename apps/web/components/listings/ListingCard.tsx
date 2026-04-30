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

const cfg = {
  TRADE:  { label: 'For Sale',  Icon: ShoppingCart,   color: 'var(--trade)',  pale: 'var(--trade-pale)',  price: (l: Listing) => `KES ${l.price?.toLocaleString()}` },
  BARTER: { label: 'Barter',   Icon: ArrowLeftRight,  color: 'var(--barter)', pale: 'var(--barter-pale)', price: () => 'EXCHANGE' },
  GIFT:   { label: 'Free Gift', Icon: Gift,            color: 'var(--gift)',   pale: 'var(--gift-pale)',   price: () => 'FREE'     },
  DONATE: { label: 'Good Home', Icon: Heart,           color: 'var(--donate)', pale: 'var(--donate-pale)', price: () => 'DONATE'   },
  MEAL:   { label: 'Meal',      Icon: UtensilsCrossed, color: 'var(--meal)',   pale: 'var(--meal-pale)',   price: () => 'NOW'      },
}

function ago(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const c = cfg[listing.mode]
  const Icon = c.Icon
  const hasImg = listing.images && listing.images.length > 0
  const isUrl = listing.user.avatarInitials?.startsWith('http')
  const verified = listing.user.verificationStatus === 'VERIFIED'
  const barterReady = (listing.user.barterScore || 0) >= 30

  const isMeal = listing.mode === 'MEAL' && listing.expiresAt
  let mealLeft = ''
  if (isMeal && listing.expiresAt) {
    const mins = Math.floor((new Date(listing.expiresAt).getTime() - Date.now()) / 60000)
    mealLeft = mins > 0 ? `${mins}min` : 'Expiring'
  }

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'var(--white)', borderRadius: '16px',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)', display: 'flex',
      }}>
        {/* Image col */}
        <div style={{
          width: '90px', flexShrink: 0,
          background: hasImg ? '#000' : c.pale,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', minHeight: '100px', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '3px', background: c.color, zIndex: 1,
          }} />
          {hasImg ? (
            <img src={listing.images![0]} alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          ) : (
            <Icon size={28} color={c.color} strokeWidth={1.2} style={{ opacity: 0.6 }} />
          )}
          {isMeal && mealLeft && (
            <div style={{
              position: 'absolute', bottom: '4px', left: '4px', right: '4px',
              background: 'rgba(8,145,178,0.92)', borderRadius: '4px',
              padding: '2px 4px', fontSize: '9px', color: 'white',
              fontWeight: 700, textAlign: 'center', zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
              fontFamily: 'var(--font-inter)',
            }}>
              <div style={{ width: '5px', height: '5px', background: '#FCD34D', borderRadius: '50%', flexShrink: 0 }} />
              {mealLeft}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '14px', fontWeight: 700, color: 'var(--ink)',
            marginBottom: '4px', lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {listing.title}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', color: 'var(--muted)', marginBottom: '8px',
            fontFamily: 'var(--font-inter)',
          }}>
            <MapPin size={10} strokeWidth={2} />
            {listing.neighbourhood || 'Nearby'}
            <span style={{ opacity: 0.5 }}>·</span>
            <Clock size={10} strokeWidth={2} />
            {ago(listing.createdAt)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '16px', fontWeight: 800, color: c.color,
            }}>
              {c.price(listing)}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: 600,
              padding: '3px 8px', borderRadius: '50px',
              background: c.pale, color: c.color,
              fontFamily: 'var(--font-inter)',
            }}>
              <Icon size={9} strokeWidth={2.5} />
              {c.label}
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            paddingTop: '8px', borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px',
              background: c.pale, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-syne)',
              fontSize: '8px', fontWeight: 700, color: c.color, flexShrink: 0,
            }}>
              {isUrl
                ? <img src={listing.user.avatarInitials} alt="av" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : listing.user.avatarInitials || '?'
              }
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 600, color: 'var(--ink2)',
              fontFamily: 'var(--font-inter)',
            }}>
              {listing.user.name || 'Neighbour'}
            </span>
            <span style={{
              fontSize: '11px', color: 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: '2px',
              fontFamily: 'var(--font-inter)',
            }}>
              <Star size={9} strokeWidth={2} color="var(--gold)" />
              {listing.user.rating?.toFixed(1) || '0.0'}
            </span>
            {verified && (
              <span style={{
                fontSize: '9px', fontWeight: 600, padding: '1px 6px',
                borderRadius: '50px', background: 'var(--trade-pale)', color: 'var(--trade)',
                display: 'flex', alignItems: 'center', gap: '2px',
                fontFamily: 'var(--font-inter)',
              }}>
                <CheckCircle size={8} strokeWidth={2.5} />
                Verified
              </span>
            )}
            {barterReady && listing.mode === 'BARTER' && (
              <span style={{
                fontSize: '9px', fontWeight: 600, padding: '1px 6px',
                borderRadius: '50px', background: 'var(--barter-pale)', color: 'var(--barter)',
                display: 'flex', alignItems: 'center', gap: '2px',
                fontFamily: 'var(--font-inter)',
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
          padding: '8px 14px', marginTop: '-4px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', fontFamily: 'var(--font-inter)',
        }}>
          <ArrowLeftRight size={11} strokeWidth={2} color="var(--barter)" />
          <span style={{ fontWeight: 600, color: 'var(--barter)' }}>Wants:</span>
          <span style={{ color: 'var(--ink2)' }}>{listing.wantedItem}</span>
        </div>
      )}
    </Link>
  )
}