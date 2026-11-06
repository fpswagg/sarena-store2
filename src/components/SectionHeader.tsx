'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function SectionHeader({
  badge,
  title,
  subtitle,
  tone = 'primary',
  children,
}: {
  badge: string
  title: string
  subtitle: string
  tone?: 'primary' | 'secondary'
  children?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-10"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`inline-block px-4 py-1.5 rounded-full text-xs font-badge font-medium mb-4 ${
          tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
        }`}
      >
        {badge}
      </motion.span>
      {children}
      <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3">{title}</h2>
      <p className="text-base-content/60 max-w-md mx-auto">{subtitle}</p>
    </motion.div>
  )
}
