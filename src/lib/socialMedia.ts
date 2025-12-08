'use client'

import React, { type ComponentType } from 'react'
import { SocialMediaPlatform } from '@/types'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub, FiYoutube, FiPhone, FiMail } from 'react-icons/fi'

// TikTok icon component (using SVG since react-icons doesn't have TikTok)
const TikTokIcon: ComponentType<{ className?: string }> = ({ className }) => {
  return React.createElement(
    'svg',
    {
      className,
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    React.createElement('path', {
      d: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
    })
  )
}

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
  tiktok: TikTokIcon,
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
  tiktok: { fr: 'TikTok', en: 'TikTok' },
}

