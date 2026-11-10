'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { useSite } from '@/lib/site-context'
import { SOCIAL_MEDIA_LABELS, SOCIAL_MEDIA_LOGOS } from '@/lib/socialMedia'
import { SectionHeader } from './SectionHeader'

/**
 * Sarena's networks and WhatsApp group invitations, as filled in SSS (store links).
 * Nothing is made up: with no links in SSS, the section is hidden.
 */
export function CommunitySection() {
  const { t, locale } = useI18n()
  const { socials, groups } = useSite()
  if (socials.length === 0 && groups.length === 0) return null
  return (
    <section id="communaute" className="relative py-16 sm:py-20 bg-base-200/30 overflow-hidden">
      <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4">
        <SectionHeader badge={t.community.badge} title={t.community.title} subtitle={t.community.subtitle} />

        {groups.length > 0 && (
          <div className="mb-10">
            <h3 className="text-center text-sm font-badge font-medium text-base-content/60 mb-4">{t.community.groups}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map(group => (
                <motion.a
                  key={group.url}
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 card-depth hover:card-depth-hover transition-colors"
                >
                  <span className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white">
                    <FaWhatsapp className="w-5 h-5" />
                  </span>
                  <span className="flex-1 font-heading font-semibold">{group.label}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-badge font-medium">
                    {t.community.join}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <h3 className="text-center text-sm font-badge font-medium text-base-content/60 mb-4">{t.community.socials}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {socials.map(social => {
                const Icon = SOCIAL_MEDIA_LOGOS[social.platform]
                return (
                  <motion.a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-base-100 border border-base-300 hover:border-primary/30 card-depth transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {social.label || SOCIAL_MEDIA_LABELS[social.platform][locale]}
                    </span>
                    <FiArrowUpRight className="w-3.5 h-3.5 text-base-content/40 group-hover:text-primary" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
