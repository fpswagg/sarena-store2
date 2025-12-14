'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi'
import { ProductWithRelations } from '@/types'
import { getTranslated } from '@/lib/i18n/context'
import { Locale } from '@/lib/i18n/translations'
import { deleteProduct, markProductUnavailable } from '@/app/actions/products'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProductTableProps {
  products: ProductWithRelations[]
  userRole: string
  currentUserId: string
  locale?: Locale
}

export function ProductTable({
  products,
  userRole,
  currentUserId,
  locale = 'fr' as Locale,
}: ProductTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    setDeletingId(id)
    const result = await deleteProduct(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Produit supprimé')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const handleMarkUnavailable = async (id: string) => {
    const result = await markProductUnavailable(id)
    if (result.success) {
      toast.success('Produit marqué comme indisponible')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const canEdit = (product: ProductWithRelations) => {
    return userRole === 'ADMIN' || product.supplierId === currentUserId
  }

  const canDelete = (product: ProductWithRelations) => {
    return userRole === 'ADMIN'
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <table className="table w-full text-sm sm:text-base">
        <thead>
          <tr>
            <th className="hidden sm:table-cell">Image</th>
            <th>Nom</th>
            <th className="hidden md:table-cell">Ville</th>
            <th>Prix</th>
            <th>Stock</th>
            <th className="hidden sm:table-cell">Note</th>
            {userRole === 'ADMIN' && <th className="hidden lg:table-cell">Fournisseur</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const name = getTranslated(product.name as Record<string, string>, locale)
            const ratingAvg = product.stats?.ratingAvg || 0
            const ratingCount = product.ratings.length

            return (
              <tr key={product.id}>
                <td className="hidden sm:table-cell">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={product.thumbnail}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-sm sm:text-base">{name}</div>
                  {product.isNew && (
                    <span className="badge badge-secondary badge-sm mt-1">Nouveau</span>
                  )}
                  <div className="sm:hidden text-xs text-base-content/60 mt-1">
                    {product.city} • {product.price.toLocaleString()} FCFA
                  </div>
                </td>
                <td className="hidden md:table-cell">{product.city}</td>
                <td className="whitespace-nowrap">{product.price.toLocaleString()} FCFA</td>
                <td>
                  <span className={product.stock > 0 ? 'text-success' : 'text-error'}>
                    {product.stock}
                  </span>
                </td>
                <td className="hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <span className="text-warning">★</span>
                    <span>{ratingAvg.toFixed(1)}</span>
                    <span className="text-xs text-base-content/60">({ratingCount})</span>
                  </div>
                </td>
                {userRole === 'ADMIN' && (
                  <td className="hidden lg:table-cell text-sm">
                    {product.supplier.fullName || product.supplier.email}
                  </td>
                )}
                <td>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {canEdit(product) && (
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="btn btn-ghost btn-xs sm:btn-sm"
                        title="Éditer"
                      >
                        <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    )}
                    {product.stock > 0 && canEdit(product) && (
                      <button
                        onClick={() => handleMarkUnavailable(product.id)}
                        className="btn btn-ghost btn-xs sm:btn-sm"
                        title="Marquer indisponible"
                      >
                        <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {canDelete(product) && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-xs sm:btn-sm text-error"
                        title="Supprimer"
                        disabled={deletingId === product.id}
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-12 text-base-content/60">
          Aucun produit trouvé
        </div>
      )}
    </div>
  )
}


