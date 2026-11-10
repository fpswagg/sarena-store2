'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { ClientsSection } from '@/components/ClientsSection'
import { CommunitySection } from '@/components/CommunitySection'
import { ContactSection } from '@/components/ContactSection'
import { HeroSection } from '@/components/HeroSection'
import { ProductGrid } from '@/components/ProductGrid'
import { SectionHeader } from '@/components/SectionHeader'
import { ServicesSection } from '@/components/ServicesSection'
import { SssSection } from '@/components/SssSection'
import { TeamSection } from '@/components/TeamSection'
import { useI18n } from '@/lib/i18n/context'
import { homePicks } from '@/lib/site'
import type { ClientSite, Product, Service, TeamMember } from '@/lib/types'

export function HomePage({
  products,
  services,
  team,
  clients,
  hasAssistant,
}: {
  products: Product[]
  services: Service[]
  team: TeamMember[]
  clients: ClientSite[]
  hasAssistant: boolean
}) {
  const { t } = useI18n()

  return (
    <>
      <HeroSection />
      <ServicesSection services={homePicks(services, 3)} hasAssistant={hasAssistant} showAllLink />

      <section id="produits" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            badge={t.products.badge}
            title={t.products.title}
            subtitle={t.products.subtitle}
          />
          <ProductGrid products={homePicks(products, 4)} compact />
          <div className="text-center mt-8">
            <Link href="/products" className="btn btn-outline btn-primary gap-2 font-heading">
              {t.products.seeAll}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SssSection />
      <ClientsSection clients={clients} />
      <TeamSection members={team} />
      <CommunitySection />
      <ContactSection hasAssistant={hasAssistant} />
    </>
  )
}
