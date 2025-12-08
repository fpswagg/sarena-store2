'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n/context'
import toast from 'react-hot-toast'
import {
  Header,
  Footer,
  HeroSection,
  ProductGrid,
  TeamSection,
  defaultTeamMembers,
  ComplaintForm,
  RatingModal,
} from '@/components'
import { ProductWithRelations, LogExport } from '@/types'
import { recordInteraction, submitRating, submitComplaint } from './actions'
import { FiMessageCircle } from 'react-icons/fi'

interface HomePageProps {
  products: ProductWithRelations[]
  whatsappNumber: string
  logs: LogExport[]
}

export function HomePage({ products, whatsappNumber }: HomePageProps) {
  const { user: session } = useAuth()
  const { t } = useI18n()
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>()
  const [selectedProductName, setSelectedProductName] = useState<string | Record<string, string>>('')

  const isLoggedIn = !!session
  const isSupplier = session?.role === 'SUPPLIER'
  const canRateOrComplain = isLoggedIn && !isSupplier

  // Record WhatsApp click interaction
  const handleInteraction = useCallback(async (productId: string) => {
    await recordInteraction(productId)
  }, [])

  // Open rating modal with product
  const handleOpenRatingModal = useCallback(
    (productId: string) => {
      if (!isLoggedIn) {
        toast.error(t.contact.loginNote)
        return
      }
      if (isSupplier) {
        toast.error(t.contact.supplierNote)
        return
      }
      const product = products.find(p => p.id === productId)
    setSelectedProductId(productId)
      if (product?.name) {
        setSelectedProductName(product.name as Record<string, string>)
      } else {
        setSelectedProductName('')
      }
    setIsRatingModalOpen(true)
    },
    [isLoggedIn, isSupplier, products, t]
  )

  // Open complaint modal (with or without product)
  const handleOpenComplaintModal = useCallback(
    (productId?: string) => {
      if (!isLoggedIn) {
        toast.error(t.contact.loginNote)
        return
      }
      if (isSupplier) {
        toast.error(t.contact.supplierNote)
        return
      }
      const product = productId ? products.find(p => p.id === productId) : undefined
    setSelectedProductId(productId)
      if (product?.name) {
        setSelectedProductName(product.name as Record<string, string>)
      } else {
        setSelectedProductName('')
      }
    setIsComplaintModalOpen(true)
    },
    [isLoggedIn, isSupplier, products, t]
  )

  // Submit rating via Server Action
  const handleSubmitRating = async (productId: string, level: string, comment: string) => {
    const result = await submitRating(productId, level, comment)
    if (result.success) toast.success(t.common.success)
    else {
      toast.error(result.error || t.common.error)
      throw new Error(result.error)
    }
  }

  // Submit complaint via Server Action
  const handleSubmitComplaint = async (message: string, productId?: string, adminId?: string) => {
    const result = await submitComplaint(message, productId, adminId)
    if (result.success) toast.success(t.common.success)
    else {
      toast.error(result.error || t.common.error)
      throw new Error(result.error)
    }
  }

  return (
    <main className="min-h-screen bg-base-100">
      <Header />

      {/* 1. Hero Premium Animé */}
      <HeroSection whatsappNumber={whatsappNumber} />

      {/* 2. Grille de Produits */}
      <section id="produits" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-badge font-medium mb-4"
            >
              {t.products.badge}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3">{t.products.title}</h2>
            <p className="text-base-content/60 max-w-md mx-auto">{t.products.subtitle}</p>
          </motion.div>

          <ProductGrid
            products={products}
            whatsappNumber={whatsappNumber}
            onRate={handleOpenRatingModal}
            onInteraction={handleInteraction}
            canRate={canRateOrComplain}
          />
        </div>
      </section>

      {/* 3. Section Plainte (avec ou sans produit) */}
      <section id="contact" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-badge font-medium mb-4"
            >
              {t.contact.badge}
            </motion.span>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto mb-4">
              <FiMessageCircle className="w-7 h-7 text-secondary" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">{t.contact.title}</h2>
            <p className="text-sm text-base-content/60 mb-6">{t.contact.subtitle}</p>
            
            {canRateOrComplain ? (
              <motion.button
                onClick={() => handleOpenComplaintModal()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary btn-md gap-2 font-heading"
              >
                {t.contact.report}
              </motion.button>
            ) : (
              <div className="p-4 rounded-xl bg-base-200/50 border border-base-200">
                <p className="text-sm text-base-content/50">
                {isSupplier ? t.contact.supplierNote : t.contact.loginNote}
              </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 4. Section Présentation du Groupe Sarena */}
      <TeamSection members={defaultTeamMembers} />

      {/* 5. Footer Premium */}
      <Footer whatsappNumber={whatsappNumber} />

      {/* Modals */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        productId={selectedProductId || ''}
        productName={selectedProductName}
        onSubmit={handleSubmitRating}
      />

      <ComplaintForm
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        productId={selectedProductId}
        productName={selectedProductName}
        onSubmit={(message, productId, adminId) =>
          handleSubmitComplaint(message, productId || selectedProductId, adminId)
        }
      />
    </main>
  )
}
