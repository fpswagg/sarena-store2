import type { ComponentType } from 'react'
import { SocialMediaPlatform } from '@/types'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub, FiYoutube, FiPhone, FiMail } from 'react-icons/fi'

// Social media logos/icons mapping
export const SOCIAL_MEDIA_LOGOS: Record<SocialMediaPlatform, ComponentType<{ className?: string }>> = {
  facebook: FiFacebook,
  twitter: FiTwitter,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  github: FiGithub,
  youtube: FiYoutube,
  whatsapp: FiPhone,
  email: FiMail,
}

// Social media platform labels
export const SOCIAL_MEDIA_LABELS: Record<SocialMediaPlatform, { fr: string; en: string }> = {
  facebook: { fr: 'Facebook', en: 'Facebook' },
  twitter: { fr: 'Twitter', en: 'Twitter' },
  instagram: { fr: 'Instagram', en: 'Instagram' },
  linkedin: { fr: 'LinkedIn', en: 'LinkedIn' },
  github: { fr: 'GitHub', en: 'GitHub' },
  youtube: { fr: 'YouTube', en: 'YouTube' },
  whatsapp: { fr: 'WhatsApp', en: 'WhatsApp' },
  email: { fr: 'Email', en: 'Email' },
}

