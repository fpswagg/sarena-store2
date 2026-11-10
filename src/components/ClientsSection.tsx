'use client'

import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { ClientSite } from '@/lib/types'
import { SectionHeader } from './SectionHeader'

/** Client websites from the SSS landing gallery (GET /api/v1/gallery?source=landing&kind=sites). */
export function ClientsSection({ clients }: { clients: ClientSite[] }) {
  const { t } = useI18n()
  if (clients.length === 0) return null
  return (
    <section id="clients" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader badge={t.clients.badge} title={t.clients.title} subtitle={t.clients.subtitle} tone="secondary" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {clients.map(client => {
            const body = (
              <>
                <div className="aspect-[16/10] overflow-hidden bg-base-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.url}
                    alt={client.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="font-heading font-semibold truncate group-hover:text-primary transition-colors">
                    {client.title}
                  </span>
                  {client.link && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-badge font-medium">
                      {t.clients.visit}
                      <FiArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </>
            )
            const card =
              'group block h-full rounded-2xl overflow-hidden bg-base-100 border border-base-300 hover:border-primary/30 card-depth hover:card-depth-hover transition-colors'
            return (
              <motion.div key={client.id} variants={fadeUp} whileHover={{ y: -6 }}>
                {client.link ? (
                  <a href={client.link} target="_blank" rel="noopener noreferrer" className={card}>
                    {body}
                  </a>
                ) : (
                  <div className={card}>{body}</div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
