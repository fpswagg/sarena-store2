'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu,
  FiX,
  FiUser,
  FiShoppingBag,
  FiUsers,
  FiMessageCircle,
  FiBriefcase,
  FiZap,
} from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const navLinks = [
    { href: '/services', label: t.nav.services, icon: FiBriefcase },
    { href: '/products', label: t.nav.products, icon: FiShoppingBag },
    { href: '/#sss', label: t.nav.sss, icon: FiZap },
    { href: '/#contact', label: t.nav.contact, icon: FiMessageCircle },
    { href: '/#equipe', label: t.nav.team, icon: FiUsers },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'py-2 bg-base-100/95 backdrop-blur-md shadow-sm' : 'py-3 bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Brand name only (no logo) */}
            <Link href="/" className="group" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-heading font-bold text-lg sm:text-xl">
                <span className="text-gradient">Sarena</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Language Toggle */}
              <button
                onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                className="btn btn-ghost btn-sm btn-square"
                title={locale === 'fr' ? 'English' : 'Français'}
              >
                <span className="text-xs font-bold">{locale.toUpperCase()}</span>
              </button>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                className="btn btn-ghost btn-sm btn-square md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-base-100 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-base-200">
                  <span className="font-heading font-bold">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-base-200 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <link.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-base-200">
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    className="flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    {t.nav.teamSpace}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-14 sm:h-16" />
    </>
  )
}
