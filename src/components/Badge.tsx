'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { badgePop, squashStretch } from '@/lib/motion'
import clsx from 'clsx'

type BadgeVariant = 'new' | 'popular' | 'limited' | 'rating'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const badgeStyles: Record<BadgeVariant, string> = {
  new: 'badge-nouveau',
  popular: 'badge-populaire',
  limited: 'badge-limited',
  rating: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
}

const sizeStyles = {
  sm: 'badge-sm text-[10px] px-2 py-0.5',
  md: 'badge-md text-xs px-3 py-1',
  lg: 'badge-lg text-sm px-4 py-1.5',
}

export function Badge({ variant, children, className, animate = true, size = 'md' }: BadgeProps) {
  const baseStyles = clsx(
    'badge font-badge font-semibold gap-1.5 border-0 shadow-sm',
    badgeStyles[variant],
    sizeStyles[size],
    className
  )

  if (!animate) {
    return <span className={baseStyles}>{children}</span>
  }

  return (
    <motion.span
      className={baseStyles}
      variants={badgePop}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {children}
    </motion.span>
  )
}

// Specific badge components with cartoon style
export function NewBadge({
  animate = true,
  size = 'md',
}: {
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Badge variant="new" animate={animate} size={size}>
      <span>✨</span> Nouveau
    </Badge>
  )
}

export function PopularBadge({
  animate = true,
  size = 'md',
}: {
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Badge variant="popular" animate={animate} size={size}>
      <span>🔥</span> Populaire
    </Badge>
  )
}

export function LimitedBadge({
  animate = true,
  size = 'md',
}: {
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Badge variant="limited" animate={animate} size={size}>
      <span>⚡</span> Stock limité
    </Badge>
  )
}

// Rating badge with fun cartoon styling
interface RatingBadgeProps {
  level: string
  emoji: string
  label: string
  description?: string
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

const ratingColors: Record<string, string> = {
  CAILLOU: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
  TORTUE: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white',
  COOL: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
  FEU: 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
  LEGENDAIRE: 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white',
}

export function RatingBadge({
  level,
  emoji,
  label,
  description,
  animate = true,
  size = 'md',
  showDescription = false,
}: RatingBadgeProps) {
  const colorClass = ratingColors[level] || 'bg-gray-400'

  const content = (
    <>
      <span className="text-base">{emoji}</span>
      <span className="font-semibold">{label}</span>
      {showDescription && description && (
        <span className="text-[10px] opacity-80 ml-1">({description})</span>
      )}
    </>
  )

  const baseStyles = clsx(
    'badge font-badge gap-1.5 border-0 shadow-md',
    colorClass,
    sizeStyles[size]
  )

  if (!animate) {
    return <span className={baseStyles}>{content}</span>
  }

  return (
    <motion.span
      className={baseStyles}
      variants={badgePop}
      initial="hidden"
      animate="visible"
      whileHover={{
        ...squashStretch.animate,
      }}
    >
      {content}
    </motion.span>
  )
}

// Animated badge group with stagger
interface BadgeGroupProps {
  badges: Array<{ type: 'new' | 'popular' | 'limited' }>
  className?: string
}

export function BadgeGroup({ badges, className }: BadgeGroupProps) {
  return (
    <motion.div
      className={clsx('flex flex-wrap gap-2', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {badges.map(({ type }, index) => {
        switch (type) {
          case 'new':
            return <NewBadge key={index} />
          case 'popular':
            return <PopularBadge key={index} />
          case 'limited':
            return <LimitedBadge key={index} />
          default:
            return null
        }
      })}
    </motion.div>
  )
}
