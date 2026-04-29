'use client'

interface TopBarProps {
  neighbourhood?: string
}

export default function TopBar({ neighbourhood = 'Nairobi' }: TopBarProps) {
  return (
    <header style={{
      background: '#ffffff',
      padding: '18px 20px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(26,21,16,0.06)',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '22px',
          fontWeight: 900,
          color: 'var(--green)',
        }}>
          Sote
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>
          📍 {neighbourhood} · 3km radius
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          width: '38px', height: '38px',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🔍</button>
        <button style={{
          width: '38px', height: '38px',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>🔔</button>
      </div>
    </header>
  )
}