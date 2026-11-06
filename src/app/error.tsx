'use client'

import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { t } = useI18n()
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-error/10 mb-6">
          <FiAlertTriangle className="w-12 h-12 text-error" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">{t.error.title}</h1>
        <p className="text-base-content/70 mb-8">{t.error.message}</p>
        <button type="button" onClick={reset} className="btn btn-primary gap-2 font-heading">
          <FiRefreshCw className="w-5 h-5" />
          {t.error.retry}
        </button>
      </div>
    </main>
  )
}
