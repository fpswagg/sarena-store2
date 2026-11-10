'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiDownload, FiX } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/translations'
import { purchase, PurchaseError } from '@/lib/purchase'
import { formatAmount, formatBytes } from '@/lib/site'
import { useSite } from '@/lib/site-context'
import type { Product } from '@/lib/types'

/** "Buy and download": name + number, then the payment page /achat/[token]. */
export function BuyFileButton({ product, name }: { product: Product; name: string }) {
  const { t, locale } = useI18n()
  const { apiUrl, storeSlug } = useSite()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const file = product.digital
  if (!file) return null

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const text = (key: string) => String(form.get(key) ?? '').trim()
    setBusy(true)
    try {
      const out = await purchase.checkout(apiUrl, storeSlug, product.id, {
        name: text('name'),
        ...(text('phone') ? { phone: text('phone') } : {}),
        ...(text('email') ? { email: text('email') } : {}),
      })
      try {
        sessionStorage.setItem(`achat:${out.token}:phone`, text('phone'))
      } catch {
        // Private browsing: the buyer types the number again.
      }
      router.push(`/achat/${out.token}`)
    } catch (error) {
      toast.error(error instanceof PurchaseError && error.status < 500 ? error.message : t.digital.failed)
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary w-full gap-2">
        <FiDownload className="w-4 h-4" />
        {t.digital.buy}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 modal-backdrop-blur" onClick={() => !busy && setOpen(false)} />
          <form
            onSubmit={submit}
            className="relative w-full sm:max-w-md bg-base-200 border border-line-strong animate-fade-in"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="font-heading font-bold text-lg">{t.digital.title}</h2>
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm btn-square" aria-label={t.common.close}>
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="border border-line bg-base-100 px-4 py-3">
                <p className="font-medium">{name}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {file.name}
                  {file.sizeBytes ? ` · ${formatBytes(file.sizeBytes, locale)}` : ''} · {formatAmount(product.price)} FCFA
                </p>
              </div>
              <label className="block">
                <span className="text-sm text-muted">{t.digital.name}</span>
                <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="input w-full mt-1" />
              </label>
              <label className="block">
                <span className="text-sm text-muted">{t.digital.phone}</span>
                <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="6XX XX XX XX" className="input w-full mt-1 font-mono" />
              </label>
              <label className="block">
                <span className="text-sm text-muted">{t.digital.email}</span>
                <input name="email" type="email" autoComplete="email" maxLength={160} className="input w-full mt-1" />
              </label>
              <p className="text-xs text-faint">{fill(t.digital.hint, { days: file.downloadDays })}</p>
            </div>
            <div className="px-5 py-4 border-t border-line">
              <button type="submit" disabled={busy} className="btn btn-primary w-full">
                {busy && <span className="loading loading-spinner loading-xs" />}
                {t.digital.continue}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
