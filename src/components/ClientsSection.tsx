'use client'

import { FiArrowUpRight } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import type { ClientSite } from '@/lib/types'
import { SectionHeader } from './SectionHeader'

/** Client websites from the SSS landing gallery (GET /api/v1/gallery?source=landing&kind=sites). */
export function ClientsSection({ clients }: { clients: ClientSite[] }) {
  const { t } = useI18n()
  if (clients.length === 0) return null
  return (
    <section id="clients" className="border-t border-line">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <SectionHeader badge={t.clients.badge} title={t.clients.title} subtitle={t.clients.subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => {
            const body = (
              <>
                <div className="aspect-[16/10] overflow-hidden bg-base-300 border-b border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.url} alt={client.title} loading="lazy" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="font-heading font-semibold truncate">{client.title}</span>
                  {client.link && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-faint group-hover:text-primary transition-colors">
                      {t.clients.visit}
                      <FiArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </>
            )
            return client.link ? (
              <a
                key={client.id}
                href={client.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-line bg-base-200 hover:border-line-strong transition-colors"
              >
                {body}
              </a>
            ) : (
              <div key={client.id} className="border border-line bg-base-200">
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
