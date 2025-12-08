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

// Snapchat icon component (using SVG since react-icons doesn't have Snapchat)
// Snapchat ghost logo - simplified ghost shape
const SnapchatIcon: ComponentType<{ className?: string }> = ({ className }) => {
  return React.createElement(
    'svg',
    {
      className,
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    React.createElement('path', {
      d: 'M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V22h4v-.2c4.56-.93 8-4.96 8-9.8 0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-3 3c1.5 0 2.5-.5 2.5-1.5h-5c0 1 1 1.5 2.5 1.5z',
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
  snapchat: SnapchatIcon,
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
  snapchat: { fr: 'Snapchat', en: 'Snapchat' },
}

