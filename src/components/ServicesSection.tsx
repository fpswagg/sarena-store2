'use client'

import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
  FiBriefcase,
  FiCode,
  FiCpu,
  FiGlobe,
  FiImage,
  FiLayout,
  FiMessageCircle,
  FiRadio,
  FiServer,
  FiShare2,
  FiStar,
  FiTool,
} from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/translations'
import { fadeUp, staggerContainer } from '@/lib/motion'
import {
  askAssistant,
  serviceDescription,
  serviceMessage,
  serviceName,
  servicePrice,
  whatsappUrl,
} from '@/lib/site'
import { useSite } from '@/lib/site-context'
import type { Service } from '@/lib/types'
import { SectionHeader } from './SectionHeader'

/** An icon that fits the service's name, in any language. */
const ICONS: [RegExp, ComponentType<{ className?: string }>][] = [
  [/shooting star|sss/i, FiStar],
  [/business tool|sbt|hébergement|hosting/i, FiServer],
  [/espace de gestion|dashboard|management/i, FiLayout],
  [/site/i, FiGlobe],
  [/applic|\bapp\b/i, FiCode],
  [/bot/i, FiCpu],
  [/automat|intégrat|integrat/i, FiShare2],
  [/flyer|visuel|visual|graphi/i, FiImage],
  [/visibilit/i, FiRadio],
  [/maintenance|suivi/i, FiTool],
  [/accompagn|coaching|support|business/i, FiBriefcase],
]

function iconOf(name: string) {
  return ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? FiBriefcase
}

export function ServicesSection({
  services,
  hasAssistant,
}: {
  services: Service[]
  hasAssistant: boolean
}) {
  const { t, locale } = useI18n()
  const { whatsapp } = useSite()

  if (services.length === 0) return null

  return (
    <section id="services" className="py-16 sm:py-20 bg-base-200/30">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          badge={t.services.badge}
          title={t.services.title}
          subtitle={t.services.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map(service => {
            const name = serviceName(service, locale)
            const price = servicePrice(service, locale)
            const Icon = iconOf(service.name)
            return (
              <motion.article
                key={service.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group flex flex-col p-5 rounded-2xl bg-base-100 border border-base-200 hover:border-primary/30 card-depth hover:card-depth-hover transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold leading-snug pt-0.5 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                </div>
                <p className="text-sm text-base-content/60 leading-relaxed flex-1">
                  {serviceDescription(service, locale)}
                </p>
                {price && (
                  <p className="mt-3 self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold">
                    {price}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-base-200">
                  <a
                    href={whatsappUrl(whatsapp, serviceMessage(service, locale))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-whatsapp gap-1.5 font-heading"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    {t.services.talk}
                  </a>
                  {hasAssistant && (
                    <button
                      type="button"
                      onClick={() => askAssistant(fill(t.services.question, { name }))}
                      className="btn btn-sm btn-ghost gap-1.5 text-base-content/70"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      {t.services.ask}
                    </button>
                  )}
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
