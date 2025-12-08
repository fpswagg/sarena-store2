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
      d: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.169 1.775 2.169 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.641.026 11.99.026L12.017 0z',
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

