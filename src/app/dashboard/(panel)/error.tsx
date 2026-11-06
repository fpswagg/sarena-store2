'use client'

import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-5">
        <FiAlertTriangle className="w-10 h-10 text-error" />
      </div>
      <h1 className="text-2xl font-heading font-bold mb-2">Page indisponible</h1>
      <p className="text-sm text-base-content/70 mb-6">
        SSS n&apos;a pas répondu, ou votre rôle ne permet pas d&apos;ouvrir cette page.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn btn-primary gap-2">
          <FiRefreshCw className="w-4 h-4" />
          Réessayer
        </button>
        <form action="/auth/sss/sign-out" method="post">
          <button className="btn btn-ghost">Se reconnecter</button>
        </form>
      </div>
    </div>
  )
}
