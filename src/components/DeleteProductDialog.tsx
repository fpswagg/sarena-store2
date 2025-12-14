'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiAlertTriangle, FiTrash2, FiCheckCircle } from 'react-icons/fi'
import { modalOverlay, modalContent } from '@/lib/motion'

interface ProductRelationships {
  ratingsCount: number
  complaintsCount: number
  interactionsCount: number
  hasStats: boolean
}

interface DeleteProductDialogProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  relationships: ProductRelationships | null
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteProductDialog({
  isOpen,
  onClose,
  productName,
  relationships,
  onConfirm,
  isDeleting = false,
}: DeleteProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSubmitStatus('idle')
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isSubmitting])

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onConfirm()
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
        setSubmitStatus('idle')
      }, 1500)
    } catch (error) {
      console.error('Error deleting product:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const warnings: string[] = []
  if (relationships) {
    if (relationships.ratingsCount > 0) {
      warnings.push(`${relationships.ratingsCount} avis seront supprimés`)
    }
    if (relationships.complaintsCount > 0) {
      warnings.push(`${relationships.complaintsCount} plainte(s) seront dissociées du produit`)
    }
    if (relationships.interactionsCount > 0) {
      warnings.push(`${relationships.interactionsCount} interaction(s) seront supprimées`)
    }
    if (relationships.hasStats) {
      warnings.push('Les statistiques du produit seront supprimées')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 modal-backdrop-blur"
            onClick={!isSubmitting ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-base-100 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-modal-title"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h2 id="delete-product-modal-title" className="text-xl font-heading font-bold">
                    Supprimer le produit
                  </h2>
                  <p className="text-sm text-base-content/60 mt-1">
                    {productName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Fermer"
                disabled={isSubmitting}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <FiCheckCircle className="w-8 h-8 text-success" />
                  </motion.div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    Produit supprimé
                  </h3>
                  <p className="text-base-content/60">
                    Le produit a été supprimé avec succès.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Warning alert */}
                  <div className="alert alert-error mb-6">
                    <FiAlertTriangle className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold">Attention !</h3>
                      <p className="text-sm">Cette action est irréversible.</p>
                    </div>
                  </div>

                  {/* Relationships warnings */}
                  {warnings.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-3 text-base-content/80">
                        Cette action supprimera également :
                      </p>
                      <ul className="space-y-2">
                        {warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-base-content/70">
                            <span className="text-error mt-0.5">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Info message */}
                  <div className="bg-base-200/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-base-content/70">
                      Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-ghost flex-1"
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="btn btn-error flex-1 gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <>
                          <FiTrash2 className="w-4 h-4" />
                          Supprimer
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
