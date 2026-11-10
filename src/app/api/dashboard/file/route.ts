import { NextResponse } from 'next/server'
import { dashboardAccess } from '@/lib/dashboard/session'
import { SssAuthError, sssFetch } from '@/lib/sss-auth'

/**
 * Dashboard: upload a file to sell (private, in SSS storage). The raw body is streamed to
 * POST /api/v1/stores/:id/storage/files, so big files (up to 100 MB) never sit in a server action.
 * Outside /dashboard on purpose: the proxy there would cap the body.
 */
export async function POST(request: Request) {
  const access = await dashboardAccess()
  if (!access.ok) return NextResponse.json({ error: 'Session expirée. Reconnectez-vous.' }, { status: 401 })
  const name = new URL(request.url).searchParams.get('name')?.trim()
  if (!name || !request.body) return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
  try {
    const res = await sssFetch(
      `/api/v1/stores/${access.storeId}/storage/files?name=${encodeURIComponent(name)}&visibility=private`,
      {
        method: 'POST',
        headers: { 'content-type': request.headers.get('content-type') || 'application/octet-stream' },
        body: request.body,
        // Node needs this to send a stream.
        ...({ duplex: 'half' } as object),
      }
    )
    const json = (await res.json().catch(() => null)) as { data?: unknown; error?: { message?: string } } | null
    if (res.status === 403) return NextResponse.json({ error: 'Votre rôle dans SSS ne permet pas cette action.' }, { status: 403 })
    if (!res.ok) return NextResponse.json({ error: json?.error?.message || `SSS a répondu ${res.status}.` }, { status: res.status })
    return NextResponse.json({ data: json?.data })
  } catch (err) {
    if (err instanceof SssAuthError) return NextResponse.json({ error: 'Session expirée. Reconnectez-vous.' }, { status: 401 })
    return NextResponse.json({ error: 'SSS ne répond pas. Réessayez dans un instant.' }, { status: 502 })
  }
}
