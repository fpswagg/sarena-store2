import type { Metadata } from 'next'
import { ServicesSection } from '@/components/ServicesSection'
import { getSite } from '@/lib/sss'

export const metadata: Metadata = {
  title: 'Services',
  alternates: { canonical: '/services' },
}

export default async function ServicesPage() {
  const site = await getSite()
  return <ServicesSection services={site.services} hasAssistant={Boolean(site.chatbot)} />
}
