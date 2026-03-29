import { Product, User, Rating, Complaint, Interaction, ProductStat, Log } from '@prisma/client'

// Extended Product with relations
export type ProductWithRelations = Product & {
  supplier: User
  ratings: Rating[]
  complaints: Complaint[]
  interactions: Interaction[]
  stats: ProductStat | null
}

// Rating level display info
export type RatingLevelInfo = {
  level: string
  emoji: string
  label: string
  color: string
  description: string
}

export const RATING_LEVELS: Record<string, RatingLevelInfo> = {
  CAILLOU: {
    level: 'CAILLOU',
    emoji: '🪨',
    label: 'Caillou',
    color: 'badge-neutral',
    description: 'Nul comme un caillou',
  },
  TORTUE: {
    level: 'TORTUE',
    emoji: '🐢',
    label: 'Tortue',
    color: 'badge-warning',
    description: 'Ça avance doucement',
  },
  COOL: {
    level: 'COOL',
    emoji: '😎',
    label: 'Cool',
    color: 'badge-info',
    description: 'Carrément cool',
  },
  FEU: {
    level: 'FEU',
    emoji: '🔥',
    label: 'Feu',
    color: 'badge-error',
    description: 'Ça envoie du feu',
  },
  LEGENDAIRE: {
    level: 'LEGENDAIRE',
    emoji: '👑',
    label: 'Légendaire',
    color: 'badge-secondary',
    description: 'Légendaire Supreme',
  },
}

// Get average rating level from numeric average
export const getAverageRatingLevel = (avg: number): RatingLevelInfo => {
  if (avg < 1.5) return RATING_LEVELS.CAILLOU
  if (avg < 2.5) return RATING_LEVELS.TORTUE
  if (avg < 3.5) return RATING_LEVELS.COOL
  if (avg < 4.5) return RATING_LEVELS.FEU
  return RATING_LEVELS.LEGENDAIRE
}

// Get translated rating label
export const getTranslatedRatingLabel = (level: string, locale: 'fr' | 'en'): string => {
  const translations: Record<string, { fr: string; en: string }> = {
    CAILLOU: { fr: 'Caillou', en: 'Rock' },
    TORTUE: { fr: 'Tortue', en: 'Turtle' },
    COOL: { fr: 'Cool', en: 'Cool' },
    FEU: { fr: 'Feu', en: 'Fire' },
    LEGENDAIRE: { fr: 'Légendaire', en: 'Legendary' },
  }
  return translations[level]?.[locale] || translations[level]?.fr || level
}

// Get translated rating info with locale
export const getRatingInfo = (level: string, locale: 'fr' | 'en' = 'fr'): RatingLevelInfo => {
  const baseInfo = RATING_LEVELS[level] || RATING_LEVELS.COOL
  return {
    ...baseInfo,
    label: getTranslatedRatingLabel(level, locale),
  }
}

// Convert rating level to numeric value
export const ratingLevelToNumber = (level: string): number => {
  const levels: Record<string, number> = {
    CAILLOU: 1,
    TORTUE: 2,
    COOL: 3,
    FEU: 4,
    LEGENDAIRE: 5,
  }
  return levels[level] ?? 3
}

// Badge types for products
export type ProductBadge = 'new' | 'popular' | 'limited'

export const BADGES: Record<ProductBadge, { label: string; emoji: string; color: string }> = {
  new: {
    label: 'Nouveau',
    emoji: '✨',
    color: 'badge-secondary',
  },
  popular: {
    label: 'Populaire',
    emoji: '🔥',
    color: 'badge-primary',
  },
  limited: {
    label: 'Stock limité',
    emoji: '⚡',
    color: 'badge-warning',
  },
}

// Social media platform type
export type SocialMediaPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'whatsapp'
  | 'email'
  | 'tiktok'
  | 'snapchat'
  | 'link'

export type SocialMediaLink = {
  platform: SocialMediaPlatform
  url: string
}

// Team member type
export type TeamMember = {
  id: string
  name: string
  role?: string
  avatar: string
  description?: string
  socialMedia?: SocialMediaLink[]
}

// Log export format
export type LogExport = Pick<Log, 'id' | 'action' | 'target' | 'targetId' | 'ip' | 'createdAt'> & {
  userName: string | null
  userRole: string
}

// Complaint with relations
export type ComplaintWithRelations = Complaint & {
  user: User | null
  product: Product | null
  assignedAdmin: User
}

// Form states
export type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// WhatsApp message generator
export const generateWhatsAppLink = (
  phone: string,
  productName: string,
  productId: string
): string => {
  const message = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par le produit "${productName}" (Réf: ${productId}). Pouvez-vous me donner plus d'informations ?`
  )
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`
}
