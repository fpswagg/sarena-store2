'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiPackage, FiMessageSquare, FiFileText, FiX } from 'react-icons/fi'
import { Role } from '@prisma/client'
import clsx from 'clsx'

interface DashboardSidebarProps {
  userRole: Role
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Accueil',
    icon: FiHome,
    roles: ['ADMIN', 'SUPPLIER'],
  },
  {
    href: '/dashboard/products',
    label: 'Produits',
    icon: FiPackage,
    roles: ['ADMIN', 'SUPPLIER'],
  },
  {
    href: '/dashboard/complaints',
    label: 'Plaintes',
    icon: FiMessageSquare,
    roles: ['ADMIN'],
  },
  {
    href: '/dashboard/logs',
    label: 'Logs',
    icon: FiFileText,
    roles: ['ADMIN'],
  },
]

export function DashboardSidebar({ userRole, isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  const SidebarContent = () => (
    <aside className="w-full sm:w-56 lg:w-64 bg-base-200 h-screen flex flex-col sticky top-0">
      <div className="p-4 sm:p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-heading font-bold">Navigation</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm lg:hidden"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2">
        {filteredNavItems.map(item => {
          const Icon = item.icon
          // Improved active state: exact match or starts with the href followed by /
          // Special case: /dashboard should only match exactly, not /dashboard/products
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base',
                isActive
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-300 text-base-content'
              )}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
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

  // Always show sidebar on desktop, drawer on mobile
  return (
    <>
      {/* Desktop: Fixed sidebar - always visible */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile: Drawer - only when onClose is provided */}
      {onClose && (
        <>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={onClose}
              />
              <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
                <SidebarContent />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}


