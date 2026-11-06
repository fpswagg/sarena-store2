'use client'

import type { ReactNode } from 'react'
import clsx from 'clsx'

/** Same labelled fields as the old dashboard forms. */
export function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string
  hint?: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <label className={clsx('block', wide && 'md:col-span-2')}>
      <span className="label">
        <span className="label-text">{label}</span>
      </span>
      {children}
      {hint && <span className="block mt-1 text-xs text-base-content/50">{hint}</span>}
    </label>
  )
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        className="toggle toggle-primary mt-0.5 shrink-0"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-base-content/50">{hint}</span>}
      </span>
    </label>
  )
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="premium-card rounded-xl p-4 sm:p-6">
      <h2 className="font-heading font-semibold mb-3">{title}</h2>
      {children}
    </section>
  )
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold">{children}</h1>
      {action}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="premium-card rounded-xl p-8 text-center text-sm text-base-content/60">
      {children}
    </div>
  )
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Douala',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
