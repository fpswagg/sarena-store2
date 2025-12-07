'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { ProductWithRelations } from '@/types'
import { useI18n } from '@/lib/i18n/context'
import { staggerContainer } from '@/lib/motion'

interface ProductGridProps {
  products: ProductWithRelations[]
  whatsappNumber: string
  isLoading?: boolean
  onRate?: (productId: string) => void
  onInteraction?: (productId: string) => void
  canRate?: boolean
}

export function ProductGrid({
  products,
  whatsappNumber,
  isLoading = false,
  onRate,
  onInteraction,
  canRate = false,
}: ProductGridProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'popular'>('all')
  const { t } = useI18n()

  const filteredProducts = products.filter(product => {
    if (filter === 'new') {
      // Check both isNew flag and createdAt < 14 days
      const isRecent =
        product.createdAt &&
        new Date().getTime() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
      return product.isNew || isRecent
    }
    if (filter === 'popular') return (product.stats?.views ?? 0) > 50
    return true
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs - Scrollable on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start sm:justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {[
          { value: 'all', label: t.products.all, emoji: '🛍️' },
          { value: 'new', label: t.products.new, emoji: '✨' },
          { value: 'popular', label: t.products.popular, emoji: '🔥' },
        ].map(item => (
          <motion.button
            key={item.value}
            onClick={() => setFilter(item.value as typeof filter)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-badge font-medium transition-all duration-300 ${
              filter === item.value
                ? 'bg-primary text-primary-content shadow-lg shadow-primary/25'
                : 'bg-base-200 hover:bg-base-300 text-base-content/70'
            }`}
          >
            <span className="mr-1.5">{item.emoji}</span>
            {item.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid - Optimized for mobile */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="text-4xl sm:text-5xl mb-4">✨</div>
          <p className="text-base-content/60 font-medium">Bientôt disponible...</p>
          <p className="text-sm text-base-content/40 mt-1">
            De nouveaux produits arrivent très vite !
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
                onRate={onRate}
                onInteraction={onInteraction}
                canRate={canRate}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Products count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-base-content/40 mt-6 cursor-default"
      >
        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible
        {filteredProducts.length > 1 ? 's' : ''}
      </motion.p>
    </div>
  )
}
