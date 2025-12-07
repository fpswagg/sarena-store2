'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { getUserBySupabaseId } from '@/app/actions'

export interface AuthUser {
  id: string
  supabaseId: string
  email: string | null
  name: string | null
  image: string | null
  role: Role
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createSupabaseClient()

  const fetchUserData = useCallback(async (supabaseId: string) => {
    try {
      startTransition(async () => {
        const result = await getUserBySupabaseId(supabaseId)
        if (result.success && result.user) {
          setUser(result.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchUserData(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        router.refresh()
      } else if (session?.user) {
        await fetchUserData(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchUserData, router])

  const signIn = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }, [supabase, router])

  return {
    user,
    loading: loading || isPending,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
