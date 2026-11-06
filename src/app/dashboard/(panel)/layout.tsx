import type { ReactNode } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { SignInScreen } from '@/components/dashboard/SignInScreen'
import { ROLE_LABEL, dashboardAccess } from '@/lib/dashboard/session'
import { listConversations } from '@/lib/dashboard/data'

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const access = await dashboardAccess()
  if (!access.ok) return <SignInScreen access={access} />
  // The red dot on "Service client": people waiting for an answer.
  const waiting = await listConversations(access.storeId)
    .then(rows => rows.filter(row => row.handoff?.status === 'pending').length)
    .catch(() => 0)
  const { user } = access.session
  return (
    <DashboardShell
      user={{
        name: user.name || 'Utilisateur',
        email: user.email ?? null,
        avatar: user.picture ?? null,
        role: ROLE_LABEL[access.role] ?? access.role,
      }}
      waiting={waiting}
    >
      {children}
    </DashboardShell>
  )
}

