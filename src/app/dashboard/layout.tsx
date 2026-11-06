import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function DashboardRoot({ children }: { children: ReactNode }) {
  return children
}
