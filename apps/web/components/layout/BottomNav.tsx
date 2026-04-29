'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/feed',    icon: '🏠', label: 'Home' },
  { href: '/barter',  icon: '🔄', label: 'Barter' },
  { href: '/post',    icon: null,  label: 'Post' },
  { href: '/give',    icon: '💜', label: 'Give' },
  { href: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: '#ffffff',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0 20px',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(26,21,16,0.06)',
    }}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)

        if (!tab.icon) {
          return (
            <Link key={tab.href} href={tab.href} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
              borderRadius: '14px',
              fontSize: '24px',
              color: 'white',
              marginTop: '-16px',
              boxShadow: '0 4px 20px rgba(28,107,58,0.4)',
              textDecoration: 'none',
              flex: '0 0 auto',
              margin: '0 auto',
              marginTop: '-16px',
            }}>
              ＋
            </Link>
          )
        }

        return (
          <Link key={tab.href} href={tab.href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            textDecoration: 'none',
            padding: '4px 0',
          }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              color: isActive ? 'var(--green)' : 'var(--muted)',
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}