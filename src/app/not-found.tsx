'use client'

import Link from 'next/link'
import { FiCompass, FiHome } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
          <FiCompass className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">{t.notFound.title}</h1>
        <p className="text-base-content/70 mb-8">{t.notFound.page}</p>
        <Link href="/" className="btn btn-primary gap-2 font-heading">
          <FiHome className="w-5 h-5" />
          {t.notFound.home}
        </Link>
      </div>
    </main>
  )
}
