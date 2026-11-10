'use client'

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
    <section id="communaute" className="border-t border-line">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <SectionHeader badge={t.community.badge} title={t.community.title} subtitle={t.community.subtitle} />
        <div className="grid gap-8 lg:grid-cols-2">
          {groups.length > 0 && (
            <div>
              <h3 className="eyebrow text-faint mb-3">{t.community.groups}</h3>
              <ul className="border border-line">
                {groups.map(group => (
                  <li key={group.url} className="border-b border-line last:border-b-0">
                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4 text-primary" />
                      <span className="flex-1">{group.label}</span>
                      <span className="font-mono text-[11px] text-faint group-hover:text-primary">{t.community.join}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {socials.length > 0 && (
            <div>
              <h3 className="eyebrow text-faint mb-3">{t.community.socials}</h3>
              <ul className="border border-line">
                {socials.map(social => {
                  const Icon = SOCIAL_MEDIA_LOGOS[social.platform]
                  return (
                    <li key={social.url} className="border-b border-line last:border-b-0">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="flex-1">{social.label || SOCIAL_MEDIA_LABELS[social.platform][locale]}</span>
                        <FiArrowUpRight className="w-4 h-4 text-faint group-hover:text-primary" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
