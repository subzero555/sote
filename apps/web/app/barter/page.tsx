'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftRight, Info } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/api'

export default function BarterPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data: any = await api.getListings({ mode: 'barter' })
        setListings(data.listings)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>
      <TopBar />

      {/* Barter header */}
      <div style={{
        background: 'var(--barter)',
        padding: '20px 20px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '180px', height: '180px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
          top: '-60px', right: '-40px',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeftRight size={20} color="white" strokeWidth={2} />
          </div>
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '22px', fontWeight: 900, color: 'white',
          }}>
            Barter Exchange
          </div>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
          Trade goods — no cash needed. Find something you need, offer something you have.
        </div>

        {/* Rule note */}
        <div style={{
          marginTop: '14px',
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: '10px 12px',
          fontSize: '12px', color: 'rgba(255,255,255,0.85)',
        }}>
          <Info size={14} strokeWidth={2} style={{ marginTop: '1px', flexShrink: 0 }} />
          Barter is unlocked after 5 completed deals. Builds trust between neighbours.
        </div>
      </div>

      {/* Listings */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
            Loading...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--barter-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <ArrowLeftRight size={28} color="var(--barter)" strokeWidth={1.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)',
            }}>
              No barter listings yet
            </div>
            <div style={{ fontSize: '14px' }}>
              Complete 5 deals to unlock barter posting
            </div>
          </div>
        ) : (
          listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}