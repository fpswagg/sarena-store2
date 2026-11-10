import 'server-only'
import { sssRead } from '../sss-auth'

/** Reads for /dashboard, always with the signed-in person's own token. */

export type DashProduct = {
  id: string
  sku: string
  name: string
  price: number
  cost: number | null
  currency: string
  quantity: number
  description: string | null
  category: string | null
  unlimitedStock: boolean
  active: boolean
  images: { url: string; key?: string | null; alt?: string | null }[]
  variants?: { id: string }[]
  metadata: Record<string, unknown> | null
}

export type DashRecord = {
  id: string
  name: string | null
  data: Record<string, unknown>
  fileKeys?: string[]
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export type DashMember = {
  id: string
  userId?: string | null
  name: string
  email: string | null
  role: string
  status?: 'owner' | 'active' | 'pending'
  metadata?: Record<string, unknown> | null
}

export type Handoff = {
  id: string
  status: 'pending' | 'active' | 'closed' | 'refused' | 'expired'
  origin: 'customer' | 'team' | 'bot'
  reason: string
  requestedAt: string
  acceptedAt: string | null
  acceptedBy: string | null
}

export type Conversation = {
  id: string
  source: 'widget' | 'api' | 'telegram' | 'whatsapp' | 'test'
  visitor: string
  canMessage: boolean
  canHandoff: boolean
  optedOut: boolean
  handoff: Handoff | null
  messages: number
  lastMessage: string
  lastRole: 'user' | 'assistant'
  at: string
}

export type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
  files?: { name: string; mediaType: string; url?: string }[]
  at: string
  team?: boolean
  notice?: boolean
}

export type BotSettings = { enabled: boolean; name: string; widgetEnabled: boolean }

export type StockSummary = {
  totalProducts: number
  activeProducts: number
  outOfStock: number
  lowStock: number
  inventoryValue: number
  unlimitedSkus: number
}

const store = (id: string) => `/api/v1/stores/${id}`

export async function listProducts(storeId: string): Promise<DashProduct[]> {
  const items: DashProduct[] = []
  let cursor: string | null = null
  for (let page = 0; page < 10; page++) {
    const query: string = `limit=200${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
    const data: DashProduct[] | { items: DashProduct[]; nextCursor: string | null } = await sssRead(
      `${store(storeId)}/products?${query}`
    )
    if (Array.isArray(data)) return data
    items.push(...data.items)
    cursor = data.nextCursor
    if (!cursor) break
  }
  return items
}

export const getProduct = (storeId: string, id: string) =>
  sssRead<DashProduct>(`${store(storeId)}/products/${encodeURIComponent(id)}`)

export const stockSummary = (storeId: string) =>
  sssRead<StockSummary>(`${store(storeId)}/stock/summary`)

export async function listRecords(storeId: string, kind: string): Promise<DashRecord[]> {
  const data = await sssRead<DashRecord[] | { items: DashRecord[] }>(
    `${store(storeId)}/sasto/${kind}?limit=200`
  )
  return Array.isArray(data) ? data : data.items
}

export const getRecord = (storeId: string, kind: string, id: string) =>
  sssRead<DashRecord>(`${store(storeId)}/sasto/${kind}/${encodeURIComponent(id)}`)

export const listMembers = (storeId: string) =>
  sssRead<DashMember[]>(`${store(storeId)}/members`)

export const botSettings = (storeId: string) =>
  sssRead<BotSettings>(`${store(storeId)}/client-bot`)

export const listConversations = (storeId: string) =>
  sssRead<Conversation[]>(`${store(storeId)}/client-bot/conversations`)

export const conversationMessages = (storeId: string, id: string) =>
  sssRead<ConversationMessage[]>(
    `${store(storeId)}/client-bot/conversations/${encodeURIComponent(id)}`
  )

export type DashLink = { id: string; label: string; url: string; kind: string }

export async function listLinks(storeId: string): Promise<DashLink[]> {
  return sssRead<DashLink[]>(`${store(storeId)}/links`)
}
