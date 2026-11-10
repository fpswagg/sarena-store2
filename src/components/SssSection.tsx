'use client'

import { FiArrowUpRight, FiCheck } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { SSS_URL } from '@/lib/site'
import { SectionHeader } from './SectionHeader'

/** Sarena's own product: Sarena Shooting Star, with links to sss.fpswagg.site. */
export function SssSection() {
  const { t } = useI18n()
  return (
    <section id="sss" className="border-t border-line bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeader badge={t.sss.badge} title={t.sss.title} subtitle={t.sss.subtitle} />
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={SSS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary gap-2">
              {t.sss.cta}
              <FiArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`${SSS_URL}/sign-in`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost border border-line-strong gap-2"
            >
              {t.sss.start}
            </a>
          </div>
        </div>
        <ul className="border border-line bg-base-100">
          {t.sss.points.map((point, i) => (
            <li key={point} className="flex items-start gap-4 px-5 py-4 border-b border-line last:border-b-0">
              <span className="font-mono text-xs text-faint pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1">{point}</span>
              <FiCheck className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
