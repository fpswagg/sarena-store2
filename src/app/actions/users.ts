'use server'

import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'
import { Role } from '@prisma/client'

export interface UserData {
  id: string
  supabaseId: string
  email: string | null
  name: string | null
  image: string | null
  role: Role
}

// Get or create user by Supabase ID
export async function getUserBySupabaseId(
  supabaseId?: string
): Promise<{ success: boolean; user: UserData | null; error?: string }> {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !supabaseUser) {
      return { success: false, user: null, error: 'Unauthorized' }
    }

    const targetSupabaseId = supabaseId || supabaseUser.id

    // Find user in database
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: targetSupabaseId },
    })

    if (!dbUser) {
      // Create user if doesn't exist
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
    }

    return {
      success: true,
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
    console.error('Error fetching user:', error)
    return { success: false, user: null, error: 'Failed to fetch user' }
  }
}
