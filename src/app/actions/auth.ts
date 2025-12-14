'use server'

import { signInWithGoogle } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function handleSignInWithGoogle() {
  try {
    const { url } = await signInWithGoogle()
    if (url) {
      redirect(url)
    }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

