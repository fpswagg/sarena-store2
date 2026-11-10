'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { FiCheck, FiDownload } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/translations'
import { purchase, PurchaseError, type Downloads, type PayLink, type PayState } from '@/lib/purchase'
import { formatBytes, whatsappUrl } from '@/lib/site'
import { useSite } from '@/lib/site-context'

/**
 * The buyer's page for one file purchase. Its address (the payment link token) is the proof of
 * purchase: it lets them pay, then download again until the period or the count runs out.
 */
export function PurchasePage({ token }: { token: string }) {
  const { t, locale } = useI18n()
  const { apiUrl, whatsapp } = useSite()
  const [link, setLink] = useState<PayLink | null>(null)
  const [missing, setMissing] = useState(false)
  const [payment, setPayment] = useState<PayState | null>(null)
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<Downloads | null>(null)

  const load = useCallback(async () => {
    try {
      setLink(await purchase.link(apiUrl, token))
    } catch (e) {
      if (e instanceof PurchaseError && e.status === 404) setMissing(true)
    }
  }, [apiUrl, token])

  useEffect(() => {
    void load()
  }, [load])

  // The number typed in the buy dialog, to save typing it again.
  useEffect(() => {
    let saved = ''
    try {
      saved = sessionStorage.getItem(`achat:${token}:phone`) ?? ''
    } catch {
      saved = ''
    }
    if (saved) queueMicrotask(() => setPhone(saved))
  }, [token])

  // While the buyer confirms on their phone: ask SSS every 4 s.
  useEffect(() => {
    if (!payment || payment.status !== 'pending') return
    const timer = setInterval(async () => {
      try {
        const next = await purchase.state(apiUrl, token, payment.paymentId)
        setPayment(next)
        if (next.status === 'successful') void load()
      } catch {
        // Try again on the next tick.
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [apiUrl, token, payment, load])

  const pay = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      setPayment(await purchase.pay(apiUrl, token, phone))
    } catch (e) {
      setError(e instanceof Error ? e.message : t.digital.payFailed)
    } finally {
      setBusy(false)
    }
  }

  const download = async () => {
    setBusy(true)
    setError('')
    try {
      const out = await purchase.downloads(apiUrl, token)
      setFiles(out)
      if (out.files.length === 1) window.location.href = out.files[0].url
    } catch (e) {
      setError(e instanceof PurchaseError && e.status === 403 ? e.message : t.digital.expired)
    } finally {
      setBusy(false)
    }
  }

  const date = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long' }) : ''

  return (
    <section className="max-w-xl mx-auto px-4 py-12 sm:py-20">
      <span className="eyebrow">{t.digital.pageTitle}</span>

      {missing && <p className="mt-4 text-muted">{t.digital.notFound}</p>}
      {!missing && !link && <span className="loading loading-spinner loading-sm mt-6 block" />}

      {link && (
        <div className="mt-3 border border-line bg-base-200">
          <div className="px-5 py-4 border-b border-line">
            <h1 className="font-heading font-bold text-xl sm:text-2xl">{link.title}</h1>
            <p className="mt-1 font-mono text-primary">{link.amountText}</p>
          </div>

          {link.status === 'paid' ? (
            <div className="px-5 py-5 space-y-4">
              <p className="flex items-center gap-2 text-primary">
                <FiCheck className="w-4 h-4" />
                {t.digital.paidTitle}
              </p>
              <button type="button" onClick={download} disabled={busy} className="btn btn-primary w-full gap-2">
                {busy ? <span className="loading loading-spinner loading-xs" /> : <FiDownload className="w-4 h-4" />}
                {t.digital.download}
              </button>
              {files && files.files.length > 0 && (
                <ul className="border border-line bg-base-100">
                  {files.files.map(file => (
                    <li key={file.url} className="border-b border-line last:border-b-0">
                      <a href={file.url} className="flex items-center gap-3 px-4 py-3 hover:bg-base-300 transition-colors">
                        <FiDownload className="w-4 h-4 text-primary" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="font-mono text-xs text-faint">{formatBytes(file.sizeBytes, locale)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {files && (
                <p className="font-mono text-xs text-muted">
                  {fill(t.digital.downloadsLeft, { count: files.downloadsLeft, date: date(files.expiresAt) })}
                </p>
              )}
              <p className="text-xs text-faint">{t.digital.keep}</p>
            </div>
          ) : link.status === 'open' && link.payable ? (
            <form onSubmit={pay} className="px-5 py-5 space-y-4">
              <label className="block">
                <span className="text-sm text-muted">{t.digital.payWith}</span>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  inputMode="tel"
                  placeholder="6XX XX XX XX"
                  className="input w-full mt-1 font-mono"
                  disabled={payment?.status === 'pending'}
                />
                <span className="mt-1 block text-xs text-faint">{t.digital.phoneHint}</span>
              </label>
              {payment?.status === 'pending' ? (
                <p className="flex items-start gap-2 text-sm border border-line-strong bg-base-100 px-4 py-3">
                  <span className="loading loading-spinner loading-xs mt-0.5" />
                  {fill(t.digital.waiting, { ussd: payment.ussdCode || '*126#' })}
                </p>
              ) : (
                <button type="submit" disabled={busy} className="btn btn-primary w-full">
                  {busy && <span className="loading loading-spinner loading-xs" />}
                  {fill(t.digital.pay, { amount: link.amountText })}
                </button>
              )}
              {payment?.status === 'failed' && (
                <p className="text-sm text-error">{payment.reason || t.digital.payFailed}</p>
              )}
            </form>
          ) : (
            <p className="px-5 py-5 text-muted">{t.digital.expired}</p>
          )}

          {error && <p className="px-5 pb-5 text-sm text-error">{error}</p>}
        </div>
      )}

      {whatsapp && (
        <a
          href={whatsappUrl(whatsapp, `${t.digital.pageTitle} : ${typeof window !== 'undefined' ? window.location.href : ''}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
        >
          <FaWhatsapp className="w-4 h-4" />
          WhatsApp
        </a>
      )}
    </section>
  )
}
