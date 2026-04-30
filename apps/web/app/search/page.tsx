'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Clock, TrendingUp, ArrowLeft } from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/api'

const TRENDING = ['Samsung TV', 'Maize', 'Sofa', 'School books', 'Blender', 'Baby clothes', 'Bicycle', 'Fridge']
const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Food & Groceries', 'Books', 'Tools', 'Kids & Baby', 'Sports', 'Garden', 'Appliances', 'Services', 'Other']

export default function SearchPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    inputRef.current?.focus()
    const stored = localStorage.getItem('sote_searches')
    if (stored) setRecent(JSON.parse(stored).slice(0, 6))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return }
    const t = setTimeout(() => doSearch(query), 350)
    return () => clearTimeout(t)
  }, [query])

  async function doSearch(q: string) {
    setLoading(true); setSearched(true)
    try {
      const data: any = await api.getListings({ mode: 'all' })
      const lower = q.toLowerCase()
      setResults(data.listings.filter((l: any) =>
        l.title.toLowerCase().includes(lower) ||
        l.category?.toLowerCase().includes(lower) ||
        l.description?.toLowerCase().includes(lower) ||
        l.neighbourhood?.toLowerCase().includes(lower)
      ))
      const stored = localStorage.getItem('sote_searches')
      const prev = stored ? JSON.parse(stored) : []
      const updated = [q, ...prev.filter((s: string) => s !== q)].slice(0, 8)
      localStorage.setItem('sote_searches', JSON.stringify(updated))
      setRecent(updated.slice(0, 6))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--ink)', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', flexShrink: 0, fontFamily: 'var(--font-inter)' }}>
          <ArrowLeft size={15} strokeWidth={2} />
        </Link>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '10px 16px' }}>
          <Search size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <input ref={inputRef} type="text" placeholder="Search listings, categories, neighbourhoods..." value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-inter)' }} />
          {query && <button onClick={() => { setQuery(''); setResults([]); setSearched(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0 }}><X size={15} strokeWidth={2} /></button>}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px' }}>

        {!query && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              {recent.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>Recent searches</div>
                    <button onClick={() => { localStorage.removeItem('sote_searches'); setRecent([]) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--violet)', fontWeight: 600, fontFamily: 'var(--font-inter)' }}>Clear</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {recent.map(s => (
                      <button key={s} onClick={() => setQuery(s)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', borderRadius: '10px', textAlign: 'left', width: '100%', fontFamily: 'var(--font-inter)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-pale)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Clock size={14} color="var(--muted)" strokeWidth={2} />
                        <span style={{ fontSize: '14px', color: 'var(--ink2)' }}>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px' }}>
                  <TrendingUp size={18} strokeWidth={2} color="var(--violet)" /> Trending
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {TRENDING.map(t => (
                    <button key={t} onClick={() => setQuery(t)} style={{ padding: '8px 16px', borderRadius: '50px', background: 'var(--white)', border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 500, color: 'var(--ink2)', cursor: 'pointer', fontFamily: 'var(--font-inter)', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = 'var(--violet)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink2)' }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px' }}>Browse Categories</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setQuery(cat)} style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--white)', border: '1px solid var(--border)', fontSize: '14px', fontWeight: 600, color: 'var(--ink2)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-inter)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = 'var(--violet)'; e.currentTarget.style.background = 'var(--violet-pale)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink2)'; e.currentTarget.style.background = 'var(--white)' }}
                  >{cat}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: '15px' }}>Searching...</div>}

        {!loading && searched && (
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
              {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : `No results for "${query}"`}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              {results.length > 0 ? 'Showing listings that match your search' : 'Try a different keyword or browse categories below'}
            </div>
            {results.length === 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TRENDING.slice(0, 6).map(t => (
                  <button key={t} onClick={() => setQuery(t)} style={{ padding: '8px 16px', borderRadius: '50px', background: 'var(--violet-pale)', border: 'none', fontSize: '13px', fontWeight: 500, color: 'var(--violet)', cursor: 'pointer', fontFamily: 'var(--font-inter)' }}>{t}</button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {results.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}