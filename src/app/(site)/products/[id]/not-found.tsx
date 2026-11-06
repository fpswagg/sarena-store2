'use client'

import Link from 'next/link'
import { FiHome, FiPackage } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'

export default function ProductNotFound() {
  const { t } = useI18n()
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
        <FiPackage className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">{t.notFound.title}</h1>
      <p className="text-base-content/70 mb-8">{t.notFound.product}</p>
      <Link href="/" className="btn btn-primary gap-2 font-heading">
        <FiHome className="w-5 h-5" />
        {t.notFound.home}
      </Link>
    </div>
  )
}
