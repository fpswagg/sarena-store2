import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Refresh session if expired
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's an error getting user, treat as unauthenticated
    const isAuthenticated = !error && user

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url.toString(), { status: 307 })
      }
    }

    // Redirect authenticated users away from login
    if (request.nextUrl.pathname === '/login' && isAuthenticated) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard'
      // Prevent redirect loops - only redirect to dashboard if it's a valid path
      if (redirectTo.startsWith('/dashboard') || redirectTo === '/') {
        const url = request.nextUrl.clone()
        url.pathname = redirectTo
        url.searchParams.delete('redirect')
        return NextResponse.redirect(url.toString(), { status: 307 })
      }
    }

    return response
  } catch (error) {
    // If there's an error in middleware, allow the request to proceed
    // The layout will handle authentication checks
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}



