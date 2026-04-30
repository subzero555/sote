'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, ShoppingCart, ArrowLeftRight, Gift, Heart,
  UtensilsCrossed, Star, MapPin, Clock, Shield, MessageCircle,
  Share2, Flag, CheckCircle
} from 'lucide-react'
import { api } from '@/lib/api'

const modeConfig: Record<string, { label: string; Icon: any; color: string; pale: string }> = {
  TRADE:  { label: 'For Sale',  Icon: ShoppingCart,  color: 'var(--green)',  pale: 'var(--green-pale)'  },
  BARTER: { label: 'Barter',   Icon: ArrowLeftRight, color: 'var(--barter)', pale: 'var(--barter-pale)' },
  GIFT:   { label: 'Free Gift', Icon: Gift,           color: 'var(--purple)', pale: 'var(--purple-pale)' },
  DONATE: { label: 'Donate',   Icon: Heart,           color: 'var(--warm)',   pale: 'var(--warm-pale)'   },
  MEAL:   { label: 'Meal',     Icon: UtensilsCrossed, color: 'var(--teal)',   pale: 'var(--teal-pale)'   },
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [interested, setInterested] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data: any = await api.getListing(id as string)
        setListing(data.listing)
      } catch {
        router.push('/feed')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  if (!listing) return null

  const cfg = modeConfig[listing.mode]
  const Icon = cfg.Icon
  const timeAgo = new Date(listing.createdAt).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const badgeStyle: React.CSSProperties = {
    position: 'absolute', top: '16px', left: '16px',
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '50px',
    fontSize: '12px', fontWeight: 700,
    color: cfg.color,
    border: `1px solid ${cfg.color}33`,
  }

  const ctaShadow: React.CSSProperties = {
    width: '100%', padding: '17px',
    background: cfg.color, color: 'white',
    border: 'none', borderRadius: '14px',
    fontFamily: 'var(--font-fraunces)',
    fontSize: '16px', fontWeight: 700,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
    boxShadow: `0 8px 24px ${cfg.color}40`,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff', padding: '18px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => router.back()} style={{
          width: '36px', height: '36px',
          background: 'var(--cream)', border: '1px solid var(--border)',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)',
        }}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            width: '36px', height: '36px', background: 'var(--cream)',
            border: '1px solid var(--border)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)',
          }}>
            <Share2 size={16} strokeWidth={2} />
          </button>
          <button style={{
            width: '36px', height: '36px', background: 'var(--cream)',
            border: '1px solid var(--border)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)',
          }}>
            <Flag size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Images */}
{listing.images && listing.images.length > 0 ? (
  <div style={{ position: 'relative' }}>
    <img
      src={listing.images[0]}
      alt={listing.title}
      style={{ width: '100%', height: '260px', objectFit: 'cover' }}
    />
    {listing.images.length > 1 && (
      <div style={{
        position: 'absolute', bottom: '12px', right: '12px',
        background: 'rgba(26,21,16,0.65)', borderRadius: '50px',
        padding: '4px 10px', fontSize: '12px', color: 'white', fontWeight: 600,
      }}>
        1 / {listing.images.length}
      </div>
    )}
    <div style={badgeStyle}>
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </div>
  </div>
) : (
  <div style={{
    width: '100%', height: '220px',
    background: cfg.pale,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  }}>
    <Icon size={72} color={cfg.color} strokeWidth={1} />
    <div style={badgeStyle}>
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </div>
  </div>
)}

      {/* Content */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Title + price */}
        <div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '24px', fontWeight: 900,
            color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2,
          }}>
            {listing.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '28px', fontWeight: 900,
            color: cfg.color,
          }}>
            {listing.mode === 'TRADE'
              ? `KES ${listing.price?.toLocaleString()}`
              : listing.mode === 'BARTER' ? 'EXCHANGE'
              : listing.mode === 'GIFT' || listing.mode === 'DONATE' ? 'FREE'
              : 'AVAILABLE NOW'}
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} strokeWidth={2} />
            {listing.neighbourhood || 'Nearby'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} strokeWidth={2} />
            {timeAgo}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', background: 'var(--green-pale)',
            borderRadius: '50px', color: 'var(--green)', fontWeight: 600,
          }}>
            {listing.category}
          </span>
        </div>

        {/* Barter wants */}
        {listing.mode === 'BARTER' && listing.wantedItem && (
          <div style={{
            background: 'var(--barter-pale)',
            border: '1px solid rgba(180,83,9,0.15)',
            borderRadius: '12px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <ArrowLeftRight size={18} color="var(--barter)" strokeWidth={2} />
            <div>
              <div style={{
                fontSize: '11px', fontWeight: 700, color: 'var(--barter)',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px',
              }}>
                Looking for
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                {listing.wantedItem}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div style={{
            background: '#ffffff', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '16px',
          }}>
            <div style={{
              fontSize: '12px', fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
            }}>
              About this listing
            </div>
            <div style={{ fontSize: '15px', color: 'var(--ink2)', lineHeight: 1.7 }}>
              {listing.description}
            </div>
          </div>
        )}

        {/* Seller card */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--green-pale)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-fraunces)',
            fontSize: '18px', fontWeight: 700, color: 'var(--green)', flexShrink: 0,
          }}>
            {listing.user.avatarInitials || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '15px', fontWeight: 700, marginBottom: '3px',
            }}>
              {listing.user.name || 'Neighbour'}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', color: 'var(--muted)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={11} strokeWidth={2} />
                {listing.user.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{listing.user.totalDeals} deals</span>
              {listing.user.verificationStatus === 'VERIFIED' && (
                <>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--green)' }}>
                    <Shield size={11} strokeWidth={2} />
                    Verified
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meetup hint */}
        {listing.meetupHint && (
          <div style={{
            background: 'var(--green-pale)', border: '1px solid rgba(28,107,58,0.15)',
            borderRadius: '12px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13px', color: 'var(--green)',
          }}>
            <MapPin size={16} strokeWidth={2} />
            <span><strong>Meetup:</strong> {listing.meetupHint}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px',
        padding: '16px',
        background: 'rgba(247,243,238,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
      }}>
        {interested ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '16px',
            background: 'var(--green-pale)', borderRadius: '14px',
            color: 'var(--green)', fontWeight: 600, fontSize: '15px',
          }}>
            <CheckCircle size={18} strokeWidth={2} />
            Request sent — seller will contact you
          </div>
        ) : (
          <button onClick={() => setInterested(true)} style={ctaShadow}>
            <MessageCircle size={18} strokeWidth={2.5} />
            {listing.mode === 'TRADE' ? 'I want to buy this'
              : listing.mode === 'BARTER' ? 'Propose a trade'
              : listing.mode === 'GIFT' ? 'Request this gift'
              : listing.mode === 'DONATE' ? 'Give it a good home'
              : 'I want this meal'}
          </button>
        )}
      </div>
    </div>
  )
}