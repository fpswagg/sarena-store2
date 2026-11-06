import 'server-only'
import { cache } from 'react'
import { config, SSS_TAG } from './config'
import type {
  Chatbot,
  Product,
  Service,
  Site,
  SocialMediaPlatform,
  TeamMember,
} from './types'

/**
 * Everything public on this site comes from SSS's showcase for the business. There is no database
 * here: change a product or a service in SSS (or /dashboard) and it shows up.
 */
export class SssUnavailableError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

type RawLink = { platform?: string; label?: string; url?: string }

type Showcase = {
  store: {
    name: string
    logoUrl: string | null
    phone: string | null
    whatsapp: string | null
    email: string | null
    city: string | null
    country: string | null
    description: string | null
  }
  showcase: {
    seoTitle: string | null
    seoDescription: string | null
    ogImageUrl: string | null
    contactFormEnabled: boolean
  }
  products: Product[]
  services: Service[]
  siteTeam?: TeamMember[]
  links?: RawLink[]
  chatbot: Chatbot | null
}

const PLATFORMS: SocialMediaPlatform[] = [
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'github',
  'youtube',
  'whatsapp',
  'email',
  'tiktok',
  'snapchat',
]

function platformOf(link: RawLink): SocialMediaPlatform {
  const hint = `${link.platform ?? ''} ${link.label ?? ''} ${link.url ?? ''}`.toLowerCase()
  return PLATFORMS.find(name => hint.includes(name)) ?? 'link'
}

function byOrder(a: { order: number; name: string }, b: { order: number; name: string }) {
  return a.order - b.order || a.name.localeCompare(b.name, 'fr')
}

const LAST = Number.MAX_SAFE_INTEGER

function sortByOrder<T extends { name: string }>(items: T[], order: (item: T) => unknown): T[] {
  return items
    .map(item => {
      const value = Number(order(item))
      return { item, name: item.name, order: Number.isFinite(value) && order(item) != null ? value : LAST }
    })
    .sort(byOrder)
    .map(row => row.item)
}

async function fetchShowcase(): Promise<Showcase> {
  const url = `${config.apiUrl}/api/v1/stores/${encodeURIComponent(config.storeSlug)}/showcase`
  let res: Response
  try {
    res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: config.revalidate, tags: [SSS_TAG] },
    })
  } catch {
    throw new SssUnavailableError('SSS does not answer.', 503)
  }
  if (!res.ok) throw new SssUnavailableError(`SSS answered ${res.status}.`, res.status)
  const body = (await res.json()) as { data: Showcase }
  return body.data
}

export const getSite = cache(async (): Promise<Site> => {
  const data = await fetchShowcase()
  const { store, showcase } = data
  const phone = store.phone ?? ''
  return {
    info: {
      name: store.name,
      logoUrl: store.logoUrl,
      whatsapp: (store.whatsapp || phone).replace(/\D/g, ''),
      phone,
      email: store.email ?? '',
      city: store.city ?? '',
      country: store.country ?? '',
      siteUrl: config.siteUrl,
      socials: (data.links ?? [])
        .filter(link => link.url)
        .map(link => ({ platform: platformOf(link), url: link.url as string })),
      contactFormEnabled: showcase.contactFormEnabled !== false,
    },
    products: sortByOrder(
      data.products.filter(product => product.active),
      product => product.metadata?.order
    ),
    services: sortByOrder(
      data.services.filter(service => service.data?.active !== false),
      service => service.metadata?.order
    ),
    team: sortByOrder(data.siteTeam ?? [], member => member.order),
    chatbot: data.chatbot?.publicKey
      ? { ...data.chatbot, publicKey: config.botKey || data.chatbot.publicKey }
      : null,
    seoTitle: showcase.seoTitle || store.name,
    seoDescription: showcase.seoDescription || store.description || '',
    ogImageUrl: showcase.ogImageUrl || store.logoUrl,
    apiUrl: config.apiUrl,
  }
})

export async function sendContact(input: {
  name: string
  message: string
  email?: string
  phone?: string
}): Promise<void> {
  const res = await fetch(
    `${config.apiUrl}/api/v1/stores/${encodeURIComponent(config.storeSlug)}/showcase/contact`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ ...input, createClient: true }),
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new SssUnavailableError(body?.error?.message ?? `SSS answered ${res.status}.`, res.status)
  }
}
