import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Assistant } from '@/components/Assistant'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SiteProvider } from '@/lib/site-context'
import { getSite } from '@/lib/sss'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const images = site.ogImageUrl ? [{ url: site.ogImageUrl }] : undefined
  return {
    title: { default: 'Boutique Sarena', template: '%s | Boutique Sarena' },
    description: site.seoDescription,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'fr_CM',
      alternateLocale: 'en_US',
      url: '/',
      siteName: 'Boutique Sarena',
      title: 'Boutique Sarena',
      description: site.seoDescription,
      images,
    },
    twitter: { card: 'summary', title: 'Boutique Sarena', description: site.seoDescription },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const site = await getSite()
  return (
    <SiteProvider info={site.info}>
      <Header />
      <main className="min-h-screen bg-base-100">{children}</main>
      <Footer />
      {site.chatbot && <Assistant bot={site.chatbot} apiUrl={site.apiUrl} />}
    </SiteProvider>
  )
}
