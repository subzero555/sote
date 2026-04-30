'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftRight, Info, ArrowLeft, Shield, Star, AlertTriangle } from 'lucide-react'
import { api } from '@/lib/api'
import ListingCard from '@/components/listings/ListingCard'

const RULES = [
  'Both items must be described honestly and accurately',
  'Meet at a verified public safe spot — never at home',
  'Inspect items together before confirming the exchange',
  'Both parties must tap Exchange Complete to close the deal',
  'Never send items before meeting in person',
]

const ALLOWED = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Appliances', 'Sports', 'Kids & Baby']
const RESTRICTED = ['Food & Groceries', 'Services', 'Garden']
const BANNED = ['Cash', 'Financial instruments', 'Prescription drugs', 'Weapons']

export default function BarterPage() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sote_user')
    if (stored) setUser(JSON.parse(stored))
    async function load() {
      try {
        const data: any = await api.getListings({ mode: 'barter' })
        setListings(data.listings)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const canBarter = (user?.totalDeals || 0) >= 5

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--ink)', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/feed" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px' }}>Sote</div>
        </Link>
        <Link href="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
          <ArrowLeft size={15} strokeWidth={2} /> Back to feed
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #78350F, var(--barter))', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeftRight size={24} color="white" strokeWidth={2} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Barter Exchange</div>
            </div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '40px', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
              Trade without cash.
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: '480px' }}>
              Exchange goods with verified neighbours — no money needed. Just something of equal value.
            </div>
          </div>

          {/* Barter unlock status */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Barter Access
            </div>
            {canBarter ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Shield size={22} color="white" strokeWidth={2} />
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'white' }}>You are Barter Ready</div>
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {user?.totalDeals} deals completed. You have full barter access.
                </div>
                <button onClick={() => router.push('/post')} style={{ width: '100%', padding: '12px', background: 'white', color: 'var(--barter)', border: 'none', borderRadius: '12px', fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                  Post a Barter Listing
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <AlertTriangle size={22} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'white' }}>Barter Locked</div>
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Complete {5 - (user?.totalDeals || 0)} more deals to unlock barter posting. This builds trust between neighbours.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{user?.totalDeals || 0} / 5</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((user?.totalDeals || 0) / 5) * 100}%`, background: 'white', borderRadius: '3px' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>

          {/* Listings */}
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
              {listings.length > 0 ? `${listings.length} barter listings near you` : 'No barter listings yet'}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontSize: '15px' }}>Loading...</div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--barter-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <ArrowLeftRight size={30} color="var(--barter)" strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No barter listings yet</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Complete 5 deals to unlock barter posting and be first</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

            {/* 5 rules */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--barter)" strokeWidth={2} />
                5 Safety Rules
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {RULES.map((rule, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--barter-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 800, color: 'var(--barter)' }}>{i + 1}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{rule}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category rules */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700 }}>Category Rules</div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--trade)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Allowed</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {ALLOWED.map(c => <span key={c} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '50px', background: 'var(--trade-pale)', color: 'var(--trade)', fontWeight: 600 }}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--barter)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Restricted</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {RESTRICTED.map(c => <span key={c} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '50px', background: 'var(--barter-pale)', color: 'var(--barter)', fontWeight: 600 }}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Not Allowed</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {BANNED.map(c => <span key={c} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '50px', background: 'var(--donate-pale)', color: 'var(--red)', fontWeight: 600 }}>{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}