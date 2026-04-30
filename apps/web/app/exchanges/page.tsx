'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftRight, ShoppingCart, Gift, Heart, UtensilsCrossed,
  Clock, CheckCircle, XCircle, ArrowLeft, Inbox
} from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { api } from '@/lib/api'

const modeColors: Record<string, string> = {
  TRADE:  'var(--green)',
  BARTER: 'var(--barter)',
  GIFT:   'var(--purple)',
  DONATE: 'var(--warm)',
  MEAL:   'var(--teal)',
}

const modePale: Record<string, string> = {
  TRADE:  'var(--green-pale)',
  BARTER: 'var(--barter-pale)',
  GIFT:   'var(--purple-pale)',
  DONATE: 'var(--warm-pale)',
  MEAL:   'var(--teal-pale)',
}

const modeIcons: Record<string, any> = {
  TRADE:  ShoppingCart,
  BARTER: ArrowLeftRight,
  GIFT:   Gift,
  DONATE: Heart,
  MEAL:   UtensilsCrossed,
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PROPOSED:  { label: 'Pending',   color: 'var(--gold)',   bg: 'var(--gold-pale)' },
  ACCEPTED:  { label: 'Accepted',  color: 'var(--green)',  bg: 'var(--green-pale)' },
  CONFIRMED: { label: 'Confirmed', color: 'var(--teal)',   bg: 'var(--teal-pale)' },
  COMPLETED: { label: 'Done',      color: 'var(--green)',  bg: 'var(--green-pale)' },
  CANCELLED: { label: 'Cancelled', color: 'var(--muted)',  bg: 'var(--border)' },
  DISPUTED:  { label: 'Disputed',  color: 'var(--red)',    bg: 'var(--red-pale)' },
}

export default function ExchangesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [data, setData] = useState<{ sent: any[]; received: any[] }>({ sent: [], received: [] })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('sote_token')
    if (!token) { router.push('/auth'); return }
    loadExchanges()
  }, [])

  async function loadExchanges() {
    try {
      const res: any = await api.getMyExchanges()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatus(exchangeId: string, status: string) {
    setUpdating(exchangeId)
    try {
      await api.updateExchangeStatus(exchangeId, status)
      await loadExchanges()
    } catch (err: any) {
      alert(err.message || 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const list = tab === 'received' ? data.received : data.sent

  function ExchangeCard({ exchange, isSent }: { exchange: any; isSent: boolean }) {
    const color = modeColors[exchange.listing.mode] || 'var(--green)'
    const pale = modePale[exchange.listing.mode] || 'var(--green-pale)'
    const Icon = modeIcons[exchange.listing.mode] || ShoppingCart
    const status = statusConfig[exchange.status]
    const other = isSent ? exchange.receiver : exchange.initiator
    const timeAgo = new Date(exchange.createdAt).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short',
    })

    return (
      <div style={{
        background: '#ffffff', borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(26,21,16,0.06)',
      }}>
        <div style={{ height: '3px', background: color }} />
        <div style={{ padding: '14px 16px' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: pale, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '14px', fontWeight: 700,
                marginBottom: '2px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {exchange.listing.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} strokeWidth={2} />
                {timeAgo} · {isSent ? 'To' : 'From'}: {other?.name || 'Neighbour'}
              </div>
            </div>
            <div style={{
              padding: '3px 10px', borderRadius: '50px',
              fontSize: '11px', fontWeight: 700,
              background: status?.bg, color: status?.color,
              flexShrink: 0,
            }}>
              {status?.label}
            </div>
          </div>

          {/* Message */}
          {exchange.message && (
            <div style={{
              fontSize: '13px', color: 'var(--ink2)',
              background: 'var(--cream)', borderRadius: '8px',
              padding: '8px 12px', marginBottom: '10px',
              fontStyle: 'italic',
            }}>
              "{exchange.message}"
            </div>
          )}

          {/* Barter counter offer */}
          {exchange.counterItem && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--barter-pale)', borderRadius: '8px',
              padding: '8px 12px', marginBottom: '10px',
              fontSize: '13px', color: 'var(--barter)',
            }}>
              <ArrowLeftRight size={13} strokeWidth={2} />
              <span><strong>Offering:</strong> {exchange.counterItem}</span>
            </div>
          )}

          {/* Action buttons */}
          {exchange.status === 'PROPOSED' && !isSent && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => handleStatus(exchange.id, 'ACCEPTED')}
                disabled={updating === exchange.id}
                style={{
                  flex: 1, padding: '10px',
                  background: 'var(--green)', color: 'white',
                  border: 'none', borderRadius: '10px',
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <CheckCircle size={14} strokeWidth={2.5} />
                Accept
              </button>
              <button
                onClick={() => handleStatus(exchange.id, 'CANCELLED')}
                disabled={updating === exchange.id}
                style={{
                  flex: 1, padding: '10px',
                  background: 'var(--cream)', color: 'var(--muted)',
                  border: '1.5px solid var(--border)', borderRadius: '10px',
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <XCircle size={14} strokeWidth={2} />
                Decline
              </button>
            </div>
          )}

          {exchange.status === 'ACCEPTED' && (
            <button
              onClick={() => handleStatus(exchange.id, 'COMPLETED')}
              disabled={updating === exchange.id}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--green)', color: 'white',
                border: 'none', borderRadius: '10px',
                fontFamily: 'var(--font-fraunces)',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                marginTop: '4px',
              }}
            >
              <CheckCircle size={14} strokeWidth={2.5} />
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '88px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff', padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => router.back()} style={{
          width: '36px', height: '36px', background: 'var(--cream)',
          border: '1px solid var(--border)', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--ink)',
        }}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 700 }}>
          My Exchanges
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#ffffff', padding: '12px 16px',
        display: 'flex', gap: '8px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: '65px', zIndex: 40,
      }}>
        {[
          { key: 'received', label: 'Received', count: data.received.length },
          { key: 'sent',     label: 'Sent',     count: data.sent.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              flex: 1, padding: '10px',
              borderRadius: '12px', cursor: 'pointer',
              border: '1.5px solid',
              borderColor: tab === t.key ? 'var(--green)' : 'var(--border)',
              background: tab === t.key ? 'var(--green-pale)' : 'transparent',
              color: tab === t.key ? 'var(--green)' : 'var(--muted)',
              fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            {t.label}
            <span style={{
              background: tab === t.key ? 'var(--green)' : 'var(--border)',
              color: tab === t.key ? 'white' : 'var(--muted)',
              borderRadius: '50px', padding: '1px 7px',
              fontSize: '11px', fontWeight: 700,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
            Loading...
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--green-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Inbox size={28} color="var(--green)" strokeWidth={1.5} />
            </div>
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)',
            }}>
              No exchanges yet
            </div>
            <div style={{ fontSize: '14px' }}>
              {tab === 'received' ? 'When neighbours request your listings, they appear here'
                : 'Listings you have requested appear here'}
            </div>
          </div>
        ) : (
          list.map(exchange => (
            <ExchangeCard
              key={exchange.id}
              exchange={exchange}
              isSent={tab === 'sent'}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}