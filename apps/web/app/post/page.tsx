'use client'

import React from 'react'
import { useState } from 'react'
import ImageUpload from '@/components/ui/ImageUpload'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  ArrowLeft, Tag, FileText, MapPin, DollarSign, Repeat,
  Clock, Users, Loader2, CheckCircle
} from 'lucide-react'
import { api } from '@/lib/api'

const MODES = [
  { key: 'TRADE',  label: 'Sell',       sub: 'Set a price, get paid via M-Pesa',      Icon: ShoppingCart,  color: 'var(--green)',  pale: 'var(--green-pale)'  },
  { key: 'BARTER', label: 'Barter',     sub: 'Exchange for something you need',        Icon: ArrowLeftRight, color: 'var(--barter)', pale: 'var(--barter-pale)' },
  { key: 'GIFT',   label: 'Gift',       sub: 'Give freely to one neighbour',           Icon: Gift,           color: 'var(--purple)', pale: 'var(--purple-pale)' },
  { key: 'DONATE', label: 'Donate',     sub: 'Find it a good home, no conditions',     Icon: Heart,          color: 'var(--warm)',   pale: 'var(--warm-pale)'   },
  { key: 'MEAL',   label: 'Meal Share', sub: 'Extra food, time-limited offer',         Icon: UtensilsCrossed, color: 'var(--teal)',  pale: 'var(--teal-pale)'   },
]

const CATEGORIES = [
  'Electronics', 'Furniture', 'Clothing', 'Food & Groceries',
  'Books', 'Tools', 'Kids & Baby', 'Sports', 'Garden',
  'Appliances', 'Services', 'Other',
]

export default function PostPage() {
  const router = useRouter()
  const [step, setStep] = useState<'mode' | 'details'>('mode')
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '',
    wantedItem: '', neighbourhood: '', meetupHint: '',
    portions: '', expiresHours: '4',
  })

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.title || !form.category) return
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
  mode,
  title: form.title,
  description: form.description || undefined,
  category: form.category,
  images, // ← add this line
  neighbourhood: form.neighbourhood || undefined,
  meetupHint: form.meetupHint || undefined,
}
      if (mode === 'TRADE') payload.price = parseFloat(form.price)
      if (mode === 'BARTER') payload.wantedItem = form.wantedItem
      if (mode === 'MEAL') {
        payload.portions = parseInt(form.portions) || 1
        payload.expiresAt = new Date(Date.now() + parseInt(form.expiresHours) * 60 * 60 * 1000).toISOString()
      }
      await api.createListing(payload)
      setSuccess(true)
      setTimeout(() => router.push('/feed'), 1500)
    } catch (err: any) {
      alert(err.message || 'Failed to post listing')
    } finally {
      setLoading(false)
    }
  }

  const selectedMode = MODES.find(m => m.key === mode)
  const ModeIcon = selectedMode?.Icon ?? ShoppingCart
  const modeColor = selectedMode?.color ?? 'var(--green)'
  const modePale = selectedMode?.pale ?? 'var(--green-pale)'

  const submitStyle: React.CSSProperties = {
    width: '100%', padding: '17px',
    background: loading || !form.title || !form.category ? 'var(--border)' : modeColor,
    color: loading || !form.title || !form.category ? 'var(--muted)' : 'white',
    border: 'none', borderRadius: '14px',
    fontFamily: 'var(--font-fraunces)',
    fontSize: '16px', fontWeight: 700,
    cursor: loading || !form.title || !form.category ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    marginTop: '8px',
    boxShadow: loading || !form.title || !form.category ? 'none' : `0 8px 24px ${modeColor}40`,
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--cream)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '16px', padding: '24px',
      }}>
        <div style={{
          width: '72px', height: '72px', background: 'var(--green-pale)',
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={36} color="var(--green)" strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', fontWeight: 700, textAlign: 'center' }}>
          Posted to your neighbourhood
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', textAlign: 'center' }}>
          Your neighbours can see it now
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff', padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => step === 'details' ? setStep('mode') : router.back()}
          style={{
            width: '36px', height: '36px', background: 'var(--cream)',
            border: '1px solid var(--border)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ink)',
          }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '17px', fontWeight: 700 }}>
            {step === 'mode' ? 'What are you posting?' : `Post a ${selectedMode?.label}`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Step {step === 'mode' ? '1' : '2'} of 2
          </div>
        </div>
      </div>

      {/* Step 1 — Mode selection */}
      {step === 'mode' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MODES.map((m) => {
            const Icon = m.Icon
            return (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setStep('details') }}
                style={{
                  background: '#ffffff', border: '1.5px solid var(--border)',
                  borderRadius: '16px', padding: '18px 16px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  cursor: 'pointer', textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: m.pale,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={22} color={m.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: '16px', fontWeight: 700,
                    color: 'var(--ink)', marginBottom: '3px',
                  }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.sub}</div>
                </div>
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%', background: m.color, flexShrink: 0,
                }} />
              </button>
            )
          })}
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 'details' && selectedMode && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Mode badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', background: modePale,
            borderRadius: '50px', alignSelf: 'flex-start',
          }}>
            <ModeIcon size={14} color={modeColor} strokeWidth={2.5} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: modeColor }}>
              {selectedMode.label}
            </span>
          </div>
          {/* Photos */}
