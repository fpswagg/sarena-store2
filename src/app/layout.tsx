import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { I18nProvider } from '@/lib/i18n/context'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sarenastore.cm'),
  title: {
    default: 'Boutique Sarena | Shopping Premium au Cameroun',
    template: '%s | Boutique Sarena',
  },
  description:
    'Boutique sécurisée et conviviale au Cameroun. Découvrez une sélection unique de produits de qualité. Satisfait ou remboursé. Commandez via WhatsApp.',
  keywords: [
    'boutique sarena',
    'sarena store',
    'shopping cameroun',
    'boutique cameroun',
    'produits premium',
    'achat en ligne cameroun',
    'douala',
    'yaounde',
    'whatsapp shopping',
    'satisfait ou remboursé',
  ],
  authors: [{ name: 'Sarena Group' }],
  creator: 'Sarena Group',
  publisher: 'Sarena Group',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CM',
    alternateLocale: 'en_US',
    url: 'https://sarenastore.cm',
    siteName: 'Boutique Sarena',
    title: 'Boutique Sarena | Shopping Premium au Cameroun',
    description: 'Boutique sécurisée et conviviale. Produits de qualité, satisfait ou remboursé. Commandez via WhatsApp.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Boutique Sarena Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boutique Sarena',
    description: 'Shopping premium au Cameroun. Satisfait ou remboursé.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sarenastore.cm',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#F59E0B" />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <I18nProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: 'bg-base-100 text-base-content border border-base-200',
              duration: 3000,
            }}
          />
        </I18nProvider>
      </body>
    </html>
  )
}
