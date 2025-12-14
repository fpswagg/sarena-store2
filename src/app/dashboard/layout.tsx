import { ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { DashboardLayoutClient } from './DashboardLayoutClient'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const sessionUser = await requireDashboardAccess()

  // Transform SessionUser to match DashboardLayoutClient expected type
  const user = {
    id: sessionUser.id,
    fullName: sessionUser.name,
    email: sessionUser.email,
    avatar: sessionUser.image,
    role: sessionUser.role,
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}


