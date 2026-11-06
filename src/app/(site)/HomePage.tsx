'use client'

import { ContactSection } from '@/components/ContactSection'
import { HeroSection } from '@/components/HeroSection'
import { ProductGrid } from '@/components/ProductGrid'
import { SectionHeader } from '@/components/SectionHeader'
import { ServicesSection } from '@/components/ServicesSection'
import { TeamSection } from '@/components/TeamSection'
import { useI18n } from '@/lib/i18n/context'
import type { Product, Service, TeamMember } from '@/lib/types'

export function HomePage({
  products,
  services,
  team,
  hasAssistant,
}: {
  products: Product[]
  services: Service[]
  team: TeamMember[]
  hasAssistant: boolean
}) {
  const { t } = useI18n()

  return (
    <>
      <HeroSection />
      <ServicesSection services={services} hasAssistant={hasAssistant} />

      <section id="produits" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            badge={t.products.badge}
            title={t.products.title}
            subtitle={t.products.subtitle}
          />
          <ProductGrid products={products} />
        </div>
      </section>

      <ContactSection hasAssistant={hasAssistant} />
      <TeamSection members={team} />
    </>
  )
}
