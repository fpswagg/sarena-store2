import { Variants } from 'framer-motion'

// ============================================
// MOTION PRESETS - eco, standard, cartoon+
// ============================================

export type MotionPreset = 'eco' | 'standard' | 'cartoon'

// Get motion scale based on preset
export const getMotionScale = (preset: MotionPreset = 'standard'): number => {
  switch (preset) {
    case 'eco':
      return 0.3
    case 'standard':
      return 1
    case 'cartoon':
      return 1.5
    default:
      return 1
  }
}

// Motion config based on preset
export const getMotionConfig = (preset: MotionPreset = 'standard') => {
  const scale = getMotionScale(preset)
  return {
    stiffness: 200 * scale,
    damping: 20 / scale,
    duration: 0.4 / scale,
  }
}

// ============================================
// STAGGER ANIMATIONS
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
}

// ============================================
// CARD HOVER - LIFT + TILT
// ============================================

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: '0 8px 25px rgba(251,191,36,0.15), 0 12px 30px rgba(0,0,0,0.1)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// Card with tilt effect (requires mouse tracking)
export const cardTilt = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Get tilt values from mouse position
export const getTiltValues = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  maxTilt: number = 10
) => {
  const x = clientX - rect.left
  const y = clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -maxTilt
  const rotateY = ((x - centerX) / centerX) * maxTilt
  return { rotateX, rotateY }
}

// ============================================
// BADGE ANIMATIONS - SQUASH & STRETCH
// ============================================

export const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
  hover: {
    scale: [1, 1.2, 0.9, 1.1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
}

// Full squash & stretch animation
export const squashStretch: Variants = {
  initial: { scaleX: 1, scaleY: 1 },
  animate: {
    scaleX: [1, 1.2, 0.85, 1.1, 1],
    scaleY: [1, 0.8, 1.15, 0.9, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.7, 1],
      ease: 'easeInOut',
    },
  },
}

// Bouncy badge for attention
export const badgeBounce: Variants = {
  animate: {
    y: [0, -6, 0],
    scaleX: [1, 0.95, 1],
    scaleY: [1, 1.05, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
    },
  },
}

// ============================================
// HERO PARALLAX
// ============================================

export const parallaxY = (_offset: number = 0.5) => ({
  y: 0,
})

export const heroParallax: Variants = {
  initial: { y: 0, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

export const floatingElement: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================
// MODAL ANIMATIONS
// ============================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
}

// ============================================
// UTILITY ANIMATIONS
// ============================================

export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
}

export const shake: Variants = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
}

export const pulseGlow: Variants = {
  animate: {
    boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0.4)', '0 0 0 20px rgba(251, 191, 36, 0)'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
}

export const rotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

// ============================================
// REDUCED MOTION HELPERS
// ============================================

export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
    }
  }
  return variants
}

// ============================================
// WHATSAPP BUTTON ANIMATION
// ============================================

export const whatsappPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 rgba(37, 211, 102, 0.4)',
      '0 0 0 10px rgba(37, 211, 102, 0)',
      '0 0 0 0 rgba(37, 211, 102, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
