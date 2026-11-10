'use client'

import { useState, type ComponentType, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiBriefcase,
  FiChevronRight,
  FiHeadphones,
  FiHome,
  FiLink,
  FiLogOut,
  FiMail,
  FiMenu,
  FiPackage,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { ThemeToggle } from '@/components/ThemeToggle'
import clsx from 'clsx'

type User = { name: string; email: string | null; avatar: string | null; role: string }
type NavItem = { href: string; label: string; icon: ComponentType<{ className?: string }> }

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Accueil', icon: FiHome },
  { href: '/dashboard/products', label: 'Produits', icon: FiPackage },
  { href: '/dashboard/services', label: 'Services', icon: FiBriefcase },
  { href: '/dashboard/team', label: 'Équipe', icon: FiUsers },
  { href: '/dashboard/links', label: 'Liens', icon: FiLink },
  { href: '/dashboard/support', label: 'Service client', icon: FiHeadphones },
  { href: '/dashboard/messages', label: 'Messages', icon: FiMail },
]

const LABELS: Record<string, string> = {
  products: 'Produits',
  services: 'Services',
  team: 'Équipe',
  links: 'Liens',
  support: 'Service client',
  messages: 'Messages',
  new: 'Nouveau',
}

const DETAIL: Record<string, string> = {
  products: 'Éditer',
  services: 'Éditer',
  team: 'Fiche',
  support: 'Conversation',
}

function Breadcrumbs() {
  const segments = usePathname().split('/').filter(Boolean).slice(1)
  if (segments.length === 0) return null
  const items = segments.map((segment, index) => ({
    label: LABELS[segment] ?? DETAIL[segments[index - 1]] ?? 'Détails',
    href:
      index === segments.length - 1
        ? undefined
        : `/dashboard/${segments.slice(0, index + 1).join('/')}`,
  }))
  return (
    <nav
      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4 overflow-x-auto"
      aria-label="Fil d'Ariane"
    >
      <Link
        href="/dashboard"
        prefetch={false}
        aria-label="Accueil"
        className="flex items-center gap-1 text-base-content/60 hover:text-base-content transition-colors flex-shrink-0"
      >
        <FiHome className="w-3 h-3 sm:w-4 sm:h-4" />
      </Link>
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-base-content/40" />
          {item.href ? (
            <Link
              href={item.href}
              prefetch={false}
              className="text-base-content/60 hover:text-base-content transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-base-content font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

function Sidebar({ waiting, onClose }: { waiting: number; onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <aside className="w-64 max-w-[85vw] bg-base-200 h-screen flex flex-col sticky top-0">
      <div className="p-4 sm:p-6 border-b border-base-300 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-heading font-bold">Navigation</h2>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Fermer le menu">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base',
                active ? 'bg-primary text-primary-content' : 'hover:bg-base-300 text-base-content'
              )}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium truncate flex-1">{item.label}</span>
              {item.href === '/dashboard/support' && waiting > 0 && (
                <span className="badge badge-error badge-sm border-0">{waiting}</span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-2 sm:p-4 border-t border-base-300">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-base-300 transition-colors text-base-content text-sm sm:text-base"
        >
          <span className="font-medium truncate">Retour au site</span>
        </Link>
      </div>
    </aside>
  )
}

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(value => !value)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors"
        aria-label="Mon compte"
        aria-expanded={open}
      >
        {user.avatar ? (
          <Image src={user.avatar} alt="" width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-200 z-20">
            <div className="p-4 border-b border-base-200">
              <p className="font-semibold text-sm">{user.name}</p>
              {user.email && (
                <p className="text-xs text-base-content/60 mt-1 break-all">{user.email}</p>
              )}
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary">
                {user.role}
              </span>
            </div>
            <form action="/auth/sss/sign-out" method="post" className="p-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-sm">
                <FiLogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export function DashboardShell({
  user,
  waiting,
  children,
}: {
  user: User
  waiting: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-base-100">
      <header className="sticky top-0 z-40 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="btn btn-ghost btn-sm lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <Link href="/dashboard" prefetch={false} className="truncate">
              <span className="text-xl sm:text-2xl font-heading font-bold gradient-text">
                Dashboard Sarena
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:block">
          <Sidebar waiting={waiting} />
        </div>
        {open && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar waiting={waiting} onClose={() => setOpen(false)} />
            </div>
          </>
        )}
        <main className="flex-1 min-w-0 w-full p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  )
}
