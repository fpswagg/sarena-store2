'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'
import { SOCIAL_MEDIA_LABELS, SOCIAL_MEDIA_LOGOS } from '@/lib/socialMedia'

export function Footer() {
  const { locale, t } = useI18n()
  const { whatsapp, socials } = useSite()
  const currentYear = new Date().getFullYear()
  const siteName = locale === 'fr' ? 'Boutique Sarena' : 'Sarena Store'

  // WhatsApp from the business in SSS; other networks only if they are filled in there.
  const socialLinks: { icon: ComponentType<{ className?: string }>; href: string; label: string }[] =
    [
      ...(whatsapp ? [{ icon: FaWhatsapp, href: whatsappUrl(whatsapp), label: 'WhatsApp' }] : []),
      ...socials.map(social => ({
        icon: SOCIAL_MEDIA_LOGOS[social.platform],
        href: social.url,
        label: SOCIAL_MEDIA_LABELS[social.platform][locale],
      })),
    ]

  return (
    <footer className="bg-base-200/30 border-t border-base-200">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link href="/" className="font-heading font-bold text-lg">
            {siteName}
          </Link>

          {/* Navigation - Centered on mobile */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm order-3 sm:order-2">
            <Link
              href="/services"
              className="text-base-content/60 hover:text-primary transition-colors"
            >
              {t.nav.services}
            </Link>
            <Link
              href="/products"
              className="text-base-content/60 hover:text-primary transition-colors"
            >
              {t.nav.products}
            </Link>
            <Link
              href="/#contact"
              className="text-base-content/60 hover:text-primary transition-colors"
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/#equipe"
              className="text-base-content/60 hover:text-primary transition-colors"
            >
              {t.nav.team}
            </Link>
            <Link
              href="/dashboard"
              prefetch={false}
              className="text-base-content/40 hover:text-primary transition-colors"
            >
              {t.nav.teamSpace}
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex gap-2 order-2 sm:order-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-base-200">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
          <p className="text-[10px] sm:text-xs text-center text-base-content/40 flex items-center justify-center gap-1.5 cursor-default select-none">
            © {currentYear} {siteName} • {t.footer.madeWith}{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <FiHeart className="w-3 h-3 text-secondary fill-secondary" />
            </motion.span>{' '}
            {t.footer.inCameroon}
          </p>
        </div>
      </div>
    </footer>
  )
}
