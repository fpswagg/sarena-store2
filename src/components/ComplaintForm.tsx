'use client'

import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiAlertCircle, FiCheckCircle, FiChevronDown, FiUser } from 'react-icons/fi'
import { modalOverlay, modalContent } from '@/lib/motion'
import { getAllAdmins } from '@/app/actions'
import { useI18n, getTranslated } from '@/lib/i18n/context'
import clsx from 'clsx'

interface Admin {
  id: string
  fullName: string | null
  avatar: string | null
}

interface ComplaintFormProps {
  isOpen: boolean
  onClose: () => void
  productId?: string
  productName?: string | Record<string, string>
  onSubmit: (message: string, productId?: string, adminId?: string) => Promise<void>
}

export function ComplaintForm({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmit,
}: ComplaintFormProps) {
  const { locale, t } = useI18n()
  const [message, setMessage] = useState('')
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedAdminId, setSelectedAdminId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLTextAreaElement>(null)

  // Get translated product name if it's an object
  const translatedProductName =
    typeof productName === 'string'
      ? productName
      : productName
        ? getTranslated(productName as Record<string, string>, locale)
        : ''

  // Fetch admins when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAdmins(true)
      getAllAdmins().then(result => {
        if (result.success) {
          setAdmins(result.admins)
          // Set first admin as default
          if (result.admins.length > 0 && !selectedAdminId) {
            setSelectedAdminId(result.admins[0].id)
          }
        }
        setIsLoadingAdmins(false)
      })
    }
  }, [isOpen, selectedAdminId])

  // Focus trap
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => initialFocusRef.current?.focus(), 100)
    }
  }, [isOpen])

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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMessage('')
      setSubmitStatus('idle')
    }
  }, [isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onSubmit(message, productId, selectedAdminId || undefined)
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
        setMessage('')
        setSubmitStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('Error submitting complaint:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedAdmin = admins.find(a => a.id === selectedAdminId)

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
            onClick={onClose}
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
            aria-labelledby="complaint-modal-title"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-base-200 flex items-center justify-between">
              <div>
                <h2 id="complaint-modal-title" className="text-xl font-heading font-bold">
                  {t.complaint.title}
                </h2>
                {translatedProductName && (
                  <p className="text-sm text-base-content/60 mt-1">
                    {t.complaint.concerning} : {translatedProductName}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label={t.complaint.close}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
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
                    {t.complaint.complaintSent}
                  </h3>
                  <p className="text-base-content/60">
                    {selectedAdmin?.fullName || t.complaint.adminWillProcess.split(' ')[0]}{' '}
                    {t.complaint.adminWillProcess}
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Admin selection */}
                  <div className="mb-5">
                    <label htmlFor="admin-select" className="block text-sm font-semibold mb-2">
                      {t.complaint.chooseAdmin}
                    </label>
                    {isLoadingAdmins ? (
                      <div className="h-12 bg-base-200 rounded-xl animate-pulse" />
                    ) : (
                      <div className="relative">
                        <select
                          id="admin-select"
                          value={selectedAdminId}
                          onChange={e => setSelectedAdminId(e.target.value)}
                          className="select select-bordered w-full pr-10 appearance-none"
                        >
                          {admins.map(admin => (
                            <option key={admin.id} value={admin.id}>
                              {admin.fullName || 'Admin'}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                      </div>
                    )}
                    {selectedAdmin && (
                      <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-base-200/50">
                        {selectedAdmin.avatar ? (
                          <Image
                            src={selectedAdmin.avatar}
                            alt=""
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <FiUser className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        <span className="text-xs text-base-content/70">
                          {t.complaint.willBeSentTo}{' '}
                          <strong>{selectedAdmin.fullName || 'Admin'}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info alert */}
                  <div className="alert alert-info mb-4">
                    <FiAlertCircle className="w-5 h-5" />
                    <span className="text-sm">{t.complaint.adminWillContact}</span>
                  </div>

                  {/* Message textarea */}
                  <div className="mb-6">
                    <label htmlFor="complaint-message" className="block text-sm font-semibold mb-2">
                      {t.complaint.describeProblem}
                    </label>
                    <textarea
                      ref={initialFocusRef}
                      id="complaint-message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={t.complaint.problemPlaceholder}
                      className={clsx(
                        'textarea textarea-bordered w-full h-32 resize-none',
                        submitStatus === 'error' && 'textarea-error'
                      )}
                      maxLength={1000}
                      required
                    />
                    <div className="flex justify-between text-xs text-base-content/50 mt-1">
                      <span>
                        {submitStatus === 'error' && (
                          <span className="text-error">{t.complaint.error}</span>
                        )}
                      </span>
                      <span>{message.length}/1000</span>
                    </div>
                  </div>

                  {/* Note about anonymous submission */}
                  {!productId && (
                    <p className="text-xs text-base-content/50 mb-4">
                      {t.complaint.notLinkedToProduct}
                    </p>
                  )}

                  {/* Submit buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-ghost flex-1"
                      disabled={isSubmitting}
                    >
                      {t.complaint.cancel}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-secondary flex-1"
                      disabled={!message.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        t.complaint.send
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Standalone complaint section for the page
interface ComplaintSectionProps {
  onSubmit: (message: string, adminId?: string) => Promise<void>
}

export function ComplaintSection({ onSubmit }: ComplaintSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section id="plainte" className="section-padding bg-base-200/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-badge font-medium mb-4"
            >
              📝 Besoin d&apos;aide ?
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Un problème ?</h2>
            <p className="text-base-content/70 mb-8 leading-relaxed">
              Notre équipe est là pour vous aider. Signalez-nous tout problème et nous vous
              répondrons rapidement via WhatsApp ou email.
            </p>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary btn-lg gap-2 font-heading shadow-lg shadow-secondary/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiAlertCircle className="w-5 h-5" />
              Signaler un problème
            </motion.button>
          </motion.div>
        </div>
      </section>

      <ComplaintForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(message, _productId, adminId) => onSubmit(message, adminId)}
      />
    </>
  )
}
