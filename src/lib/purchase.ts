/**
 * Buying a file, straight from the browser to SSS (public routes, CORS open):
 *  POST /stores/:slug/digital/:productId/checkout → payment link token
 *  GET  /pay/links/:token                         → amount, state
 *  POST /pay/links/:token/pay { phone }           → Mobile Money request
 *  GET  /pay/links/:token/payments/:id            → payment state
 *  GET  /pay/links/:token/downloads               → private links once paid (counts one download)
 */

export type PayLink = {
  token: string
  title: string
  amount: number
  amountText: string
  status: 'open' | 'paid' | 'expired' | 'cancelled'
  payable: boolean
  paidAt: string | null
  hasDownloads?: boolean
  store: { name: string; slug: string }
}

export type PayState = {
  paymentId: string
  ref: string
  status: 'pending' | 'successful' | 'failed' | string
  reason: string | null
  ussdCode?: string | null
}

export type Downloads = {
  status: 'paid' | 'unpaid'
  expiresAt: string | null
  downloadsLeft: number
  files: { name: string; sizeBytes: number | null; url: string; expiresAt: string }[]
}

export class PurchaseError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

async function call<T>(apiUrl: string, path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${apiUrl}/api/v1${path}`, {
    method: init?.method ?? 'GET',
    headers: { accept: 'application/json', ...(init?.body ? { 'content-type': 'application/json' } : {}) },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => null)) as { data?: T; error?: { message?: string } } | null
  if (!res.ok || !json?.data) throw new PurchaseError(json?.error?.message ?? `HTTP ${res.status}`, res.status)
  return json.data
}

export const purchase = {
  checkout: (apiUrl: string, slug: string, productId: string, buyer: { name: string; phone?: string; email?: string }) =>
    call<{ token: string; amount: number; amountText: string }>(
      apiUrl,
      `/stores/${encodeURIComponent(slug)}/digital/${encodeURIComponent(productId)}/checkout`,
      { method: 'POST', body: buyer }
    ),
  link: (apiUrl: string, token: string) => call<PayLink>(apiUrl, `/pay/links/${encodeURIComponent(token)}`),
  pay: (apiUrl: string, token: string, phone: string) =>
    call<PayState>(apiUrl, `/pay/links/${encodeURIComponent(token)}/pay`, { method: 'POST', body: { phone } }),
  state: (apiUrl: string, token: string, paymentId: string) =>
    call<PayState>(apiUrl, `/pay/links/${encodeURIComponent(token)}/payments/${encodeURIComponent(paymentId)}`),
  downloads: (apiUrl: string, token: string) => call<Downloads>(apiUrl, `/pay/links/${encodeURIComponent(token)}/downloads`),
}
