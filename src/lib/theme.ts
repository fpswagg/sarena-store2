import { RatingLevelInfo } from '@/types'

// Theme configuration for each rating level
export type RatingTheme = {
  level: string
  name: string
  bgGradient: string
  bgGradientDark: string
  decorativeBlobs: Array<{ color: string; position: string; size: string }>
  borderColor: string
  textColor: string
  textColorDark: string
  accentColor: string
  accentColorDark: string
  buttonGradient: string
  buttonGradientHover: string
  shadowColor: string
  ringColor: string
  badgeGradient: string
  badgeTextColor: string
  shimmerColor: string
  cardBg: string
  cardBgDark: string
  cardBorder: string
  cardShadow: string
}

export const RATING_THEMES: Record<string, RatingTheme> = {
  CAILLOU: {
    level: 'CAILLOU',
    name: 'Caillou',
    bgGradient:
      'bg-gradient-to-b from-gray-50 via-slate-50 to-base-100 dark:from-gray-900/40 dark:via-slate-900/30 dark:to-base-100',
    bgGradientDark: 'dark:from-gray-900/40 dark:via-slate-900/30 dark:to-base-100',
    decorativeBlobs: [
      { color: 'bg-gray-400/10', position: 'top-20 left-10', size: 'w-32 h-32' },
      { color: 'bg-slate-400/10', position: 'top-40 right-20', size: 'w-40 h-40' },
      { color: 'bg-gray-300/10', position: 'bottom-40 left-1/4', size: 'w-24 h-24' },
    ],
    borderColor: 'border-gray-300/30 dark:border-gray-600/30',
    textColor: 'text-gray-700 dark:text-gray-300',
    textColorDark: 'dark:text-gray-300',
    accentColor: 'text-gray-600 dark:text-gray-400',
    accentColorDark: 'dark:text-gray-400',
    buttonGradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
    buttonGradientHover: 'hover:from-gray-600 hover:to-gray-700',
    shadowColor: 'shadow-gray-400/20',
    ringColor: 'ring-gray-400/20',
    badgeGradient: 'bg-gradient-to-r from-gray-400 to-gray-500',
    badgeTextColor: 'text-white',
    shimmerColor: 'from-gray-400/20 via-gray-300/20 to-transparent',
    cardBg: 'bg-gray-50/50 dark:bg-gray-900/20',
    cardBgDark: 'dark:bg-gray-900/20',
    cardBorder: 'border-gray-300/30 dark:border-gray-700/30',
    cardShadow: 'shadow-gray-400/10',
  },
  TORTUE: {
    level: 'TORTUE',
    name: 'Tortue',
    bgGradient:
      'bg-gradient-to-b from-emerald-50/60 via-teal-50/40 to-base-100 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-base-100',
    bgGradientDark: 'dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-base-100',
    decorativeBlobs: [
      { color: 'bg-emerald-400/15', position: 'top-20 left-10', size: 'w-32 h-32' },
      { color: 'bg-teal-400/15', position: 'top-40 right-20', size: 'w-40 h-40' },
      { color: 'bg-emerald-300/15', position: 'bottom-40 left-1/4', size: 'w-24 h-24' },
    ],
    borderColor: 'border-emerald-300/30 dark:border-emerald-600/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    textColorDark: 'dark:text-emerald-300',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentColorDark: 'dark:text-emerald-400',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    buttonGradientHover: 'hover:from-emerald-600 hover:to-teal-600',
    shadowColor: 'shadow-emerald-400/25',
    ringColor: 'ring-emerald-400/20',
    badgeGradient: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    badgeTextColor: 'text-white',
    shimmerColor: 'from-emerald-400/20 via-teal-300/20 to-transparent',
    cardBg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
    cardBgDark: 'dark:bg-emerald-900/20',
    cardBorder: 'border-emerald-300/30 dark:border-emerald-700/30',
    cardShadow: 'shadow-emerald-400/10',
  },
  COOL: {
    level: 'COOL',
    name: 'Cool',
    bgGradient:
      'bg-gradient-to-b from-blue-50/60 via-cyan-50/40 to-base-100 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-base-100',
    bgGradientDark: 'dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-base-100',
    decorativeBlobs: [
      { color: 'bg-blue-400/15', position: 'top-20 left-10', size: 'w-32 h-32' },
      { color: 'bg-cyan-400/15', position: 'top-40 right-20', size: 'w-40 h-40' },
      { color: 'bg-blue-300/15', position: 'bottom-40 left-1/4', size: 'w-24 h-24' },
    ],
    borderColor: 'border-blue-300/30 dark:border-blue-600/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    textColorDark: 'dark:text-blue-300',
    accentColor: 'text-blue-600 dark:text-blue-400',
    accentColorDark: 'dark:text-blue-400',
    buttonGradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    buttonGradientHover: 'hover:from-blue-600 hover:to-cyan-600',
    shadowColor: 'shadow-blue-400/25',
    ringColor: 'ring-blue-400/20',
    badgeGradient: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    badgeTextColor: 'text-white',
    shimmerColor: 'from-blue-400/20 via-cyan-300/20 to-transparent',
    cardBg: 'bg-blue-50/50 dark:bg-blue-900/20',
    cardBgDark: 'dark:bg-blue-900/20',
    cardBorder: 'border-blue-300/30 dark:border-blue-700/30',
    cardShadow: 'shadow-blue-400/10',
  },
  FEU: {
    level: 'FEU',
    name: 'Feu',
    bgGradient:
      'bg-gradient-to-b from-orange-50/70 via-red-50/50 to-base-100 dark:from-orange-900/30 dark:via-red-900/20 dark:to-base-100',
    bgGradientDark: 'dark:from-orange-900/30 dark:via-red-900/20 dark:to-base-100',
    decorativeBlobs: [
      { color: 'bg-orange-400/20', position: 'top-20 left-10', size: 'w-32 h-32' },
      { color: 'bg-red-400/20', position: 'top-40 right-20', size: 'w-40 h-40' },
      { color: 'bg-orange-300/20', position: 'bottom-40 left-1/4', size: 'w-24 h-24' },
    ],
    borderColor: 'border-orange-400/40 dark:border-orange-600/40',
    textColor: 'text-orange-700 dark:text-orange-300',
    textColorDark: 'dark:text-orange-300',
    accentColor: 'text-orange-600 dark:text-orange-400',
    accentColorDark: 'dark:text-orange-400',
    buttonGradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    buttonGradientHover: 'hover:from-orange-600 hover:to-red-600',
    shadowColor: 'shadow-orange-400/30',
    ringColor: 'ring-orange-400/30',
    badgeGradient: 'bg-gradient-to-r from-orange-400 to-red-400',
    badgeTextColor: 'text-white',
    shimmerColor: 'from-orange-400/30 via-red-300/30 to-transparent',
    cardBg: 'bg-orange-50/60 dark:bg-orange-900/25',
    cardBgDark: 'dark:bg-orange-900/25',
    cardBorder: 'border-orange-400/40 dark:border-orange-700/40',
    cardShadow: 'shadow-orange-400/15',
  },
  LEGENDAIRE: {
    level: 'LEGENDAIRE',
    name: 'Légendaire',
    bgGradient:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/90 via-amber-50/70 to-base-100 dark:from-yellow-900/40 dark:via-amber-900/25 dark:to-base-100',
    bgGradientDark: 'dark:from-yellow-900/40 dark:via-amber-900/25 dark:to-base-100',
    decorativeBlobs: [
      { color: 'bg-yellow-400/25', position: 'top-20 left-10', size: 'w-40 h-40' },
      { color: 'bg-amber-400/25', position: 'top-40 right-20', size: 'w-48 h-48' },
      { color: 'bg-yellow-300/25', position: 'bottom-40 left-1/4', size: 'w-32 h-32' },
      { color: 'bg-amber-300/20', position: 'bottom-20 right-1/3', size: 'w-36 h-36' },
    ],
    borderColor: 'border-yellow-400/50 dark:border-yellow-600/50',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    textColorDark: 'dark:text-yellow-300',
    accentColor: 'text-yellow-600 dark:text-yellow-400',
    accentColorDark: 'dark:text-yellow-400',
    buttonGradient: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500',
    buttonGradientHover: 'hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600',
    shadowColor: 'shadow-yellow-400/40',
    ringColor: 'ring-yellow-400/40',
    badgeGradient: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500',
    badgeTextColor: 'text-black',
    shimmerColor: 'from-yellow-400/40 via-amber-300/40 to-transparent',
    cardBg: 'bg-gradient-to-br from-yellow-50/80 to-amber-50/60 dark:from-yellow-900/30 dark:to-amber-900/20',
    cardBgDark: 'dark:from-yellow-900/30 dark:to-amber-900/20',
    cardBorder: 'border-yellow-400/50 dark:border-yellow-600/50',
    cardShadow: 'shadow-yellow-400/30',
  },
}

// Get theme for a rating level
export function getRatingTheme(level: string): RatingTheme {
  return RATING_THEMES[level] || RATING_THEMES.COOL
}

