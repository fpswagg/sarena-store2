'use client'

import Link from 'next/link'
import { FiArrowRight, FiMapPin, FiMessageCircle, FiSmartphone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/translations'
import { whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'

export function HeroSection() {
  const { t } = useI18n()
  const { whatsapp, city } = useSite()

  const facts = [
    { icon: FiSmartphone, text: t.hero.trust1 },
    { icon: FiMessageCircle, text: t.hero.trust2 },
    { icon: FiMapPin, text: fill(t.hero.trust3, { city }) },
  ]

  return (
    <section className="border-b border-line">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-24">
        <span className="eyebrow">{fill(t.hero.badge, { city })}</span>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl font-heading font-extrabold leading-[1.05]">
          {t.hero.title} <span className="text-primary">{t.hero.titleHighlight}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base sm:text-lg text-muted">{fill(t.hero.subtitle, { city })}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="btn btn-primary gap-2">
            {t.hero.cta}
            <FiArrowRight className="w-4 h-4" />
          </Link>
          {whatsapp && (
            <a
              href={whatsappUrl(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-line-strong gap-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              {t.hero.whatsapp}
            </a>
          )}
        </div>

        <ul className="mt-10 grid sm:grid-cols-3 gap-px bg-line border border-line max-w-3xl">
          {facts.map(fact => (
            <li key={fact.text} className="flex items-center gap-3 bg-base-100 px-4 py-3 text-sm text-muted">
              <fact.icon className="w-4 h-4 text-primary flex-shrink-0" />
              {fact.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
