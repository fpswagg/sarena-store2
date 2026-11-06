'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types'
import { useI18n } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/translations'
import { isFeatured, isNew, productCategory } from '@/lib/site'
import { staggerContainer } from '@/lib/motion'

export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('all')
  const { t, locale } = useI18n()

  const filters = useMemo(() => {
    const categories = [...new Set(products.map(p => productCategory(p, locale)).filter(Boolean))]
    return [
      { value: 'all', label: t.products.all, emoji: '🛍️' },
      ...(products.some(isNew) ? [{ value: 'new', label: t.products.new, emoji: '✨' }] : []),
      ...(products.some(isFeatured)
        ? [{ value: 'featured', label: t.products.featured, emoji: '🔥' }]
        : []),
      ...categories.map(category => ({ value: `c:${category}`, label: category, emoji: '' })),
    ]
  }, [products, locale, t])

  // A category name changes with the language: fall back to everything rather than to nothing.
  const active = filters.some(item => item.value === filter) ? filter : 'all'

  const visible = products.filter(product => {
    if (active === 'new') return isNew(product)
    if (active === 'featured') return isFeatured(product)
    if (active.startsWith('c:')) return productCategory(product, locale) === active.slice(2)
    return true
  })

  return (
    <div>
      {/* Filter tabs - Scrollable on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start lg:justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {filters.map(item => (
          <motion.button
            key={item.value}
            onClick={() => setFilter(item.value)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-badge font-medium transition-all duration-300 ${
              active === item.value
                ? 'bg-primary text-primary-content shadow-lg shadow-primary/25'
                : 'bg-base-200 hover:bg-base-300 text-base-content/70'
            }`}
          >
            {item.emoji && <span className="mr-1.5">{item.emoji}</span>}
            {item.label}
          </motion.button>
        ))}
      </motion.div>

      {visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="text-4xl sm:text-5xl mb-4">✨</div>
          <p className="text-base-content/60 font-medium">{t.products.comingSoon}</p>
          <p className="text-sm text-base-content/40 mt-1">{t.products.comingSoonSubtitle}</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {visible.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-base-content/40 mt-6 cursor-default"
        >
          {visible.length === 1
            ? t.products.countOne
            : fill(t.products.countMany, { count: visible.length })}
        </motion.p>
      )}
    </div>
  )
}
