import type { Metadata, Viewport } from 'next'
import { Fraunces, Epilogue } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sote — All of us',
  description: "Kenya's hyperlocal neighbourhood marketplace",
}

export const viewport: Viewport = {
  themeColor: '#0f1f3d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${epilogue.variable}`}>
      <body>{children}</body>
    </html>
  )
}