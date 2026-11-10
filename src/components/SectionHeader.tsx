import type { ReactNode } from 'react'

/** Section title in the SSS style: small mono label, Syne title, muted line. Left-aligned. */
export function SectionHeader({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: string
  title: string
  subtitle?: string
  tone?: 'primary' | 'secondary'
  children?: ReactNode
}) {
  return (
    <div className="mb-8 sm:mb-10 max-w-2xl">
      <span className="eyebrow">{badge}</span>
      {children}
      <h2 className="mt-2 text-2xl sm:text-4xl font-heading font-bold">{title}</h2>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
    </div>
  )
}
