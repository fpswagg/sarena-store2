'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'
import { TeamMember } from '@/types'
import { useI18n } from '@/lib/i18n/context'
import { modalOverlay } from '@/lib/motion'
import { SOCIAL_MEDIA_LOGOS, SOCIAL_MEDIA_LABELS } from '@/lib/socialMedia'
import clsx from 'clsx'

interface TeamMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  member: TeamMember | null
}

export function TeamMemberDialog({ isOpen, onClose, member }: TeamMemberDialogProps) {
  const { t, locale } = useI18n()

  if (!member) return null

  const hasSocialMedia = member.socialMedia && member.socialMedia.length > 0

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

          {/* Modal - Bottom sheet on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={clsx(
              'relative bg-base-100 shadow-xl max-w-md w-full',
              'rounded-t-3xl sm:rounded-2xl',
              'max-h-[90vh] overflow-y-auto'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-member-dialog-title"
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-base-300" />
            </div>

            {/* Header */}
            <div className="px-6 pt-4 sm:pt-6 pb-4 border-b border-base-200 flex items-center justify-between">
              <h2 id="team-member-dialog-title" className="text-xl font-heading font-bold">
                {member.name}
              </h2>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label={t.common.close}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Member Info */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                {member.role && (
                  <p className="text-sm text-base-content/60 font-medium">{member.role}</p>
                )}
                {member.description && (
                  <p className="text-sm text-base-content/70 mt-2 max-w-sm mx-auto">
                    {member.description}
                  </p>
                )}
              </div>

              {/* Social Media Links */}
              {hasSocialMedia ? (
                <div>
                  <h3 className="text-sm font-semibold mb-4 text-center">
                    {t.team.socialMedia}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {member.socialMedia!.map((social, index) => {
                      const Icon = SOCIAL_MEDIA_LOGOS[social.platform]
                      const label = SOCIAL_MEDIA_LABELS[social.platform][locale]

                      return (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm font-medium">{label}</span>
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-base-content/60 text-sm">{t.team.noSocialMedia}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

