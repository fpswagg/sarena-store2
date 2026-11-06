'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEdit2, FiEyeOff, FiSearch, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { deleteProduct } from '@/app/dashboard/actions'
import { formatPrice } from '@/lib/site'
import type { DashProduct } from '@/lib/dashboard/data'
import { ConfirmDialog } from './ConfirmDialog'
import { Empty } from './fields'

function stockLabel(product: DashProduct) {
  if (product.unlimitedStock) return <span className="text-base-content/60">Illimité</span>
  if (product.quantity <= 0) return <span className="badge badge-error badge-sm border-0">Rupture</span>
  return <span className="font-medium">{product.quantity}</span>
}

export function ProductTable({ products }: { products: DashProduct[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState<DashProduct | null>(null)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle
      ? products.filter(p => `${p.name} ${p.sku} ${p.category ?? ''}`.toLowerCase().includes(needle))
      : products
  }, [products, query])

  return (
    <>
      <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-sm mb-4">
        <FiSearch className="w-4 h-4 text-base-content/50" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Chercher un produit"
          aria-label="Chercher un produit"
          className="grow"
        />
      </label>

      {rows.length === 0 ? (
        <Empty>{products.length === 0 ? 'Aucun produit pour le moment.' : 'Aucun résultat.'}</Empty>
      ) : (
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="table w-full text-sm sm:text-base">
            <thead>
              <tr>
                <th className="hidden sm:table-cell">Image</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(product => {
                const onRequest = product.metadata?.priceOnRequest === true || !product.price
                return (
                  <tr key={product.id} className={product.active ? undefined : 'opacity-60'}>
                    <td className="hidden sm:table-cell">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg overflow-hidden bg-base-200">
                        {product.images[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        prefetch={false}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>
                      {!product.active && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-base-content/60">
                          <FiEyeOff className="w-3 h-3" />
                          Masqué
                        </span>
                      )}
                      {product.category && (
                        <p className="text-xs text-base-content/50">{product.category}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {onRequest ? (
                        <span className="text-xs text-base-content/60">Sur demande</span>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td>{stockLabel(product)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          prefetch={false}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Éditer ${product.name}`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setTarget(product)}
                          className="btn btn-ghost btn-sm btn-square text-error"
                          aria-label={`Supprimer ${product.name}`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Supprimer le produit"
        subject={target?.name ?? ''}
        warning="Le produit sera retiré du site et de SSS. Pour le cacher sans le perdre, éditez-le et décochez « Visible sur le site »."
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return
          const result = await deleteProduct(target.id)
          if (result.ok) {
            toast.success('Produit supprimé')
            setTarget(null)
            router.refresh()
          } else {
            toast.error(result.error)
          }
        }}
      />
    </>
  )
}
