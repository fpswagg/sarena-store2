'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { SSS_URL, whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'
import { SOCIAL_MEDIA_LABELS, SOCIAL_MEDIA_LOGOS } from '@/lib/socialMedia'

export function Footer() {
  const { locale, t } = useI18n()
  const { whatsapp, socials, groups } = useSite()
  const currentYear = new Date().getFullYear()

  // WhatsApp from the business in SSS; other networks only if they are filled in there.
  const socialLinks: { icon: ComponentType<{ className?: string }>; href: string; label: string }[] = [
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
    <footer className="bg-base-200/30 border-t border-base-200">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <Link href="/" className="font-heading font-bold text-lg">
            <span className="text-gradient">Sarena</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm order-3 sm:order-2">
            {nav.map(item => (
              <Link key={item.href} href={item.href} className="text-base-content/60 hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
            <Link href="/dashboard" prefetch={false} className="text-base-content/40 hover:text-primary transition-colors">
              {t.nav.teamSpace}
            </Link>
          </nav>

          <div className="flex gap-2 order-2 sm:order-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors"
                aria-label={label}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* WhatsApp groups and SSS, as small pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {groups.map(group => (
            <a
              key={group.url}
              href={group.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-100 border border-base-200 text-xs font-badge font-medium text-base-content/70 hover:border-primary/30 hover:text-primary transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
              {group.label}
            </a>
          ))}
          <a
            href={SSS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-badge font-medium hover:bg-primary/20 transition-colors"
          >
            Sarena Shooting Star (SSS)
          </a>
        </div>
      </div>

      <div className="border-t border-base-200">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
          <p className="text-[10px] sm:text-xs text-center text-base-content/40 flex items-center justify-center gap-1.5 cursor-default select-none">
            © {currentYear} Sarena • {t.footer.madeWith}{' '}
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
