'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'

interface FooterProps {
  whatsappNumber: string
}

export function Footer({ whatsappNumber }: FooterProps) {
  const { locale, t } = useI18n()
  const currentYear = new Date().getFullYear()
  const siteName = locale === 'fr' ? 'Boutique Sarena' : 'Sarena Store'

  // Social links from env or defaults
  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
      label: 'WhatsApp',
    },
    {
      icon: FaInstagram,
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#',
      label: 'Instagram',
    },
    {
      icon: FaFacebook,
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#',
      label: 'Facebook',
    },
    {
      icon: FaTiktok,
      href: process.env.NEXT_PUBLIC_TIKTOK_URL || '#',
      label: 'TikTok',
    },
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
          <nav className="flex items-center gap-4 sm:gap-6 text-sm order-3 sm:order-2">
            <Link
              href="/#produits"
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
