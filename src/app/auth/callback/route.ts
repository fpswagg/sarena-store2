import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Find or create user in database
      let dbUser = await prisma.user.findUnique({
        where: { supabaseId: data.user.id },
      })

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            supabaseId: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
            avatar: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
            image: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
            emailVerified: data.user.email_confirmed_at
              ? new Date(data.user.email_confirmed_at)
              : null,
            role: Role.USER,
          },
        })
      }
    }
  }

  // Redirect to home page
  return NextResponse.redirect(origin)
}
