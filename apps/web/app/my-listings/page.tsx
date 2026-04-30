'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ShoppingCart, ArrowLeftRight, Gift,
  Heart, UtensilsCrossed, Plus, Trash2
} from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { api } from '@/lib/api'

const modeConfig: Record<string, { color: string; pale: string; Icon: any }> = {
  TRADE:  { color: 'var(--green)',  pale: 'var(--green-pale)',  Icon: ShoppingCart  },
  BARTER: { color: 'var(--barter)', pale: 'var(--barter-pale)', Icon: ArrowLeftRight },
  GIFT:   { color: 'var(--purple)', pale: 'var(--purple-pale)', Icon: Gift           },
  DONATE: { color: 'var(--warm)',   pale: 'var(--warm-pale)',   Icon: Heart          },
  MEAL:   { color: 'var(--teal)',   pale: 'var(--teal-pale)',   Icon: UtensilsCrossed },
}

const statusColors: Record<string, { color: string; bg: string }> = {
  ACTIVE:    { color: 'var(--green)',  bg: 'var(--green-pale)'  },
  PENDING:   { color: 'var(--gold)',   bg: 'var(--gold-pale)'   },
  COMPLETED: { color: 'var(--muted)', bg: 'var(--border)'       },
  CANCELLED: { color: 'var(--muted)', bg: 'var(--border)'       },
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('sote_token')
    if (!token) { router.push('/auth'); return }
    loadListings()
  }, [])

  async function loadListings() {
    try {
      const data: any = await api.getMyListings()
      setListings(data.listings)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Cancel this listing?')) return
    setDeleting(id)
    try {
      await api.deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to cancel')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff', padding: '18px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.back()} style={{
            width: '36px', height: '36px', background: 'var(--cream)',
            border: '1px solid var(--border)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ink)',
          }}>
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 700 }}>
            My Listings
          </div>
        </div>
        <button
          onClick={() => router.push('/post')}
          style={{
            background: 'var(--green)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '8px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-fraunces)', fontSize: '13px', fontWeight: 700,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New
        </button>
      </div>

      {/* List */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
            Loading...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--green-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Plus size={28} color="var(--green)" strokeWidth={1.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)',
            }}>
              No listings yet
            </div>
            <div style={{ fontSize: '14px', marginBottom: '20px' }}>
              Post something to your neighbourhood
            </div>
            <button
              onClick={() => router.push('/post')}
              style={{
                background: 'var(--green)', color: 'white', border: 'none',
                borderRadius: '12px', padding: '12px 24px',
                fontFamily: 'var(--font-fraunces)', fontSize: '15px',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              Post a listing
            </button>
          </div>
        ) : (
          listings.map(listing => {
            const cfg = modeConfig[listing.mode] || modeConfig.TRADE
            const Icon = cfg.Icon
            const status = statusColors[listing.status] || statusColors.ACTIVE
            return (
              <div
                key={listing.id}
                style={{
                  background: '#ffffff', borderRadius: '16px',
                  border: '1px solid var(--border)', overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(26,21,16,0.06)',
                }}
              >
                <div style={{ height: '3px', background: cfg.color }} />
                <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>

                  {/* Image or icon */}
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '12px',
                    background: cfg.pale, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} alt={listing.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Icon size={24} color={cfg.color} strokeWidth={1.8} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-fraunces)',
                      fontSize: '15px', fontWeight: 700, marginBottom: '3px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {listing.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '50px',
                        background: cfg.pale, color: cfg.color,
                      }}>
                        {listing.mode}
                      </span>
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '50px',
                        background: status.bg, color: status.color,
                      }}>
                        {listing.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => router.push(`/listing/${listing.id}`)}
                      style={{
                        width: '34px', height: '34px',
                        background: 'var(--cream)', border: '1px solid var(--border)',
                        borderRadius: '10px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--ink)',
                      }}
                    >
                      <ArrowLeft size={16} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    {listing.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={deleting === listing.id}
                        style={{
                          width: '34px', height: '34px',
                          background: '#fff0f0', border: '1px solid #fecaca',
                          borderRadius: '10px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--red)',
                        }}
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}