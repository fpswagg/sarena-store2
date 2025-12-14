'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardSidebar } from '@/components/DashboardSidebar'
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

  return (
    <div className="min-h-screen bg-base-100">
      <DashboardHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex">
        <DashboardSidebar
          userRole={user.role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

