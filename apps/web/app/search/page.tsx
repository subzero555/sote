'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, X, Clock, TrendingUp } from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/api'

const TRENDING = ['Samsung TV', 'Maize', 'Sofa', 'School books', 'Blender', 'Baby clothes']
const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Food', 'Books', 'Tools', 'Kids', 'Sports']

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
    if (stored) setRecent(JSON.parse(stored).slice(0, 5))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return }
    const timer = setTimeout(() => doSearch(query), 350)
    return () => clearTimeout(timer)
  }, [query])

  async function doSearch(q: string) {
    setLoading(true)
    setSearched(true)
    try {
      const data: any = await api.getListings({ mode: 'all' })
      const filtered = data.listings.filter((l: any) =>
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.category?.toLowerCase().includes(q.toLowerCase()) ||
        l.description?.toLowerCase().includes(q.toLowerCase()) ||
        l.neighbourhood?.toLowerCase().includes(q.toLowerCase())
      )
      setResults(filtered)
      saveRecent(q)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function saveRecent(q: string) {
    const stored = localStorage.getItem('sote_searches')
    const prev = stored ? JSON.parse(stored) : []
    const updated = [q, ...prev.filter((s: string) => s !== q)].slice(0, 8)
    localStorage.setItem('sote_searches', JSON.stringify(updated))
    setRecent(updated.slice(0, 5))
  }

  function clearRecent() {
    localStorage.removeItem('sote_searches')
    setRecent([])
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      maxWidth: '480px', margin: '0 auto',
    }}>

      {/* Search header */}
      <div style={{
        background: 'var(--ink)',
        padding: '16px 16px 14px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.back()} style={{
            width: '36px', height: '36px', flexShrink: 0,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px', padding: '10px 14px',
          }}>
            <Search size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search listings, categories..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: 'white', fontSize: '15px',
                fontFamily: 'var(--font-inter)',
                outline: 'none',
              }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); setSearched(false) }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)', display: 'flex',
              }}>
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* No query — show suggestions */}
        {!query && (
          <>
            {recent.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)',
                  }}>
                    Recent
                  </div>
                  <button onClick={clearRecent} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: 'var(--violet)', fontWeight: 600,
                    fontFamily: 'var(--font-inter)',
                  }}>
                    Clear
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {recent.map(s => (
                    <button key={s} onClick={() => setQuery(s)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '10px 12px', borderRadius: '10px',
                      textAlign: 'left', width: '100%',
                      fontFamily: 'var(--font-inter)',
                    }}>
                      <Clock size={14} color="var(--muted)" strokeWidth={2} />
                      <span style={{ fontSize: '14px', color: 'var(--ink2)' }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
                color: 'var(--ink)', marginBottom: '12px',
              }}>
                <TrendingUp size={16} strokeWidth={2} color="var(--violet)" />
                Trending
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TRENDING.map(t => (
                  <button key={t} onClick={() => setQuery(t)} style={{
                    padding: '7px 14px', borderRadius: '50px',
                    background: 'var(--white)', border: '1.5px solid var(--border)',
                    fontSize: '13px', fontWeight: 500, color: 'var(--ink2)',
                    cursor: 'pointer', fontFamily: 'var(--font-inter)',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
                color: 'var(--ink)', marginBottom: '12px',
              }}>
                Browse Categories
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setQuery(cat)} style={{
                    padding: '12px 16px', borderRadius: '12px',
                    background: 'var(--white)', border: '1px solid var(--border)',
                    fontSize: '13px', fontWeight: 600, color: 'var(--ink2)',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-inter)',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
            Searching...
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div>
            <div style={{
              fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
              color: 'var(--ink)', marginBottom: '14px',
            }}>
              {results.length > 0
                ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                : `No results for "${query}"`}
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'var(--violet-pale)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <Search size={26} color="var(--violet)" strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                  Nothing found
                </div>
                <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                  Try a different keyword or browse categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {TRENDING.slice(0, 4).map(t => (
                    <button key={t} onClick={() => setQuery(t)} style={{
                      padding: '6px 14px', borderRadius: '50px',
                      background: 'var(--violet-pale)', border: 'none',
                      fontSize: '13px', fontWeight: 500, color: 'var(--violet)',
                      cursor: 'pointer', fontFamily: 'var(--font-inter)',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}