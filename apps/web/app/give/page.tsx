'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, Heart, ArrowLeft, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import ListingCard from '@/components/listings/ListingCard'

export default function GivePage() {
  const router = useRouter()
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
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const active = tab === 'gift' ? gifts : donations

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--ink)', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/feed" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px' }}>Sote</div>
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/post')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--violet)', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-inter)' }}>
            <Plus size={14} strokeWidth={2.5} /> Give something
          </button>
          <Link href="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #4a1870, var(--gift))', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={24} color="white" strokeWidth={2} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Community Giving</div>
          </div>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '40px', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '12px' }}>
            Give. Receive. Connect.
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '560px' }}>
            Gifts and donations from your neighbours — no conditions, no payment, just community kindness within 3km.
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'white' }}>{gifts.length}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Free Gifts</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: 'white' }}>{donations.length}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Good Homes</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          {[
            { key: 'gift',   label: 'Free Gifts',    Icon: Gift,  color: 'var(--gift)',   bg: 'var(--gift-pale)',   count: gifts.length     },
            { key: 'donate', label: 'Good Home',     Icon: Heart, color: 'var(--donate)', bg: 'var(--donate-pale)', count: donations.length },
          ].map(t => {
            const Icon = t.Icon
            const isActive = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key as any)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', border: '2px solid', borderColor: isActive ? t.color : 'var(--border)', background: isActive ? t.bg : 'var(--white)', color: isActive ? t.color : 'var(--muted)', fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, transition: 'all 0.15s' }}>
                <Icon size={16} strokeWidth={2} />
                {t.label}
                <span style={{ background: isActive ? t.color : 'var(--cream-dark)', color: isActive ? 'white' : 'var(--muted)', borderRadius: '50px', padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}>{t.count}</span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontSize: '15px' }}>Loading...</div>
        ) : active.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: tab === 'gift' ? 'var(--gift-pale)' : 'var(--donate-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {tab === 'gift' ? <Gift size={30} color="var(--gift)" strokeWidth={1.5} /> : <Heart size={30} color="var(--donate)" strokeWidth={1.5} />}
            </div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Nothing here yet</div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>Be the first to give something away in your neighbourhood</div>
            <button onClick={() => router.push('/post')} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--violet)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={2.5} /> Give something
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {active.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}