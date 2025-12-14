import { ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { DashboardLayoutClient } from './DashboardLayoutClient'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireDashboardAccess()

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}

