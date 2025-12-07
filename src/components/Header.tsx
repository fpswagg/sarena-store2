'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiUsers,
  FiMessageCircle,
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n/context'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user: session, loading, signIn, signOut } = useAuth()
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
    { href: '/#produits', label: t.nav.products, icon: FiShoppingBag },
    { href: '/#contact', label: t.nav.contact, icon: FiMessageCircle },
    { href: '/#equipe', label: t.nav.team, icon: FiUsers },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2 bg-base-100/95 backdrop-blur-md shadow-sm' : 'py-3 bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Brand name only (no logo) */}
            <Link href="/" className="group" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-heading font-bold text-lg sm:text-xl">
                {locale === 'fr' ? 'Boutique' : 'Sarena'}
                <span className="text-primary"> {locale === 'fr' ? 'Sarena' : 'Store'}</span>
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

              {/* Auth */}
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-base-200 animate-pulse" />
              ) : session ? (
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary">
                      <Image
                        src={session.image || '/default-avatar.svg'}
                        alt=""
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-50 mt-2 p-2 shadow-lg bg-base-100 rounded-xl w-48 border border-base-200"
                  >
                    <li className="px-3 py-2 border-b border-base-200 mb-1">
                      <p className="font-semibold text-sm truncate">{session.name}</p>
                      <span className="badge badge-xs badge-primary">{session.role}</span>
                    </li>
                    <li>
                      <button
                        onClick={signOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-error/10 text-error transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        {t.nav.logout}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button onClick={signIn} className="btn btn-primary btn-sm gap-1 hidden sm:flex">
                  <FiUser className="w-4 h-4" />
                  {t.nav.login}
                </button>
              )}

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
                  {!session ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        signIn()
                      }}
                      className="w-full btn btn-primary gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      {t.nav.login}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary">
                        <Image
                          src={session.image || '/default-avatar.svg'}
                          alt=""
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{session.name}</p>
                        <span className="badge badge-xs badge-primary">{session.role}</span>
                      </div>
                    </div>
                  )}
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
