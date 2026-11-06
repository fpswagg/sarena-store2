'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi'
import { modalContent, modalOverlay } from '@/lib/motion'

/** The old site's delete dialog, for anything that can't be undone. */
export function ConfirmDialog({
  open,
  title,
  subject,
  warning = 'Cette action est irréversible.',
  confirmLabel = 'Supprimer',
  onClose,
  onConfirm,
}: {
  open: boolean
  title: string
  subject: string
  warning?: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, busy, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 modal-backdrop-blur"
            onClick={busy ? undefined : onClose}
          />
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative bg-base-100 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 pb-4 border-b border-base-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                  <FiTrash2 className="w-5 h-5 text-error" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-heading font-bold">{title}</h2>
                  <p className="text-sm text-base-content/60 mt-1 truncate">{subject}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={busy}
                className="btn btn-circle btn-ghost btn-sm shrink-0"
                aria-label="Fermer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="alert alert-error mb-6">
                <FiAlertTriangle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Attention !</h3>
                  <p className="text-sm">{warning}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={onClose} disabled={busy} className="btn btn-ghost">
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    setBusy(true)
                    try {
                      await onConfirm()
                    } finally {
                      setBusy(false)
                    }
                  }}
                  disabled={busy}
                  className="btn btn-error gap-2"
                >
                  {busy ? <span className="loading loading-spinner loading-sm" /> : <FiTrash2 className="w-4 h-4" />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
