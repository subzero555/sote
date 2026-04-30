'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingCart, ArrowLeftRight, Gift, Heart, UtensilsCrossed,
  ArrowLeft, Tag, FileText, MapPin, DollarSign, Repeat,
  Clock, Users, Loader2, CheckCircle
} from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { api } from '@/lib/api'

const MODES = [
  { key: 'TRADE',  label: 'Sell',       sub: 'Set a price, get paid via M-Pesa',   Icon: ShoppingCart,  color: 'var(--trade)',  pale: 'var(--trade-pale)'  },
  { key: 'BARTER', label: 'Barter',     sub: 'Exchange for something you need',     Icon: ArrowLeftRight, color: 'var(--barter)', pale: 'var(--barter-pale)' },
  { key: 'GIFT',   label: 'Gift',       sub: 'Give freely to one neighbour',        Icon: Gift,           color: 'var(--gift)',   pale: 'var(--gift-pale)'   },
  { key: 'DONATE', label: 'Donate',     sub: 'Find it a good home, no conditions',  Icon: Heart,          color: 'var(--donate)', pale: 'var(--donate-pale)' },
  { key: 'MEAL',   label: 'Meal Share', sub: 'Extra food, time-limited offer',      Icon: UtensilsCrossed, color: 'var(--meal)',  pale: 'var(--meal-pale)'   },
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
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '',
    wantedItem: '', neighbourhood: '', meetupHint: '', portions: '', expiresHours: '4',
  })

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.title || !form.category) return
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        mode, title: form.title, images,
        description: form.description || undefined,
        category: form.category,
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
      setTimeout(() => router.push('/feed'), 2000)
    } catch (err: any) {
      alert(err.message || 'Failed to post listing')
    } finally {
      setLoading(false)
    }
  }

  const selectedMode = MODES.find(m => m.key === mode)
  const ModeIcon = selectedMode?.Icon ?? ShoppingCart
  const modeColor = selectedMode?.color ?? 'var(--violet)'
  const modePale = selectedMode?.pale ?? 'var(--violet-pale)'

  const submitStyle: React.CSSProperties = {
    width: '100%', padding: '16px',
    background: loading || !form.title || !form.category ? 'var(--border)' : modeColor,
    color: loading || !form.title || !form.category ? 'var(--muted)' : 'white',
    border: 'none', borderRadius: '12px',
    fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700,
    cursor: loading || !form.title || !form.category ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: loading || !form.title || !form.category ? 'none' : `0 8px 24px ${modeColor}40`,
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--trade-pale)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} color="var(--trade)" strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Posted successfully</div>
        <div style={{ fontSize: '15px', color: 'var(--muted)' }}>Your listing is now visible to neighbours</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{
        background: 'var(--ink)', height: '60px', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/feed" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'var(--violet-light)', letterSpacing: '-1px' }}>Sote</div>
        </Link>
        <button onClick={() => step === 'details' ? setStep('mode') : router.push('/feed')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500,
          fontFamily: 'var(--font-inter)',
        }}>
          <ArrowLeft size={15} strokeWidth={2} />
          {step === 'details' ? 'Back to type' : 'Back to feed'}
        </button>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
            {step === 'mode' ? 'Post a listing' : `Post a ${selectedMode?.label}`}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--muted)' }}>
            {step === 'mode' ? 'Choose the type of listing you want to post' : 'Fill in the details for your listing'}
          </div>
        </div>

        {/* Step 1 — Mode */}
        {step === 'mode' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {MODES.map(m => {
              const Icon = m.Icon
              return (
                <button
                  key={m.key}
                  onClick={() => { setMode(m.key); setStep('details') }}
                  style={{
                    background: 'var(--white)', border: '2px solid var(--border)',
                    borderRadius: '20px', padding: '28px 24px',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = m.color
                    el.style.background = m.pale
                    el.style.transform = 'translateY(-2px)'
                    el.style.boxShadow = 'var(--shadow)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--border)'
                    el.style.background = 'var(--white)'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: m.pale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={m.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>{m.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{m.sub}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 'details' && selectedMode && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Mode badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: modePale, borderRadius: '50px', alignSelf: 'flex-start' }}>
                <ModeIcon size={14} color={modeColor} strokeWidth={2.5} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: modeColor, fontFamily: 'var(--font-inter)' }}>{selectedMode.label}</span>
              </div>

              {/* Photos */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '10px' }}>Photos</label>
                <ImageUpload images={images} onUpload={url => setImages(prev => [...prev, url])} onRemove={url => setImages(prev => prev.filter(u => u !== url))} maxImages={4} />
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Title *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)' }}>
                  <Tag size={16} color="var(--muted)" strokeWidth={1.8} />
                  <input type="text" placeholder="e.g. Samsung TV 32 inch" value={form.title} onChange={e => update('title', e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none' }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Description</label>
                <div style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)', display: 'flex', gap: '10px' }}>
                  <FileText size={16} color="var(--muted)" strokeWidth={1.8} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <textarea placeholder="Condition, size, any details that help..." value={form.description} onChange={e => update('description', e.target.value)} rows={4} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none', resize: 'vertical' }} />
                </div>
              </div>

              {/* Trade price */}
              {mode === 'TRADE' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Price (KES) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)' }}>
                    <DollarSign size={16} color="var(--muted)" strokeWidth={1.8} />
                    <input type="number" placeholder="e.g. 2500" value={form.price} onChange={e => update('price', e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none' }} />
                  </div>
                </div>
              )}

              {/* Barter */}
              {mode === 'BARTER' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>What do you want in exchange? *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--white)' }}>
                    <Repeat size={16} color="var(--muted)" strokeWidth={1.8} />
                    <input type="text" placeholder="e.g. Bicycle, blender, phone..." value={form.wantedItem} onChange={e => update('wantedItem', e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontFamily: 'var(--font-inter)', color: 'var(--ink)', outline: 'none' }} />
                  </div>
                </div>
              )}

              {/* Meal */}
              {mode === 'MEAL' && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink2)', display: 'block', marginBottom: '8px' }}>Portions</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--border)',