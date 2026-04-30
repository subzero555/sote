'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, Plus, Inbox, User } from 'lucide-react'

const tabs = [
  { href: '/feed',      Icon: Home,          label: 'Home'   },
  { href: '/barter',   Icon: ArrowLeftRight, label: 'Barter' },
  { href: '/post',     Icon: null,           label: 'Post'   },
  { href: '/exchanges', Icon: Inbox,         label: 'Inbox'  },
  { href: '/profile',  Icon: User,           label: 'Me'     },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px',
      background: 'var(--white)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '8px 0 20px', zIndex: 100,
      boxShadow: '0 -4px 20px rgba(28,16,40,0.08)',
    }}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.Icon

        if (!Icon) {
          return (
            <div key={tab.href} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Link href={tab.href} style={{
                width: '46px', height: '46px',
                background: 'var(--violet)',
                borderRadius: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '-14px',
                boxShadow: '0 4px 16px rgba(91,33,182,0.45)',
                textDecoration: 'none', color: 'white',
              }}>
                <Plus size={22} strokeWidth={2.5} />
              </Link>
            </div>
          )
        }

        return (
          <Link key={tab.href} href={tab.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px',
            textDecoration: 'none', padding: '4px 0',
            color: isActive ? 'var(--violet)' : 'var(--muted)',
          }}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{
              fontSize: '9px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.4px',
              fontFamily: 'var(--font-inter)',
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}