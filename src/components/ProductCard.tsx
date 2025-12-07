'use client'

import { useState, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiMapPin, FiStar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n, getTranslated } from '@/lib/i18n/context'
import { ProductWithRelations, getAverageRatingLevel, generateWhatsAppLink, getRatingInfo } from '@/types'
import { badgePop } from '@/lib/motion'
import clsx from 'clsx'

interface ProductCardProps {
  product: ProductWithRelations
  whatsappNumber: string
  onRate?: (productId: string) => void
  onInteraction?: (productId: string) => void
  canRate?: boolean
  index?: number
}

export function ProductCard({
  product,
  whatsappNumber,
  onRate,
  onInteraction,
  canRate = false,
  index = 0,
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { locale, t } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)

  // Tilt animation values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const name = getTranslated(product.name as Record<string, string>, locale)
  const shortDesc = getTranslated(product.shortDesc as Record<string, string>, locale)
  
  // Check if title exists (name can be empty or missing)
  const hasTitle = name && name.trim().length > 0

  // Check if product is new (isNew flag OR createdAt < 14 days)
  const isNew =
    product.isNew ||
    (product.createdAt &&
      new Date().getTime() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000)
  const isPopular = (product.stats?.views ?? 0) > 100
  const isLimitedStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock === 0
  const ratingLevel = getAverageRatingLevel(product.stats?.ratingAvg ?? 0).level
  const ratingInfo = getRatingInfo(ratingLevel, locale)
  const totalRatings = product.ratings.length
  const isLegendary = ratingLevel === 'LEGENDAIRE' && totalRatings >= 3
  const whatsappLink = generateWhatsAppLink(whatsappNumber, name, product.id)

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isOutOfStock) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleWhatsAppClick = (e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    onInteraction?.(product.id)
    window.open(whatsappLink, '_blank')
  }

  const handleRateClick = (e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRate?.(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isOutOfStock ? 0 : rotateX,
            rotateY: isOutOfStock ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={isOutOfStock ? {} : { y: isLegendary ? -12 : -8, scale: isLegendary ? 1.05 : 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={clsx(
            'group h-full rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col relative',
            isLegendary
              ? 'bg-gradient-to-br from-yellow-50 via-amber-50/80 to-yellow-100/60 dark:from-yellow-900/40 dark:via-amber-900/30 dark:to-yellow-800/20 border-yellow-400/60 ring-4 ring-yellow-400/30 shadow-2xl shadow-yellow-400/25'
              : isOutOfStock
                ? 'bg-base-100 border-base-200 opacity-70 grayscale-[30%]'
                : 'bg-base-100 border-base-200 hover:border-primary/30 card-depth hover:card-depth-hover'
          )}
        >
          {/* Legendary premium glow effect */}
          {isLegendary && !isOutOfStock && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-amber-300/20 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-2xl blur-xl opacity-50 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}

          {/* Image - Rectangular on mobile, square on desktop */}
          <div className={clsx(
            'relative aspect-[4/3] sm:aspect-square overflow-hidden flex-shrink-0',
            isLegendary ? 'bg-gradient-to-br from-yellow-200/50 to-amber-200/50' : 'bg-base-200'
          )}>
            {isImageLoading && (
              <div className={clsx(
                'absolute inset-0 animate-pulse',
                isLegendary
                  ? 'bg-gradient-to-br from-yellow-200/50 to-amber-200/50'
                  : 'bg-gradient-to-br from-base-200 to-base-300'
              )} />
            )}
            <Image
              src={product.thumbnail}
              alt={name}
              fill
              className={clsx(
                'object-cover transition-transform duration-700 ease-out',
                isImageLoading ? 'opacity-0' : 'opacity-100',
                !isOutOfStock && 'group-hover:scale-110',
                isLegendary && 'brightness-105'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setIsImageLoading(false)}
            />

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-base-100/60 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-base-100 text-sm font-badge font-semibold text-base-content/70 shadow-lg">
                  {t.products.soldOut}
                </span>
              </div>
              )}

            {/* Legendary premium overlay */}
            {isLegendary && !isOutOfStock && (
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Badges with squash & stretch */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              {isLegendary && !isOutOfStock && (
                <motion.span
                  variants={badgePop}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="badge badge-sm bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black border-0 text-[10px] font-badge font-bold shadow-lg ring-2 ring-yellow-300/50"
                >
                  👑 {t.ratings.legendaire}
                </motion.span>
              )}
              {isNew && !isOutOfStock && !isLegendary && (
                <motion.span
                  variants={badgePop}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="badge badge-sm badge-nouveau border-0 text-[10px] font-badge font-semibold shadow-sm"
                >
                  ✨ {t.products.new}
                </motion.span>
              )}
              {isPopular && !isOutOfStock && !isLegendary && (
                <motion.span
                  variants={badgePop}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: 0.1 }}
                  className="badge badge-sm badge-populaire border-0 text-[10px] font-badge font-semibold shadow-sm"
                >
                  🔥 {t.products.popular}
                </motion.span>
              )}
              {isLimitedStock && !isOutOfStock && (
                <motion.span
                  variants={badgePop}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: 0.2 }}
                  className="badge badge-sm badge-limited border-0 text-[10px] font-badge font-semibold shadow-sm"
                >
                  ⚡ {t.products.limitedStock}
                </motion.span>
              )}
            </div>

            {/* Rate button overlay */}
            {canRate && !isOutOfStock && (
              <motion.button
                onClick={handleRateClick}
                initial={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={clsx(
                  'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10',
                  isLegendary
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : 'bg-base-100/90'
                )}
                aria-label="Noter ce produit"
              >
                <FiStar className={clsx('w-4 h-4', isLegendary ? 'text-black' : 'text-primary')} />
              </motion.button>
            )}

            {/* Hover overlay with gradient */}
            {!isOutOfStock && (
              <div className={clsx(
                'absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                isLegendary
                  ? 'from-yellow-400/20'
                  : 'from-black/20'
              )} />
            )}
          </div>

          {/* Content - Fixed height with overflow handling */}
          <div
            className={clsx(
              'p-2.5 sm:p-3 flex flex-col flex-1 min-h-0 relative z-10',
              isLegendary && 'bg-gradient-to-b from-yellow-50/80 to-transparent dark:from-yellow-900/20'
            )}
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Location */}
            <div className={clsx(
              'flex items-center gap-1 text-[11px] sm:text-[10px] mb-1.5 sm:mb-1.5 flex-shrink-0',
              isLegendary ? 'text-yellow-700/70 dark:text-yellow-300/70' : 'text-base-content/50'
            )}>
              <FiMapPin className="w-3.5 h-3.5 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="truncate">{product.city}</span>
            </div>

            {/* Title as Badge - Only show if title exists */}
            {hasTitle && (
              <motion.span
                variants={badgePop}
                initial="hidden"
                animate="visible"
                className={clsx(
                  'badge badge-md sm:badge-md mb-2 flex-shrink-0 font-heading font-semibold text-xs sm:text-xs leading-tight border-0 shadow-sm px-2.5 sm:px-3 py-1.5 sm:py-1.5',
                  isLegendary
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black'
                    : 'bg-primary/10 text-primary border-primary/20',
                  isOutOfStock && 'opacity-60'
                )}
              >
              {name}
              </motion.span>
            )}

            {/* Description - Full text visible on mobile */}
            <p className={clsx(
              'text-xs sm:text-[11px] mb-2 flex-1',
              isLegendary ? 'text-yellow-700/80 dark:text-yellow-300/80' : 'text-base-content/60'
            )}>
              {shortDesc}
            </p>

            {/* Rating with cartoon emoji */}
            <div className="flex items-center gap-1.5 sm:gap-1.5 mb-2 flex-shrink-0">
              <span className="text-base sm:text-sm">{ratingInfo.emoji}</span>
              <span
                className={clsx(
                  'text-xs sm:text-[10px] font-badge',
                  isLegendary
                    ? 'text-yellow-800 dark:text-yellow-300 font-bold'
                    : 'text-base-content/70'
                )}
              >
                {ratingInfo.label}
              </span>
            {totalRatings > 0 && (
                <span className={clsx(
                  'text-[10px] sm:text-[9px]',
                  isLegendary ? 'text-yellow-700/60 dark:text-yellow-300/60' : 'text-base-content/40'
                )}>
                  ({totalRatings})
                </span>
              )}
              </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-2.5 sm:pt-2 border-t flex-shrink-0"
              style={{
                borderColor: isLegendary
                  ? 'rgba(251, 191, 36, 0.3)' // yellow-400/30
                  : undefined
              }}
            >
              <div className="min-w-0 flex-1">
                <span
                  className={clsx(
                    'text-lg sm:text-base font-heading font-bold',
                    isOutOfStock
                      ? 'text-base-content/40 line-through'
                      : isLegendary
                        ? 'text-yellow-700 dark:text-yellow-400'
                        : 'text-primary'
                  )}
                >
                  {product.price.toLocaleString('fr-FR')}
                </span>
                <span className={clsx(
                  'text-[10px] sm:text-[9px] ml-1 sm:ml-0.5',
                  isLegendary ? 'text-yellow-700/60 dark:text-yellow-300/60' : 'text-base-content/50'
                )}>
                  FCFA
                </span>
              </div>
              
              {isOutOfStock ? (
                <span className="text-xs sm:text-[10px] text-base-content/40 font-medium">
                  {t.products.outOfStock}
                </span>
              ) : (
                <motion.button
                onClick={handleWhatsAppClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    'btn btn-sm sm:btn-sm btn-circle shadow-md border-0 flex-shrink-0',
                    isLegendary
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-black hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-600 shadow-yellow-400/40'
                      : 'btn-whatsapp'
                  )}
                  aria-label="Commander via WhatsApp"
              >
                  <FaWhatsapp className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-base-100 rounded-2xl overflow-hidden border border-base-200 card-depth h-full">
      <div className="aspect-square bg-gradient-to-br from-base-200 to-base-300 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-base-200 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-base-200 rounded w-3/4 animate-pulse" />
        <div className="h-2 bg-base-200 rounded w-full animate-pulse" />
        <div className="h-2 bg-base-200 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between items-center pt-2 border-t border-base-200">
          <div className="h-4 bg-base-200 rounded w-16 animate-pulse" />
          <div className="h-8 w-8 bg-base-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
