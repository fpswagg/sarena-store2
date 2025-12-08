'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'
import { TeamMember } from '@/types'
import { useI18n } from '@/lib/i18n/context'
import { modalOverlay, modalContent } from '@/lib/motion'
import { SOCIAL_MEDIA_LOGOS, SOCIAL_MEDIA_LABELS } from '@/lib/socialMedia'

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
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-base-100 rounded-2xl shadow-xl max-w-md w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-member-dialog-title"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-base-200 flex items-center justify-between">
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
                <p className="text-sm text-base-content/60 font-medium">{member.role}</p>
              </div>

              {/* Social Media Links */}
              {hasSocialMedia ? (
                <div>
                  <h3 className="text-sm font-semibold mb-4 text-center">
                    {t.team.socialMedia}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {member.socialMedia!.map((social, index) => {
                      const Icon = SOCIAL_MEDIA_LOGOS[social.platform]
                      const label = SOCIAL_MEDIA_LABELS[social.platform][locale]

                      return (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
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

