'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { SSS_TAG } from '@/lib/config'
import { dashboardAccess } from '@/lib/dashboard/session'
import { SssAuthError, sssFetch } from '@/lib/sss-auth'

export type Result<T = unknown> = { ok: true; data: T } | { ok: false; error: string }

const EXPIRED = 'Session expirée. Reconnectez-vous.'

async function call<T = unknown>(method: string, path: string, body?: unknown): Promise<Result<T>> {
  const access = await dashboardAccess()
  if (!access.ok) return { ok: false, error: EXPIRED }
  try {
    const res = await sssFetch(`/api/v1/stores/${access.storeId}${path}`, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await res.json().catch(() => null)
    if (res.status === 403) return { ok: false, error: 'Votre rôle dans SSS ne permet pas cette action.' }
    if (!res.ok) return { ok: false, error: json?.error?.message || `SSS a répondu ${res.status}.` }
    return { ok: true, data: json?.data as T }
  } catch (err) {
    if (err instanceof SssAuthError) return { ok: false, error: EXPIRED }
    return { ok: false, error: 'SSS ne répond pas. Réessayez dans un instant.' }
  }
}

/** The public site is cached: refresh it after every change that shows there. */
function refresh() {
  revalidateTag(SSS_TAG, 'max')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'layout')
}

function done<T>(result: Result<T>): Result<T> {
  if (result.ok) refresh()
  return result
}

const id = (value: string) => encodeURIComponent(value)

/* Products */

export async function createProduct(body: Record<string, unknown>) {
  return done(await call<{ id: string }>('POST', '/products', body))
}

export async function updateProduct(productId: string, body: Record<string, unknown>) {
  return done(await call('PATCH', `/products/${id(productId)}`, body))
}

export async function deleteProduct(productId: string) {
  return done(await call('DELETE', `/products/${id(productId)}`))
}

export async function uploadPhoto(form: FormData): Promise<Result<{ url: string }>> {
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Aucune image reçue.' }
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    return { ok: false, error: 'Formats acceptés : JPEG, PNG, WebP, GIF.' }
  }
  if (file.size > 6 * 1024 * 1024) return { ok: false, error: 'Image trop lourde (6 Mo au plus).' }
  const dataBase64 = Buffer.from(await file.arrayBuffer()).toString('base64')
  const result = await call<{ url: string }>('POST', '/files', {
    name: file.name,
    mediaType: file.type,
    dataBase64,
  })
  if (!result.ok) return result
  if (!result.data?.url) return { ok: false, error: "SSS n'a pas renvoyé d'adresse pour l'image." }
  return { ok: true, data: { url: result.data.url } }
}

/* Services, messages (SSS records) */

export async function createService(body: Record<string, unknown>) {
  return done(await call<{ id: string }>('POST', '/sasto/service', body))
}

export async function updateService(recordId: string, body: Record<string, unknown>) {
  return done(await call('PATCH', `/sasto/service/${id(recordId)}`, body))
}

export async function deleteService(recordId: string) {
  return done(await call('DELETE', `/sasto/service/${id(recordId)}`))
}

export async function setMessageStatus(
  recordId: string,
  data: Record<string, unknown>,
  status: string
) {
  return done(
    await call('PATCH', `/sasto/feedback/${id(recordId)}`, { data: { ...data, status } })
  )
}

export async function deleteMessage(recordId: string) {
  return done(await call('DELETE', `/sasto/feedback/${id(recordId)}`))
}

/* Team */

export async function updateMemberMetadata(memberId: string, metadata: Record<string, unknown>) {
  return done(await call('PATCH', `/members/${id(memberId)}`, { metadata }))
}

/* Customer service: never calls the bot, so no credits are spent here. */

export async function setHandoff(sessionId: string, action: 'take' | 'refuse' | 'release') {
  const result = await call('POST', `/client-bot/conversations/${id(sessionId)}/handoff`, { action })
  if (result.ok) revalidatePath('/dashboard', 'layout')
  return result
}

export async function replyToCustomer(sessionId: string, text: string) {
  const result = await call<{ sent: boolean; queued?: boolean; reason?: string }>(
    'POST',
    `/client-bot/conversations/${id(sessionId)}/messages`,
    { text }
  )
  if (result.ok) revalidatePath('/dashboard', 'layout')
  return result
}

/* Links: social networks and WhatsApp group invitations shown on the site */

export async function createLink(body: { kind: string; label?: string; url: string }) {
  return done(await call<{ id: string }>('POST', '/links', body))
}

export async function deleteLink(linkId: string) {
  return done(await call('DELETE', `/links/${id(linkId)}`))
}
