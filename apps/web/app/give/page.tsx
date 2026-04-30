'use client'

import { useEffect, useState } from 'react'
import { Gift, Heart } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/api'

export default function GivePage() {
  const [gifts, setGifts] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'gift' | 'donate'>('gift')

  useEffect(() => {
    async function load() {
      try {
        const [giftData, donateData]: any[] = await Promise.all([
          api.getListings({ mode: 'gift' }),
          api.getListings({ mode: 'donate' }),
        ])
        setGifts(giftData.listings)
        setDonations(donateData.listings)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const active = tab === 'gift' ? gifts : donations
  const tabColor = tab === 'gift' ? 'var(--purple)' : 'var(--warm)'
  const tabPale = tab === 'gift' ? 'var(--purple-pale)' : 'var(--warm-pale)'
  const TabIcon = tab === 'gift' ? Gift : Heart

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>
      <TopBar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--purple), #9b3daa)',
        padding: '20px 20px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '160px', height: '160px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
          bottom: '-40px', right: '-20px',
        }} />
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '22px', fontWeight: 900,
          color: 'white', marginBottom: '6px',
        }}>
          Community Giving
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
          Gifts and donations from your neighbours — take what you need, give what you can.
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#ffffff',
        padding: '12px 16px',
        display: 'flex', gap: '8px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: '65px', zIndex: 40,
      }}>
        {[
          { key: 'gift', label: 'Free Gifts', Icon: Gift, color: 'var(--purple)', pale: 'var(--purple-pale)', count: gifts.length },
          { key: 'donate', label: 'Good Home', Icon: Heart, color: 'var(--warm)', pale: 'var(--warm-pale)', count: donations.length },
        ].map(t => {
          const Icon = t.Icon
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              style={{
                flex: 1, padding: '10px',
                borderRadius: '12px', cursor: 'pointer',
                border: '1.5px solid',
                borderColor: isActive ? t.color : 'var(--border)',
                background: isActive ? t.pale : 'transparent',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
                color: isActive ? t.color : 'var(--muted)',
                fontWeight: 600, fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} strokeWidth={2.5} />
              {t.label}
              <span style={{
                background: isActive ? t.color : 'var(--border)',
                color: isActive ? 'white' : 'var(--muted)',
                borderRadius: '50px', padding: '1px 7px',
                fontSize: '11px', fontWeight: 700,
              }}>
                {t.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Listings */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
            Loading...
          </div>
        ) : active.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: tabPale,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <TabIcon size={28} color={tabColor} strokeWidth={1.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)',
            }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: '14px' }}>
              Be the first to give something away
            </div>
          </div>
        ) : (
          active.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}