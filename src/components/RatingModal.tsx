'use client'

import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiSend } from 'react-icons/fi'
import { RATING_LEVELS, RatingLevelInfo, getRatingInfo } from '@/types'
import { modalOverlay, modalContent } from '@/lib/motion'
import { useI18n, getTranslated } from '@/lib/i18n/context'
import clsx from 'clsx'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string | Record<string, string>
  onSubmit: (productId: string, level: string, comment: string) => Promise<void>
}

// Background colors for each rating level
const ratingColors: Record<string, string> = {
  CAILLOU: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
  TORTUE: 'from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20',
  COOL: 'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
  FEU: 'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
  LEGENDAIRE: 'from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20',
}

export function RatingModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmit,
}: RatingModalProps) {
  const { locale, t } = useI18n()
  const [step, setStep] = useState<'select' | 'comment' | 'success'>('select')
  const [selectedLevel, setSelectedLevel] = useState<RatingLevelInfo | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Get translated product name if it's an object
  const translatedProductName =
    typeof productName === 'string'
      ? productName
      : productName
        ? getTranslated(productName as Record<string, string>, locale)
        : ''

  // Get translated rating options
  const ratingOptions = Object.keys(RATING_LEVELS).map(level => 
    getRatingInfo(level, locale)
  )

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('select')
      setSelectedLevel(null)
      setComment('')
    }
  }, [isOpen])

  // Focus textarea when entering comment step
  useEffect(() => {
    if (step === 'comment' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [step])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleSelectRating = (option: RatingLevelInfo) => {
    setSelectedLevel(option)
    setStep('comment')
  }

  // Get translated rating info for selected level
  const selectedRatingInfo = selectedLevel ? getRatingInfo(selectedLevel.level, locale) : null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedLevel) return

    setIsSubmitting(true)
    try {
      await onSubmit(productId, selectedLevel.level, comment)
      setStep('success')
      setTimeout(() => {
      onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting rating:', error)
      setIsSubmitting(false)
    }
  }

  const handleSkipComment = () => {
    handleSubmit({ preventDefault: () => {} } as FormEvent)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 modal-backdrop-blur"
            onClick={onClose}
          />

          {/* Modal - Full width on mobile, centered on desktop */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={clsx(
              'relative w-full sm:max-w-md bg-gradient-to-b sm:rounded-2xl shadow-xl overflow-hidden',
              selectedLevel
                ? ratingColors[selectedLevel.level]
                : 'from-base-100 to-base-100',
              'rounded-t-3xl sm:rounded-2xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rating-modal-title"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 flex items-start justify-between">
              <div>
                <h2
                  id="rating-modal-title"
                  className="text-lg sm:text-xl font-heading font-bold"
                >
                  {step === 'success' ? t.rating.successTitle : t.rating.title}
                </h2>
                <p className="text-sm text-base-content/60 mt-0.5 line-clamp-1">
                  {translatedProductName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm -mr-2"
                aria-label={t.rating.close}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-4 sm:px-6 pb-6"
                >
                  <p className="text-sm font-medium text-base-content/70 mb-4">
                    {t.rating.howWasProduct}
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {ratingOptions.map((option, index) => (
                    <motion.button
                      key={option.level}
                      type="button"
                        onClick={() => handleSelectRating(option)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl hover:bg-base-200/50 transition-colors"
                      >
                        <span className="text-3xl sm:text-4xl">{option.emoji}</span>
                        <span className="text-[10px] sm:text-xs font-badge text-base-content/70 text-center leading-tight">
                          {option.label}
                        </span>
                    </motion.button>
                  ))}
                </div>
                </motion.div>
              )}

              {step === 'comment' && selectedLevel && (
                <motion.form
                  key="comment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="px-4 sm:px-6 pb-6"
                >
                  {/* Selected rating display */}
                  {selectedRatingInfo && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-base-100/50 mb-4">
                      <span className="text-4xl">{selectedRatingInfo.emoji}</span>
                      <div>
                        <p className="font-badge font-semibold">{selectedRatingInfo.label}</p>
                        <p className="text-xs text-base-content/60">{selectedRatingInfo.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('select')}
                        className="btn btn-ghost btn-xs ml-auto"
                      >
                        {t.rating.change}
                      </button>
              </div>
                  )}

                  {/* Comment textarea */}
                  <div className="mb-4">
                    <label
                      htmlFor="rating-comment"
                      className="block text-sm font-medium text-base-content/70 mb-2"
                    >
                      {t.rating.optionalComment}
                </label>
                <textarea
                      ref={textareaRef}
                  id="rating-comment"
                  value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={t.rating.commentPlaceholder}
                      className="textarea textarea-bordered w-full h-24 resize-none bg-base-100/70"
                  maxLength={500}
                />
                    <div className="text-xs text-base-content/40 text-right mt-1">
                  {comment.length}/500
                </div>
              </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                <button
                  type="button"
                      onClick={handleSkipComment}
                  className="btn btn-ghost flex-1"
                  disabled={isSubmitting}
                >
                      {t.rating.skip}
                </button>
                <button
                  type="submit"
                      className="btn btn-primary flex-1 gap-2"
                      disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          {t.rating.send}
                        </>
                  )}
                </button>
              </div>
                </motion.form>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 sm:px-6 pb-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <FiCheck className="w-8 h-8 text-success" />
                  </motion.div>
                  <p className="text-base-content/70">{t.rating.success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile swipe indicator */}
            <div className="sm:hidden flex justify-center pb-2">
              <div className="w-12 h-1 rounded-full bg-base-content/20" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
