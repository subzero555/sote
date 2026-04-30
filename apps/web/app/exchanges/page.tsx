'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  Clock, CheckCircle, XCircle, Inbox, ArrowLeft
} from 'lucide-react'
import { api } from '@/lib/api'

const modeColors: Record<string, string> = { TRADE: 'var(--trade)', BARTER: 'var(--barter)', GIFT: 'var(--gift)', DONATE: 'var(--donate)', MEAL: 'var(--meal)' }
const modePale: Record<string, string>   = { TRADE: 'var(--trade-pale)', BARTER: 'var(--barter-pale)', GIFT: 'var(--gift-pale)', DONATE: 'var(--donate-pale)', MEAL: 'var(--meal-pale)' }
const modeIcons: Record<string, any>     = { TRADE: ShoppingCart, BARTER: ArrowLeftRight, GIFT: Gift, DONATE: Heart, MEAL: UtensilsCrossed }
const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  PROPOSED:  { label: 'Pending',   color: 'var(--gold)',   bg: 'var(--gold-pale)'   },
  ACCEPTED:  { label: 'Accepted',  color: 'var(--trade)',  bg: 'var(--trade-pale)'  },
  CONFIRMED: { label: 'Confirmed', color: 'var(--meal)',   bg: 'var(--meal-pale)'   },
  COMPLETED: { label: 'Done',      color: 'var(--trade)',  bg: 'var(--trade-pale)'  },
  CANCELLED: { label: 'Cancelled', color: 'var(--muted)',  bg: 'var(--cream-dark)'  },
  DISPUTED:  { label: 'Disputed',  color: 'var(--red)',    bg: 'var(--donate-pale)' },
}

export default function ExchangesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [data, setData] = useState<{ sent: any[]; received: any[] }>({ sent: [], received: [] })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('sote_token')) { router.push('/auth'); return }
    loadExchanges()
  }, [])

  async function loadExchanges() {
    try {
      const res: any = await api.getMyExchanges()
      setData(res)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleStatus(id: string, status: string) {
    setUpdating(id)
    try {
      await api.updateExchangeStatus(id, status)
      await loadExchanges()
    } catch (err: any) { alert(err.message || 'Failed to update') }
    finally { setUpdating(null) }
  }

  const list = tab === 'received' ? data.received : data.sent

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

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 40px' }}>

        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>My Exchanges</div>
        <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '32px' }}>Track your exchange requests and responses</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', background: 'var(--white)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '24px' }}>
          {[
            { key: 'received', label: 'Received', count: data.received.length },
            { key: 'sent',     label: 'Sent',     count: data.sent.length     },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, transition: 'all 0.15s', background: tab === t.key ? 'var(--violet)' : 'transparent', color: tab === t.key ? 'white' : 'var(--muted)' }}>
              {t.label}
              <span style={{ background: tab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--cream-dark)', color: tab === t.key ? 'white' : 'var(--muted)', borderRadius: '50px', padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontSize: '15px' }}>Loading...</div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Inbox size={30} color="var(--violet)" strokeWidth={1.5} />
            </div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No exchanges yet</div>
            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
              {tab === 'received' ? 'When neighbours request your listings, they appear here' : 'Listings you have requested appear here'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {list.map(exchange => {
              const color = modeColors[exchange.listing?.mode] || 'var(--violet)'
              const pale = modePale[exchange.listing?.mode] || 'var(--violet-pale)'
              const Icon = modeIcons[exchange.listing?.mode] || ShoppingCart
              const status = statusCfg[exchange.status] || statusCfg.PROPOSED
              const other = tab === 'sent' ? exchange.receiver : exchange.initiator
              const isSent = tab === 'sent'

              return (
                <div key={exchange.id} style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ height: '3px', background: color }} />
                  <div style={{ padding: '20px 24px' }}>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: pale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={22} color={color} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{exchange.listing?.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                          <Clock size={12} strokeWidth={2} />
                          {new Date(exchange.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                          <span>·</span>
                          <span>{isSent ? 'To' : 'From'}: <strong style={{ color: 'var(--ink2)' }}>{other?.name || 'Neighbour'}</strong></span>
                        </div>
                      </div>
                      <div style={{ padding: '5px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: status.bg, color: status.color, flexShrink: 0 }}>
                        {status.label}
                      </div>
                    </div>

                    {exchange.message && (
                      <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: 'var(--ink2)', fontStyle: 'italic', marginBottom: '12px' }}>
                        "{exchange.message}"
                      </div>
                    )}

                    {exchange.counterItem && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--barter-pale)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--barter)', marginBottom: '12px' }}>
                        <ArrowLeftRight size={14} strokeWidth={2} />
                        <span><strong>Offering:</strong> {exchange.counterItem}</span>
                      </div>
                    )}

                    {exchange.status === 'PROPOSED' && !isSent && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleStatus(exchange.id, 'ACCEPTED')} disabled={updating === exchange.id} style={{ flex: 1, padding: '11px', background: 'var(--trade)', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <CheckCircle size={15} strokeWidth={2.5} /> Accept
                        </button>
                        <button onClick={() => handleStatus(exchange.id, 'CANCELLED')} disabled={updating === exchange.id} style={{ flex: 1, padding: '11px', background: 'var(--cream)', color: 'var(--muted)', border: '1.5px solid var(--border)', borderRadius: '10px', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <XCircle size={15} strokeWidth={2} /> Decline
                        </button>
                      </div>
                    )}

                    {exchange.status === 'ACCEPTED' && (
                      <button onClick={() => handleStatus(exchange.id, 'COMPLETED')} disabled={updating === exchange.id} style={{ width: '100%', padding: '11px', background: 'var(--trade)', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <CheckCircle size={15} strokeWidth={2.5} /> Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}