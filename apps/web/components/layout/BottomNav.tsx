'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, Plus, Heart, User } from 'lucide-react'

const tabs = [
  { href: '/feed',    icon: Home,            label: 'Home' },
  { href: '/barter',  icon: ArrowLeftRight,  label: 'Barter' },
  { href: '/post',    icon: null,            label: 'Post' },
  { href: '/give',    icon: Heart,           label: 'Give' },
  { href: '/profile', icon: User,            label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
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
        const Icon = tab.icon

        if (!Icon) {
          return (
            <div key={tab.href} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Link href={tab.href} style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-16px',
                boxShadow: '0 4px 20px rgba(28,107,58,0.4)',
                textDecoration: 'none',
                color: 'white',
              }}>
                <Plus size={24} strokeWidth={2.5} />
              </Link>
            </div>
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
            color: isActive ? 'var(--green)' : 'var(--muted)',
          }}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{
              fontSize: '9px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}