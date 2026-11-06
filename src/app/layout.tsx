import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Fredoka, Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { config } from '@/lib/config'
import { I18nProvider } from '@/lib/i18n/context'
import './globals.css'

const heading = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const badge = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-badge',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  icons: { icon: '/logo.png', shortcut: '/logo.png', apple: '/logo.png' },
}

export const viewport: Viewport = { themeColor: '#F59E0B' }

// Applies the saved theme before the first paint (no flash).
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${heading.variable} ${body.variable} ${badge.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content">
        <I18nProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--color-base-200)',
                color: 'var(--color-base-content)',
                borderRadius: '0.875rem',
              },
            }}
          />
        </I18nProvider>
      </body>
    </html>
  )
}
