import { NextResponse, type NextRequest } from 'next/server'

/**
 * Dashboard pages read SSS with the person's token, but a Server Component cannot save a new one.
 * So when the token is about to run out, the visit passes through /auth/sss/refresh first.
 */
const EARLY_REFRESH_MS = 60_000

export function proxy(request: NextRequest) {
  const { method, nextUrl, cookies, headers } = request
  if (method !== 'GET' && method !== 'HEAD') return NextResponse.next()
  if (headers.has('next-action') || headers.has('next-router-prefetch')) return NextResponse.next()
  // /dashboard?error=… is where a failed refresh lands: never send it back (no loop).
  if (nextUrl.searchParams.has('error')) return NextResponse.next()
  if (!cookies.has('sss_session')) return NextResponse.next()
  const expiresAt = Number(cookies.get('sss_exp')?.value)
  if (expiresAt && expiresAt - EARLY_REFRESH_MS > Date.now()) return NextResponse.next()
  const target = nextUrl.clone()
  target.pathname = '/auth/sss/refresh'
  target.search = `?next=${encodeURIComponent(nextUrl.pathname + nextUrl.search)}`
  return NextResponse.redirect(target)
}

export const config = { matcher: ['/dashboard', '/dashboard/:path*'] }