<div>
  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
    Photos
  </label>
  <ImageUpload
    images={images}
    onUpload={(url) => setImages(prev => [...prev, url])}
    onRemove={(url) => setImages(prev => prev.filter(u => u !== url))}
    maxImages={4}
  />
</div>

          {/* Title */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
              Title *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1.5px solid var(--border)', borderRadius: '12px',
              padding: '14px 16px', background: '#ffffff',
            }}>
              <Tag size={16} color="var(--muted)" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="e.g. Samsung TV 32 inch"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                  color: 'var(--ink)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
              Description
            </label>
            <div style={{
              border: '1.5px solid var(--border)', borderRadius: '12px',
              padding: '14px 16px', background: '#ffffff', display: 'flex', gap: '10px',
            }}>
              <FileText size={16} color="var(--muted)" strokeWidth={1.8} style={{ marginTop: '2px', flexShrink: 0 }} />
              <textarea
                placeholder="Condition, size, any details that help..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                  color: 'var(--ink)', outline: 'none', resize: 'none',
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
              Category *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => update('category', cat)}
                  style={{
                    padding: '8px 14px', borderRadius: '50px',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    border: '1.5px solid',
                    borderColor: form.category === cat ? modeColor : 'var(--border)',
                    background: form.category === cat ? modePale : '#ffffff',
                    color: form.category === cat ? modeColor : 'var(--muted)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Trade price */}
          {mode === 'TRADE' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
                Price (KES) *
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                border: '1.5px solid var(--border)', borderRadius: '12px',
                padding: '14px 16px', background: '#ffffff',
              }}>
                <DollarSign size={16} color="var(--muted)" strokeWidth={1.8} />
                <input
                  type="number" placeholder="e.g. 2500"
                  value={form.price} onChange={e => update('price', e.target.value)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                    color: 'var(--ink)', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Barter wanted */}
          {mode === 'BARTER' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
                What do you want in exchange? *
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                border: '1.5px solid var(--border)', borderRadius: '12px',
                padding: '14px 16px', background: '#ffffff',
              }}>
                <Repeat size={16} color="var(--muted)" strokeWidth={1.8} />
                <input
                  type="text" placeholder="e.g. Bicycle, blender, phone..."
                  value={form.wantedItem} onChange={e => update('wantedItem', e.target.value)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                    color: 'var(--ink)', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Meal */}
          {mode === 'MEAL' && (
            <>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
                  Number of portions
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  border: '1.5px solid var(--border)', borderRadius: '12px',
                  padding: '14px 16px', background: '#ffffff',
                }}>
                  <Users size={16} color="var(--muted)" strokeWidth={1.8} />
                  <input
                    type="number" placeholder="e.g. 3"
                    value={form.portions} onChange={e => update('portions', e.target.value)}
                    style={{
                      flex: 1, border: 'none', background: 'transparent',
                      fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                      color: 'var(--ink)', outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
                  Available for
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['1', '2', '4', '6', '8'].map(h => (
                    <button
                      key={h}
                      onClick={() => update('expiresHours', h)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: '10px',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        border: '1.5px solid',
                        borderColor: form.expiresHours === h ? 'var(--teal)' : 'var(--border)',
                        background: form.expiresHours === h ? 'var(--teal-pale)' : '#ffffff',
                        color: form.expiresHours === h ? 'var(--teal)' : 'var(--muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      }}
                    >
                      <Clock size={11} strokeWidth={2} />
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Neighbourhood */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>
              Neighbourhood
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1.5px solid var(--border)', borderRadius: '12px',
              padding: '14px 16px', background: '#ffffff',
            }}>
              <MapPin size={16} color="var(--muted)" strokeWidth={1.8} />
              <input
                type="text" placeholder="e.g. Kawangware, Nairobi"
                value={form.neighbourhood} onChange={e => update('neighbourhood', e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '15px', fontFamily: 'var(--font-epilogue)',
                  color: 'var(--ink)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.category}
            style={submitStyle}
          >
            {loading
              ? <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
              : <><ModeIcon size={16} strokeWidth={2.5} /> Post {selectedMode.label}</>
            }
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}