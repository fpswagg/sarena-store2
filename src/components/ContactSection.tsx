'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCpu, FiMail, FiSend, FiX } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { modalOverlay } from '@/lib/motion'
import { askAssistant, whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'

export function ContactSection({ hasAssistant }: { hasAssistant: boolean }) {
  const { t } = useI18n()
  const { whatsapp, contactFormEnabled } = useSite()
  const [open, setOpen] = useState(false)

  return (
    <section id="contact" className="border-t border-line bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="eyebrow"
          >
            {t.contact.badge}
          </motion.span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mt-2 mb-2">{t.contact.title}</h2>
          <p className="text-muted mb-6">{t.contact.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            {hasAssistant && (
              <motion.button
                type="button"
                onClick={() => askAssistant()}
                className="btn btn-ghost border border-line-strong gap-2 w-full sm:w-auto"
              >
                <FiCpu className="w-4 h-4" />
                {t.contact.assistant}
              </motion.button>
            )}
            {whatsapp && (
              <motion.a
                href={whatsappUrl(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary gap-2 w-full sm:w-auto"
              >
                <FaWhatsapp className="w-4 h-4" />
                {t.contact.whatsapp}
              </motion.a>
            )}
            {contactFormEnabled && (
              <motion.button
                type="button"
                onClick={() => setOpen(true)}
                className="btn btn-ghost border border-line-strong gap-2 w-full sm:w-auto"
              >
                <FiMail className="w-4 h-4" />
                {t.contact.form}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      <ContactDialog isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}

function ContactDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const [sending, setSending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    if (!String(fields.phone ?? '').trim() && !String(fields.email ?? '').trim()) {
      toast.error(t.contact.needContact)
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const body = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) {
        toast.error(body?.error || t.contact.failed)
        return
      }
      toast.success(t.contact.sent)
      form.reset()
      onClose()
    } catch {
      toast.error(t.contact.failed)
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center text-left">
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 modal-backdrop-blur"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-base-100 shadow-xl max-w-md w-full rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
          >
            <div className="sm:hidden pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-base-300" />
            </div>
            <div className="px-6 pt-4 sm:pt-6 pb-4 border-b border-base-200 flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-dialog-title" className="text-xl font-heading font-bold">
                  {t.contact.formTitle}
                </h2>
                <p className="text-sm text-base-content/60 mt-1">{t.contact.formSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label={t.common.close}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">{t.contact.name}</span>
                <input name="name" required maxLength={160} className="input input-bordered w-full" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium mb-1.5">{t.contact.phone}</span>
                  <input
                    name="phone"
                    type="tel"
                    maxLength={40}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1.5">{t.contact.email}</span>
                  <input
                    name="email"
                    type="email"
                    maxLength={160}
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">{t.contact.message}</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  maxLength={4000}
                  className="textarea textarea-bordered w-full"
                />
              </label>
              {/* Robots fill this in; people never see it. */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary w-full gap-2 font-heading"
              >
                {sending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
                {t.contact.send}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
