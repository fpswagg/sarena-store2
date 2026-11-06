/** What SSS's public showcase returns (only the parts this site uses). Safe in the browser. */

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

export type ProductImage = { url: string; key?: string | null; alt?: string | null }

export type ProductVariant = {
  id: string
  name: string
  price: number | null
  quantity: number
  sku: string | null
  active: boolean
}

type Translation = { name?: string; category?: string; description?: string }

export type ProductMetadata = {
  i18n?: { en?: Translation; [locale: string]: Translation | undefined }
  order?: number
  featured?: boolean
  priceOnRequest?: boolean
  /** Shown with the "new" badge and filter. */
  new?: boolean
  [key: string]: unknown
}

export type Product = {
  id: string
  sku: string
  name: string
  price: number
  currency: string
  description: string | null
  category: string | null
  tags: string[]
  unit: string | null
  images: ProductImage[]
  active: boolean
  unlimitedStock: boolean
  quantity: number
  inStock: boolean
  variants: ProductVariant[]
  metadata: ProductMetadata | null
}

export type Service = {
  id: string
  name: string
  data: {
    area?: string
    price?: number | string
    active?: boolean
    currency?: string
    description?: string
  }
  metadata: {
    i18n?: { en?: { name?: string; description?: string } }
    order?: number
    /** Shown on the home page. */
    featured?: boolean
    [key: string]: unknown
  } | null
}

export type TeamMember = {
  id: string
  name: string
  title: string | null
  bio: string | null
  en: { title?: string; bio?: string } | null
  photo: string | null
  order: number | null
  socials: { platform: SocialMediaPlatform; url: string }[]
}

export type Chatbot = {
  publicKey: string
  name: string
  avatarUrl: string | null
  greeting: string | null
  suggestions: string[]
  accent: string | null
}

/** Business details used across the public site. */
export type SiteInfo = {
  name: string
  logoUrl: string | null
  whatsapp: string
  phone: string
  email: string
  city: string
  country: string
  siteUrl: string
  socials: { platform: SocialMediaPlatform; url: string }[]
  contactFormEnabled: boolean
}

export type Site = {
  info: SiteInfo
  products: Product[]
  services: Service[]
  team: TeamMember[]
  chatbot: Chatbot | null
  seoTitle: string
  seoDescription: string
  ogImageUrl: string | null
  apiUrl: string
}
