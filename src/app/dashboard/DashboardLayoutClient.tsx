'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { DashboardBreadcrumbs } from '@/components/DashboardBreadcrumbs'
import { Role } from '@prisma/client'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: {
    id: string
    fullName: string | null
    email: string | null
    avatar: string | null
    role: Role
  }
}

export function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-base-100">
      <DashboardHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <DashboardSidebar
          userRole={user.role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 w-full p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <DashboardBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  )
}


