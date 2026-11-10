'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiMenu, FiUser, FiX } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'

export function Header() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const links = [
    { href: '/services', label: t.nav.services },
    { href: '/products', label: t.nav.products },
    { href: '/#sss', label: t.nav.sss },
    { href: '/#contact', label: t.nav.contact },
    { href: '/#equipe', label: t.nav.team },
  ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-base-100">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-heading font-extrabold text-xl tracking-tight"
          >
            Sarena<span className="text-primary">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-base-content transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="btn btn-ghost btn-sm font-mono text-xs text-muted"
              title={locale === 'fr' ? 'English' : 'Français'}
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link
              href="/dashboard"
              prefetch={false}
              className="hidden md:inline-flex btn btn-ghost btn-sm btn-square text-muted"
              aria-label={t.nav.teamSpace}
              title={t.nav.teamSpace}
            >
              <FiUser className="w-4 h-4" />
            </Link>
            <button
              className="btn btn-ghost btn-sm btn-square md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden border-t border-line bg-base-100 animate-fade-in">
            <div className="max-w-6xl mx-auto px-4 py-2">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 border-b border-line text-base"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-3 text-sm text-muted"
              >
                <FiUser className="w-4 h-4" />
                {t.nav.teamSpace}
              </Link>
            </div>
          </div>
        )}
      </header>
      <div className="h-14" />
    </>
  )
}
