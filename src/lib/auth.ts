import { createSupabaseServer } from './supabase/server'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

export interface SessionUser {
  id: string
  supabaseId: string
  email: string | null
  name: string | null
  image: string | null
  role: Role
}

// Get current user session (server-side)
export async function getSession(): Promise<{ user: SessionUser | null }> {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser()

    if (error || !supabaseUser) {
      return { user: null }
    }

    // Find or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    })

    if (!dbUser) {
      // Create user in database if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          supabaseId: supabaseUser.id,
          email: supabaseUser.email,
          fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
          avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          emailVerified: supabaseUser.email_confirmed_at
            ? new Date(supabaseUser.email_confirmed_at)
            : null,
          role: Role.USER,
        },
      })
    } else {
      // Update user info if changed
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email: supabaseUser.email || dbUser.email,
          fullName:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            dbUser.fullName,
          avatar:
            supabaseUser.user_metadata?.avatar_url ||
            supabaseUser.user_metadata?.picture ||
            dbUser.avatar,
          image:
            supabaseUser.user_metadata?.avatar_url ||
            supabaseUser.user_metadata?.picture ||
            dbUser.image,
          emailVerified: supabaseUser.email_confirmed_at
            ? new Date(supabaseUser.email_confirmed_at)
            : dbUser.emailVerified,
        },
      })
    }

    return {
      user: {
        id: dbUser.id,
        supabaseId: dbUser.supabaseId || supabaseUser.id,
        email: dbUser.email,
        name: dbUser.fullName,
        image: dbUser.avatar || dbUser.image,
        role: dbUser.role,
      },
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return { user: null }
  }
}

// Sign in with Google (redirect)
export async function signInWithGoogle() {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
