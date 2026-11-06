'use client'

import { ProductGrid } from '@/components/ProductGrid'
import { SectionHeader } from '@/components/SectionHeader'
import { useI18n } from '@/lib/i18n/context'
import type { Product } from '@/lib/types'

export function ProductsPage({ products }: { products: Product[] }) {
  const { t } = useI18n()
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          badge={t.products.badge}
          title={t.products.title}
          subtitle={t.products.subtitle}
        />
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
