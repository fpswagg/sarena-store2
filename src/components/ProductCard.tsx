'use client'

import type { MouseEvent as ReactMouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiDownload } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import {
  formatAmount,
  isFeatured,
  isLimited,
  isNew,
  isOutOfStock,
  isPriceOnRequest,
  productDescription,
  productMessage,
  productName,
  whatsappUrl,
} from '@/lib/site'
import { useSite } from '@/lib/site-context'
import type { Product } from '@/lib/types'
import clsx from 'clsx'

function Tag({ children, tone = 'muted' }: { children: string; tone?: 'muted' | 'brand' }) {
  return (
    <span
      className={clsx(
        'px-1.5 py-0.5 border font-mono text-[10px] uppercase tracking-wider bg-base-100',
        tone === 'brand' ? 'border-primary text-primary' : 'border-line-strong text-muted'
      )}
    >
      {children}
    </span>
  )
}

export function ProductCard({ product }: { product: Product; index?: number }) {
  const { locale, t } = useI18n()
  const { whatsapp, siteUrl } = useSite()

  const name = productName(product, locale)
  const description = productDescription(product, locale)
  const digital = Boolean(product.digital)
  const soldOut = !digital && isOutOfStock(product)
  const onRequest = isPriceOnRequest(product)
  const image = product.images[0]?.url

  const order = (e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(whatsappUrl(whatsapp, productMessage(product, siteUrl, locale)), '_blank')
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={clsx(
        'group h-full flex flex-col border border-line bg-base-200 hover:border-line-strong transition-colors',
        soldOut && 'opacity-60'
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-base-300 border-b border-line">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-faint">
            {digital ? <FiDownload className="w-8 h-8" /> : <span className="font-mono text-xs">—</span>}
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {digital && <Tag tone="brand">{t.digital.badge}</Tag>}
          {soldOut && <Tag>{t.products.soldOut}</Tag>}
          {!soldOut && isNew(product) && <Tag tone="brand">{t.products.new}</Tag>}
          {!soldOut && isFeatured(product) && <Tag>{t.products.featured}</Tag>}
          {!soldOut && !digital && isLimited(product) && <Tag>{t.products.limitedStock}</Tag>}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="mt-1 text-xs text-muted line-clamp-2 flex-1">{description}</p>

        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-2">
          {onRequest ? (
            <span className="text-xs text-muted">{t.products.priceOnRequest}</span>
          ) : (
            <span className={clsx('font-mono text-sm whitespace-nowrap', soldOut ? 'line-through text-faint' : 'text-base-content')}>
              {formatAmount(product.price)} <span className="text-faint text-[11px]">FCFA</span>
            </span>
          )}
          {digital ? (
            <span className="btn btn-xs btn-ghost border border-line-strong btn-square" aria-label={t.digital.buy}>
              <FiDownload className="w-3.5 h-3.5" />
            </span>
          ) : (
            !soldOut && (
              <button
                onClick={order}
                className="btn btn-xs btn-ghost border border-line-strong btn-square hover:text-primary hover:border-primary"
                aria-label={t.products.order}
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </Link>
  )
}
