import { NextResponse } from 'next/server'
import { config } from '@/lib/config'
import { renewSession, safeNext } from '@/lib/sss-auth'

/** See proxy.ts: saves a new token (route handlers can set cookies), then goes back to the page. */
export async function GET(request: Request) {
  const next = safeNext(new URL(request.url).searchParams.get('next'))
  const renewed = await renewSession()
  return NextResponse.redirect(new URL(renewed ? next : '/dashboard?error=session', config.siteUrl))
}
