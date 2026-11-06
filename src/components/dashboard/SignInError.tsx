'use client'

import { useSearchParams } from 'next/navigation'
import { FiAlertTriangle } from 'react-icons/fi'

/** ?error=… sent back by /auth/sss/callback or /auth/sss/refresh. */
export function SignInError({ messages }: { messages: Record<string, string> }) {
  const error = useSearchParams().get('error')
  if (!error) return null
  return (
    <div className="alert alert-error mt-4 text-left text-sm" role="alert">
      <FiAlertTriangle className="w-5 h-5 shrink-0" />
      <span>{messages[error] ?? "La connexion n'a pas abouti. Réessayez."}</span>
    </div>
  )
}
