'use client'

import { useState, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import { badgePop } from '@/lib/motion'
import {
  formatAmount,
  isFeatured,
  isLimited,
  isNew,
  isOutOfStock,
  isPriceOnRequest,
  productDescription,
  productMessage,
  productName,
  whatsappUrl,
} from '@/lib/site'
import { useSite } from '@/lib/site-context'
import type { Product } from '@/lib/types'
import clsx from 'clsx'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { locale, t } = useI18n()
  const { city, whatsapp, siteUrl } = useSite()
  const cardRef = useRef<HTMLDivElement>(null)

  // Tilt animation values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const name = productName(product, locale)
  const description = productDescription(product, locale)
  const soldOut = isOutOfStock(product)
  const onRequest = isPriceOnRequest(product)
  const image = product.images[0]?.url

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || soldOut) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) / rect.width)
    y.set((e.clientY - (rect.top + rect.height / 2)) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleWhatsAppClick = (e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(whatsappUrl(whatsapp, productMessage(product, siteUrl, locale)), '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.06 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: soldOut ? 0 : rotateX,
            rotateY: soldOut ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={soldOut ? {} : { y: -8, scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={clsx(
            'group h-full rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col relative',
            soldOut
              ? 'bg-base-100 border-base-200 opacity-70 grayscale-[30%]'
              : 'bg-base-100 border-base-200 hover:border-primary/30 card-depth hover:card-depth-hover'
          )}
        >
          {/* Image - Rectangular on mobile, square on desktop */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden flex-shrink-0 bg-base-200">
            {image ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-base-200 to-base-300" />
                )}
                <Image
                  src={image}
                  alt={name}
                  fill
                  className={clsx(
                    'object-cover transition-transform duration-700 ease-out',
                    isImageLoading ? 'opacity-0' : 'opacity-100',
                    !soldOut && 'group-hover:scale-110'
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onLoad={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🛍️</div>
            )}

            {/* Out of stock overlay */}
            {soldOut && (
              <div className="absolute inset-0 bg-base-100/60 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-base-100 text-sm font-badge font-semibold text-base-content/70 shadow-lg">
                  {t.products.soldOut}
                </span>
              </div>
            )}

            {/* Badges with squash & stretch */}
            {!soldOut && (
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                {isNew(product) && (
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
                {isFeatured(product) && (
                  <motion.span
                    variants={badgePop}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: 0.1 }}
                    className="badge badge-sm badge-populaire border-0 text-[10px] font-badge font-semibold shadow-sm"
                  >
                    🔥 {t.products.featured}
                  </motion.span>
                )}
                {isLimited(product) && (
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
            )}

            {/* Hover overlay with gradient */}
            {!soldOut && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
          </div>

          {/* Content */}
          <div
            className="p-2.5 sm:p-3 flex flex-col flex-1 min-h-0 relative z-10"
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Location */}
            {city && (
              <div className="flex items-center gap-1 text-[11px] sm:text-[10px] mb-1.5 flex-shrink-0 text-base-content/50">
                <FiMapPin className="w-3.5 h-3.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{city}</span>
              </div>
            )}

            {/* Title as Badge */}
            <motion.span
              variants={badgePop}
              initial="hidden"
              animate="visible"
              className={clsx(
                'self-start max-w-full mb-2 flex-shrink-0 rounded-full font-heading font-semibold text-xs leading-tight shadow-sm px-2.5 sm:px-3 py-1.5 bg-primary/10 text-primary',
                soldOut && 'opacity-60'
              )}
            >
              {name}
            </motion.span>

            {/* Description */}
            <p className="text-xs sm:text-[11px] mb-2 flex-1 text-base-content/60 line-clamp-2">
              {description}
            </p>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-2.5 sm:pt-2 border-t border-base-200 flex-shrink-0">
              <div className="min-w-0 flex-1">
                {onRequest ? (
                  <span className="text-sm font-heading font-semibold text-primary">
                    {t.products.priceOnRequest}
                  </span>
                ) : (
                  <>
                    <span
                      className={clsx(
                        'text-lg sm:text-base font-heading font-bold',
                        soldOut ? 'text-base-content/40 line-through' : 'text-primary'
                      )}
                    >
                      {formatAmount(product.price)}
                    </span>
                    <span className="text-[10px] sm:text-[9px] ml-1 sm:ml-0.5 text-base-content/50">
                      FCFA
                    </span>
                  </>
                )}
              </div>

              {soldOut ? (
                <span className="text-xs sm:text-[10px] text-base-content/40 font-medium">
                  {t.products.outOfStock}
                </span>
              ) : (
                <motion.button
                  onClick={handleWhatsAppClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-sm btn-circle shadow-md border-0 flex-shrink-0 btn-whatsapp"
                  aria-label={t.products.order}
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
