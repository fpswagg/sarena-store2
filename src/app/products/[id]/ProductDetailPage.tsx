'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft,
  FiMapPin,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiTrash2,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import {
  ProductWithRelations,
  getAverageRatingLevel,
  generateWhatsAppLink,
  getRatingInfo,
} from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useI18n, getTranslated } from '@/lib/i18n/context'
import { recordInteraction, submitRating, deleteRating } from '@/app/actions'
import { RatingModal } from '@/components/RatingModal'
import { whatsappPulse, badgePop } from '@/lib/motion'
import { getRatingTheme } from '@/lib/theme'
import toast from 'react-hot-toast'
import clsx from 'clsx'

interface ProductDetailPageProps {
  product: ProductWithRelations
  relatedProducts: ProductWithRelations[]
  whatsappNumber: string
}

export function ProductDetailPage({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [selectedProductForRating, setSelectedProductForRating] = useState<ProductWithRelations | null>(null)
  const { user } = useAuth()
  const { locale, t } = useI18n()

  const name = getTranslated(product.name as Record<string, string>, locale)
  const shortDesc = getTranslated(product.shortDesc as Record<string, string>, locale)
  const longDesc = getTranslated(product.longDesc as Record<string, string>, locale)
  
  // Check if title exists (name can be empty or missing)
  const hasTitle = name && name.trim().length > 0

  // Check if product is new (isNew flag OR createdAt < 14 days)
  const isNew =
    product.isNew ||
    (product.createdAt &&
      new Date().getTime() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000)

  const isOutOfStock = product.stock === 0
  const canRate = !!user && user.role !== 'SUPPLIER'
  const ratingLevel = getAverageRatingLevel(product.stats?.ratingAvg ?? 0).level
  const ratingInfo = getRatingInfo(ratingLevel, locale)
  const totalRatings = product.ratings.length
  const theme = getRatingTheme(ratingLevel)
  const isLegendary = ratingLevel === 'LEGENDAIRE' && totalRatings >= 3
  const whatsappLink = generateWhatsAppLink(whatsappNumber, name, product.id)

  const handleWhatsAppClick = async () => {
    if (isOutOfStock) return
    await recordInteraction(product.id)
    window.open(whatsappLink, '_blank')
  }

  // Record interaction for related products
  const handleInteraction = async (productId: string) => {
    await recordInteraction(productId)
  }

  // Open rating modal for related products
  const handleOpenRatingModal = (productId: string) => {
    if (!user) {
      toast.error(t.contact.loginNote)
      return
    }
    if (user.role === 'SUPPLIER') {
      toast.error(t.contact.supplierNote)
      return
    }
    const targetProduct = relatedProducts.find(p => p.id === productId) || product
    setSelectedProductForRating(targetProduct)
    setIsRatingModalOpen(true)
  }

  const handleSubmitRating = async (productId: string, level: string, comment: string) => {
    const result = await submitRating(productId, level, comment)
    if (result.success) {
      toast.success(t.common.success)
      // Refresh the page to show updated ratings
      window.location.reload()
    } else {
      toast.error(result.error || t.common.error)
      throw new Error(result.error)
    }
  }

  const handleDeleteRating = async (ratingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre avis ?')) {
      return
    }

    const result = await deleteRating(ratingId)
    if (result.success) {
      toast.success('Avis supprimé avec succès')
      // Refresh the page to show updated ratings
      window.location.reload()
    } else {
      toast.error(result.error || t.common.error)
    }
  }

  const allImages = product.images.length > 0 ? product.images : [product.thumbnail]
  const nextImage = () => setSelectedImageIndex(prev => (prev + 1) % allImages.length)
  const prevImage = () =>
    setSelectedImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)

  return (
    <main className={clsx('min-h-screen', theme.bgGradient)}>
      {/* Decorative blobs based on theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {theme.decorativeBlobs.map((blob, index) => (
          <motion.div
            key={index}
            className={clsx('absolute rounded-full blur-3xl', blob.color, blob.position, blob.size)}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
        ))}
      </div>

      <Header />

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-3 sm:pt-4">
        <Link
          href="/"
          className={clsx(
            'inline-flex items-center gap-1.5 text-sm transition-colors group',
            theme.textColor
          )}
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.productDetail.back}
        </Link>
      </div>

      {/* Rating level banner */}
      {totalRatings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 mt-3 sm:mt-4"
        >
          <div
            className={clsx(
              'p-3 sm:p-4 rounded-2xl border flex items-center gap-3 shadow-lg',
              `bg-gradient-to-r ${theme.badgeGradient}`,
              theme.borderColor,
              theme.shadowColor
            )}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl sm:text-4xl"
            >
              {ratingInfo.emoji}
            </motion.span>
            <div>
              <p
                className={clsx(
                  'font-heading font-bold text-sm sm:text-base',
                  theme.badgeTextColor === 'text-black' ? 'text-black' : 'text-white'
                )}
              >
                {ratingInfo.emoji} {ratingInfo.label}
              </p>
              <p
                className={clsx(
                  'text-xs sm:text-sm',
                  theme.badgeTextColor === 'text-black'
                    ? 'text-black/80'
                    : 'text-white/80'
                )}
              >
                {totalRatings} {totalRatings > 1 ? 'avis' : 'avis'} • {ratingInfo.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Out of stock banner */}
      {isOutOfStock && (
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
              <p className="text-xs sm:text-sm text-error/80">{t.productDetail.unavailable}</p>
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
                isOutOfStock
                  ? 'opacity-70 grayscale-[30%]'
                  : `ring-4 ${theme.ringColor} shadow-2xl ${theme.shadowColor}`
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Theme-based shimmer effect */}
              {!isOutOfStock && (
                <motion.div
                  className={clsx(
                    'absolute inset-0 bg-gradient-to-tr',
                    theme.shimmerColor
                  )}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              )}

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-base-100/50 flex items-center justify-center">
                  <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-base-100 text-sm sm:text-lg font-heading font-bold text-base-content/70 shadow-xl">
                    {t.products.soldOut}
                  </span>
                </div>
              )}

              {/* Navigation buttons */}
              {allImages.length > 1 && !isOutOfStock && (
                <>
                  <motion.button
                    onClick={prevImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm glass shadow-lg"
                    aria-label="Image précédente"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm glass shadow-lg"
                    aria-label="Image suivante"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                {isLegendary && (
                  <motion.span
                    variants={badgePop}
                    initial="hidden"
                    animate="visible"
                    className={clsx(
                      'badge badge-md sm:badge-lg border-0 font-badge font-bold shadow-lg',
                      `bg-gradient-to-r ${theme.badgeGradient}`,
                      theme.badgeTextColor
                    )}
                  >
                    👑 {ratingInfo.label}
                  </motion.span>
                )}
                {isNew && !isOutOfStock && !isLegendary && (
                  <motion.span
                    variants={badgePop}
                    initial="hidden"
                    animate="visible"
                    className="badge badge-sm sm:badge-md badge-nouveau border-0 font-badge font-semibold shadow-md"
                  >
                    ✨ {t.products.new}
                  </motion.span>
                )}
                {(product.stats?.views ?? 0) > 100 && !isLegendary && !isOutOfStock && (
                  <motion.span
                    variants={badgePop}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className="badge badge-sm sm:badge-md badge-populaire border-0 font-badge font-semibold shadow-md"
                  >
                    🔥 {t.products.popular}
                  </motion.span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
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
            </div>

            {/* Thumbnails - Horizontal scroll on mobile */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      'relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all',
                      selectedImageIndex === index
                        ? `${theme.borderColor} ring-2 ${theme.ringColor}`
                        : 'border-transparent hover:border-base-300'
                    )}
                    aria-label={`Image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      loading="lazy"
                    />
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
            {/* Location */}
            <div className={clsx('flex items-center gap-1 text-xs mb-2 sm:mb-3', theme.textColor)}>
              <FiMapPin className="w-3.5 h-3.5" />
              <span>{product.city}</span>
            </div>

            {/* Title - Only show if title exists */}
            {hasTitle && (
              <h1 className={clsx('text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 sm:mb-3', theme.textColor)}>
                {name}
              </h1>
            )}
            <p className={clsx('text-sm sm:text-base mb-4 sm:mb-5', theme.textColor, 'opacity-70')}>
              {shortDesc}
            </p>

            {/* Rating section - Tap to rate on mobile */}
            <motion.button
              onClick={() => canRate && setIsRatingModalOpen(true)}
              disabled={!canRate}
              className={clsx(
                'w-full p-3 sm:p-4 rounded-2xl mb-4 sm:mb-5 text-left transition-all',
                theme.cardBg,
                theme.cardBorder,
                canRate && 'cursor-pointer active:scale-[0.98] hover:shadow-lg'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{ratingInfo.emoji}</span>
                  <div>
                    <span className={clsx('font-badge font-semibold text-sm sm:text-base', theme.textColor)}>
                      {ratingInfo.label}
                    </span>
                    <p className={clsx('text-xs sm:text-sm', theme.textColor, 'opacity-50')}>
                      {totalRatings} {totalRatings > 1 ? 'avis' : 'avis'}
                    </p>
                  </div>
                </div>
                {canRate && (
                  <div className={clsx('flex items-center gap-1 text-xs sm:text-sm font-medium', theme.accentColor)}>
                    <FiStar className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.productDetail.rate}</span>
                  </div>
                )}
              </div>
            </motion.button>

            {/* Price */}
            <div className="mb-4 sm:mb-6">
              <span
                className={clsx(
                  'text-3xl sm:text-4xl font-heading font-bold',
                  isOutOfStock
                    ? 'text-base-content/40 line-through'
                    : theme.accentColor
                )}
              >
                {product.price.toLocaleString('fr-FR')}
              </span>
              <span className={clsx('text-sm sm:text-base ml-2', theme.textColor, 'opacity-50')}>
                FCFA
              </span>
            </div>

            {/* WhatsApp CTA */}
            {isOutOfStock ? (
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 text-center mb-6 sm:mb-8">
                <p className={clsx('text-sm sm:text-base', theme.textColor, 'opacity-60')}>
                  {t.productDetail.unavailable}
                </p>
              </div>
            ) : (
              <motion.button
                onClick={handleWhatsAppClick}
                variants={whatsappPulse}
                animate="animate"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'btn btn-lg w-full gap-2.5 mb-6 sm:mb-8 font-heading shadow-lg text-base sm:text-lg border-0',
                  `bg-gradient-to-r ${theme.buttonGradient} ${theme.buttonGradientHover}`,
                  theme.shadowColor,
                  theme.badgeTextColor === 'text-black' ? 'text-black' : 'text-white'
                )}
              >
                <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
                {t.productDetail.orderVia}
              </motion.button>
            )}

            {/* Description */}
            <div>
              <h3 className={clsx('font-heading font-semibold mb-2 sm:mb-3 text-sm sm:text-base', theme.textColor)}>
                {t.productDetail.description}
              </h3>
              <div className={clsx('text-xs sm:text-sm whitespace-pre-line leading-relaxed', theme.textColor, 'opacity-70')}>
                {longDesc}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={clsx('max-w-6xl mx-auto px-4 py-6 sm:py-8 border-t', theme.borderColor)}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className={clsx('text-lg sm:text-xl font-heading font-bold', theme.textColor)}>
            {t.productDetail.reviews} ({totalRatings})
          </h3>
          {canRate && (
            <motion.button
              onClick={() => setIsRatingModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'btn btn-sm gap-1.5',
                `bg-gradient-to-r ${theme.buttonGradient} border-0`,
                theme.badgeTextColor === 'text-black' ? 'text-black' : 'text-white'
              )}
            >
              <FiStar className="w-4 h-4" />
              <span className="hidden sm:inline">{t.productDetail.rate}</span>
            </motion.button>
          )}
        </div>

        {totalRatings === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx('text-center py-10 sm:py-12 rounded-2xl', theme.cardBg, theme.cardBorder)}
          >
            <span className="text-3xl sm:text-4xl mb-3 block">💬</span>
            <p className={clsx('text-sm sm:text-base mb-2', theme.textColor, 'opacity-60')}>
              {t.productDetail.noReviews}
            </p>
            {canRate && (
              <motion.button
                onClick={() => setIsRatingModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'btn btn-sm mt-3',
                  `bg-gradient-to-r ${theme.buttonGradient} border-0`,
                  theme.badgeTextColor === 'text-black' ? 'text-black' : 'text-white'
                )}
              >
                {t.productDetail.beFirst}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {product.ratings.map(rating => {
              const info = getRatingInfo(rating.level, locale)
              const ratingTheme = getRatingTheme(rating.level)
              const isRatingLegendary = rating.level === 'LEGENDAIRE'
              return (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={clsx(
                    'p-3 sm:p-4 rounded-xl sm:rounded-2xl border relative',
                    isRatingLegendary
                      ? `bg-gradient-to-r ${ratingTheme.badgeGradient} opacity-10 ${ratingTheme.borderColor}`
                      : `${ratingTheme.cardBg} ${ratingTheme.cardBorder}`
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="text-xl sm:text-2xl">{info.emoji}</span>
                    <span className={clsx('font-badge font-semibold text-sm sm:text-base', ratingTheme.textColor)}>
                      {info.label}
                    </span>
                    <span className={clsx('text-[10px] sm:text-xs ml-auto cursor-default', theme.textColor, 'opacity-40')}>
                      {new Date(rating.createdAt).toLocaleDateString(
                        locale === 'fr' ? 'fr-FR' : 'en-US'
                      )}
                    </span>
                    {/* Delete button - only show if it's the user's own rating */}
                    {user && rating.userId === user.id && (
                      <motion.button
                        onClick={() => handleDeleteRating(rating.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={clsx(
                          'btn btn-ghost btn-xs btn-circle',
                          theme.textColor,
                          'opacity-60 hover:opacity-100 hover:text-error'
                        )}
                        aria-label="Supprimer mon avis"
                        title="Supprimer mon avis"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </div>
                  {rating.comment && (
                    <p className={clsx('text-xs sm:text-sm', theme.textColor, 'opacity-70')}>
                      {rating.comment}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className={clsx('max-w-6xl mx-auto px-4 py-8 sm:py-12 border-t', theme.borderColor)}>
          <h2 className={clsx('text-xl sm:text-2xl font-heading font-bold mb-4 sm:mb-6', theme.textColor)}>
            {t.productDetail.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                whatsappNumber={whatsappNumber} 
                onRate={canRate ? handleOpenRatingModal : undefined}
                onInteraction={handleInteraction}
                canRate={canRate}
                index={i} 
              />
            ))}
          </div>
        </section>
      )}

      <Footer whatsappNumber={whatsappNumber} />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false)
          setSelectedProductForRating(null)
        }}
        productId={selectedProductForRating?.id || product.id}
        productName={(selectedProductForRating?.name || product.name) as Record<string, string>}
        onSubmit={handleSubmitRating}
      />
    </main>
  )
}
