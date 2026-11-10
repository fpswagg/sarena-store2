import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { IBM_Plex_Mono, Space_Grotesk, Syne } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { config } from '@/lib/config'
import { I18nProvider } from '@/lib/i18n/context'
import './globals.css'

const heading = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})
const body = Space_Grotesk({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  icons: { icon: '/logo.png', shortcut: '/logo.png', apple: '/logo.png' },
}

export const viewport: Viewport = { themeColor: '#080C09' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      data-theme="sss"
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-base-100 text-base-content">
        <I18nProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--color-base-200)',
                color: 'var(--color-base-content)',
                borderRadius: '2px',
                border: '1px solid #253323',
              },
            }}
          />
        </I18nProvider>
      </body>
    </html>
  )
}
