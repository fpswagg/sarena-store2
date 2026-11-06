'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { ProductCard } from '@/components/ProductCard'
import { useI18n } from '@/lib/i18n/context'
import { badgePop, whatsappPulse } from '@/lib/motion'
import {
  formatAmount,
  formatPrice,
  isFeatured,
  isLimited,
  isNew,
  isOutOfStock,
  isPriceOnRequest,
  productCategory,
  productDescription,
  productMessage,
  productName,
  whatsappUrl,
} from '@/lib/site'
import { useSite } from '@/lib/site-context'
import type { Product } from '@/lib/types'
import clsx from 'clsx'

export function ProductDetailPage({ product, related }: { product: Product; related: Product[] }) {
  const { t, locale } = useI18n()
  const { city, whatsapp, siteUrl } = useSite()
  const [selected, setSelected] = useState(0)

  const name = productName(product, locale)
  const description = productDescription(product, locale)
  const category = productCategory(product, locale)
  const soldOut = isOutOfStock(product)
  const onRequest = isPriceOnRequest(product)
  const images = product.images
  const variants = product.variants.filter(variant => variant.active)
  const link = whatsappUrl(whatsapp, productMessage(product, siteUrl, locale))

  const previous = () => setSelected(i => (i - 1 + images.length) % images.length)
  const next = () => setSelected(i => (i + 1) % images.length)

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Link
          href="/#produits"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t.productDetail.back}
        </Link>
      </div>

      {soldOut && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 mt-3 sm:mt-4"
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-error/10 border border-error/20 flex items-center gap-3">
            <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-error flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-error text-sm sm:text-base">
                {t.products.soldOut}
              </p>
              <p className="text-xs sm:text-sm text-error/80">{t.productDetail.outOfStock}</p>
            </div>
          </div>
        </motion.div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={clsx(
                'relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-base-200 mb-3 sm:mb-4',
                soldOut
                  ? 'opacity-70 grayscale-[30%]'
                  : 'ring-4 ring-primary/20 shadow-2xl shadow-primary/10'
              )}
            >
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[selected].url}
                      alt={images[selected].alt || name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl">🛍️</div>
              )}

              {soldOut && (
                <div className="absolute inset-0 bg-base-100/50 flex items-center justify-center">
                  <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-base-100 text-sm sm:text-lg font-heading font-bold text-base-content/70 shadow-xl">
                    {t.products.soldOut}
                  </span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <motion.button
                    onClick={previous}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm glass shadow-lg"
                    aria-label={t.productDetail.previous}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={next}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm glass shadow-lg"
                    aria-label={t.productDetail.next}
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              )}

              {!soldOut && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                  {isNew(product) && (
                    <motion.span
                      variants={badgePop}
                      initial="hidden"
                      animate="visible"
                      className="badge badge-sm sm:badge-md badge-nouveau border-0 font-badge font-semibold shadow-md"
                    >
                      ✨ {t.products.new}
                    </motion.span>
                  )}
                  {isFeatured(product) && (
                    <motion.span
                      variants={badgePop}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                      className="badge badge-sm sm:badge-md badge-populaire border-0 font-badge font-semibold shadow-md"
                    >
                      🔥 {t.products.featured}
                    </motion.span>
                  )}
                  {isLimited(product) && (
                    <motion.span
                      variants={badgePop}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                      className="badge badge-sm sm:badge-md badge-limited border-0 font-badge font-semibold shadow-md"
                    >
                      ⚡ {t.products.limitedStock}
                    </motion.span>
                  )}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <motion.button
                    key={image.url}
                    onClick={() => setSelected(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      'relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all',
                      selected === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-base-300'
                    )}
                    aria-label={`Image ${index + 1}`}
                  >
                    <Image src={image.url} alt="" fill className="object-cover" sizes="64px" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-2 sm:mb-3 text-base-content/60">
              {city && (
                <span className="inline-flex items-center gap-1">
                  <FiMapPin className="w-3.5 h-3.5" />
                  {city}
                </span>
              )}
              {category && <span className="text-primary font-medium">{category}</span>}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-3 sm:mb-4">
              {name}
            </h1>

            {/* Price */}
            <div className="mb-5 sm:mb-6">
              {onRequest ? (
                <span className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {t.products.priceOnRequest}
                </span>
              ) : (
                <>
                  <span
                    className={clsx(
                      'text-3xl sm:text-4xl font-heading font-bold',
                      soldOut ? 'text-base-content/40 line-through' : 'text-primary'
                    )}
                  >
                    {formatAmount(product.price)}
                  </span>
                  <span className="text-sm ml-1.5 text-base-content/50">FCFA</span>
                </>
              )}
            </div>

            {/* WhatsApp CTA */}
            {soldOut ? (
              <div className="mb-6 sm:mb-8 space-y-3">
                <div className="p-4 rounded-2xl bg-base-200 text-center text-sm font-medium text-base-content/60">
                  {t.productDetail.unavailable}
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full gap-2 font-heading"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  {t.productDetail.askAvailability}
                </a>
              </div>
            ) : (
              <motion.a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                variants={whatsappPulse}
                animate="animate"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-lg btn-whatsapp w-full gap-2.5 font-heading mb-6 sm:mb-8"
              >
                <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
                {t.products.order}
              </motion.a>
            )}

            {variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  {t.productDetail.variants}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map(variant => (
                    <span
                      key={variant.id}
                      className={clsx(
                        'px-3 py-1.5 rounded-full text-xs font-medium',
                        variant.quantity > 0 || product.unlimitedStock
                          ? 'bg-primary/10 text-primary'
                          : 'bg-base-200 text-base-content/40 line-through'
                      )}
                    >
                      {variant.name}
                      {variant.price != null && variant.price !== product.price
                        ? ` · ${formatPrice(variant.price)}`
                        : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {description && (
              <div>
                <h3 className="font-heading font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  {t.productDetail.description}
                </h3>
                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-base-content/70">
                  {description}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 border-t border-base-200">
          <h2 className="text-xl sm:text-2xl font-heading font-bold mb-4 sm:mb-6">
            {t.productDetail.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
