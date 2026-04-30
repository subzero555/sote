'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed, Plus, Trash2, ArrowLeft, Eye } from 'lucide-react'
import { api } from '@/lib/api'

const modeCfg: Record<string, { color: string; pale: string; Icon: any }> = {
  TRADE:  { color: 'var(--trade)',  pale: 'var(--trade-pale)',  Icon: ShoppingCart   },
  BARTER: { color: 'var(--barter)', pale: 'var(--barter-pale)', Icon: ArrowLeftRight },
  GIFT:   { color: 'var(--gift)',   pale: 'var(--gift-pale)',   Icon: Gift           },
  DONATE: { color: 'var(--donate)', pale: 'var(--donate-pale)', Icon: Heart          },
  MEAL:   { color: 'var(--meal)',   pale: 'var(--meal-pale)',   Icon: UtensilsCrossed },
}

const statusCfg: Record<string, { color: string; bg: string }> = {
  ACTIVE:    { color: 'var(--trade)',  bg: 'var(--trade-pale)'  },
  PENDING:   { color: 'var(--gold)',   bg: 'var(--gold-pale)'   },
  COMPLETED: { color: 'var(--muted)', bg: 'var(--cream-dark)'  },
  CANCELLED: { color: 'var(--muted)', bg: 'var(--cream-dark)'  },
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('sote_token')) { router.push('/auth'); return }
    async function load() {
      try {
        const data: any = await api.getMyListings()
        setListings(data.listings)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Cancel this listing?')) return
    setDeleting(id)
    try {
      await api.deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err: any) { alert(err.message || 'Failed to cancel') }
    finally { setDeleting(null) }
  }

  const active = listings.filter(l => l.status === 'ACTIVE')
  const completed = listings.filter(l => l.status === 'COMPLETED' || l.status === 'CANCELLED')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--ink)', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/feed" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px' }}>Sote</div>
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/post')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--violet)', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-inter)' }}>
            <Plus size={14} strokeWidth={2.5} /> New listing
          </button>
          <Link href="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>My Listings</div>
            <div style={{ fontSize: '15px', color: 'var(--muted)' }}>{active.length} active · {completed.length} completed</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: '15px' }}>Loading...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: 'var(--white)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Plus size={32} color="var(--violet)" strokeWidth={1.5} />
            </div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>No listings yet</div>
            <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '28px' }}>Post something to your neighbourhood and start trading</div>
            <button onClick={() => router.push('/post')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--violet)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px 28px', fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,33,182,0.35)' }}>
              <Plus size={16} strokeWidth={2.5} /> Post your first listing
            </button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>Active ({active.length})</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {active.map(listing => {
                    const cfg = modeCfg[listing.mode] || modeCfg.TRADE
                    const Icon = cfg.Icon
                    return (
                      <div key={listing.id} style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ height: '160px', background: listing.images?.[0] ? '#000' : cfg.pale, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {listing.images?.[0]
                            ? <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Icon size={40} color={cfg.color} strokeWidth={1.2} style={{ opacity: 0.5 }} />
                          }
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(5,150,105,0.9)', borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: 'white', fontFamily: 'var(--font-inter)' }}>Active</div>
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: cfg.pale, borderRadius: '50px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, color: cfg.color, fontFamily: 'var(--font-inter)' }}>{listing.mode}</div>
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px', lineHeight: 1.3 }}>{listing.title}</div>
                          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: cfg.color, marginBottom: '12px' }}>
                            {listing.mode === 'TRADE' ? `KES ${listing.price?.toLocaleString()}` : listing.mode === 'BARTER' ? 'EXCHANGE' : 'FREE'}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => router.push(`/listing/${listing.id}`)} style={{ flex: 1, padding: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: 'var(--ink2)', fontFamily: 'var(--font-inter)' }}>
                              <Eye size={13} strokeWidth={2} /> View
                            </button>
                            <button onClick={() => handleDelete(listing.id)} disabled={deleting === listing.id} style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
                              <Trash2 size={13} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>History ({completed.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {completed.map(listing => {
                    const cfg = modeCfg[listing.mode] || modeCfg.TRADE
                    const Icon = cfg.Icon
                    const st = statusCfg[listing.status] || statusCfg.COMPLETED
                    return (
                      <div key={listing.id} style={{ background: 'var(--white)', borderRadius: '14px', border: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', opacity: 0.75 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: cfg.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={20} color={cfg.color} strokeWidth={1.8} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '3px' }}>{listing.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{listing.mode} · {new Date(listing.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color, fontFamily: 'var(--font-inter)' }}>{listing.status}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}