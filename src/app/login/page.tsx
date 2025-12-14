import { signInWithGoogle } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { LoginForm } from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  // If already logged in, redirect
  const { user } = await getSession()
  if (user) {
    redirect(searchParams.redirect || '/dashboard')
  }

  return <LoginForm />
}


