'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import { SSS_URL, whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'
import { SOCIAL_MEDIA_LABELS, SOCIAL_MEDIA_LOGOS } from '@/lib/socialMedia'

export function Footer() {
  const { locale, t } = useI18n()
  const { whatsapp, socials } = useSite()
  const year = new Date().getFullYear()

  // WhatsApp from the business in SSS; other networks only if they are filled in there.
  const links: { icon: ComponentType<{ className?: string }>; href: string; label: string }[] = [
    ...(whatsapp ? [{ icon: FaWhatsapp, href: whatsappUrl(whatsapp), label: 'WhatsApp' }] : []),
    ...socials.map(social => ({
      icon: SOCIAL_MEDIA_LOGOS[social.platform],
      href: social.url,
      label: social.label || SOCIAL_MEDIA_LABELS[social.platform][locale],
    })),
  ]

  const nav = [
    { href: '/services', label: t.nav.services },
    { href: '/products', label: t.nav.products },
    { href: '/#sss', label: t.nav.sss },
    { href: '/#contact', label: t.nav.contact },
    { href: '/#equipe', label: t.nav.team },
  ]

  return (
    <footer className="border-t border-line bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-heading font-extrabold text-xl">
            Sarena<span className="text-primary">.</span>
          </Link>
          <p className="mt-3 text-sm text-muted max-w-xs">
            {locale === 'fr'
              ? 'Produits, services et SSS, l’outil de gestion pour les commerces.'
              : 'Products, services and SSS, the management tool for businesses.'}
          </p>
          <div className="mt-4 flex gap-2">
            {links.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-9 h-9 border border-line flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-base-content transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <a href={SSS_URL} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-base-content transition-colors">
            Sarena Shooting Star (SSS)
          </a>
          <Link href="/dashboard" prefetch={false} className="text-faint hover:text-base-content transition-colors">
            {t.nav.teamSpace}
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="max-w-6xl mx-auto px-4 py-4 font-mono text-[11px] text-faint">
          © {year} Sarena · {locale === 'fr' ? 'Fait au Cameroun' : 'Made in Cameroon'}
        </p>
      </div>
    </footer>
  )
}
