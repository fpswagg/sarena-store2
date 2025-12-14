'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronRight, FiHome } from 'react-icons/fi'

interface BreadcrumbItem {
  label: string
  href?: string
}

const routeLabels: Record<string, string> = {
  dashboard: 'Tableau de bord',
  products: 'Produits',
  complaints: 'Plaintes',
  logs: 'Logs',
  new: 'Nouveau produit',
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()

  // Parse pathname into breadcrumb items
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with dashboard home
    if (segments.length === 0 || segments[0] !== 'dashboard') {
      return []
    }

    breadcrumbs.push({ label: 'Tableau de bord', href: '/dashboard' })

    // Build breadcrumbs from segments
    let currentPath = '/dashboard'
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      currentPath += `/${segment}`

      // Handle dynamic route segments (IDs) - check previous segment for context
      if (segment.match(/^[a-f0-9-]{36}$/i)) {
        // If previous segment is 'products', it's an edit page
        const prevSegment = segments[i - 1]
        const label = prevSegment === 'products' ? 'Éditer' : 'Détails'
        breadcrumbs.push({ label })
      } else {
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        breadcrumbs.push({
          label,
          href: i === segments.length - 1 ? undefined : currentPath,
        })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4 overflow-x-auto" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-base-content/60 hover:text-base-content transition-colors flex-shrink-0"
      >
        <FiHome className="w-3 h-3 sm:w-4 sm:h-4" />
      </Link>
      {breadcrumbs.slice(1).map((item, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-base-content/40" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-base-content/60 hover:text-base-content transition-colors truncate max-w-[120px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-base-content font-medium truncate max-w-[120px] sm:max-w-none">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
