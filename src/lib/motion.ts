import type { Variants } from 'framer-motion'

/**
 * Motion follows the SSS style: short (140 ms), ease-out, opacity only.
 * No springs, no bounces, no loops.
 */
const quick = { duration: 0.14, ease: 'easeOut' } as const

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...quick, staggerChildren: 0.03 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: quick },
}

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: quick },
  exit: { opacity: 0, transition: quick },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: quick },
  exit: { opacity: 0, transition: quick },
}

/** Kept for older components: no movement any more. */
export const badgePop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: quick },
}

export const whatsappPulse: Variants = { animate: {} }
