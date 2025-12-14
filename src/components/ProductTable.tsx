'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi'
import { ProductWithRelations } from '@/types'
import { getTranslated } from '@/lib/i18n/context'
import { deleteProduct, markProductUnavailable } from '@/app/actions/products'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProductTableProps {
  products: ProductWithRelations[]
  userRole: string
  currentUserId: string
  locale?: string
}

export function ProductTable({ products, userRole, currentUserId, locale = 'fr' }: ProductTableProps) {
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
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Ville</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Note</th>
            {userRole === 'ADMIN' && <th>Fournisseur</th>}
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
                <td>
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
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
                  <div className="font-semibold">{name}</div>
                  {product.isNew && (
                    <span className="badge badge-secondary badge-sm">Nouveau</span>
                  )}
                </td>
                <td>{product.city}</td>
                <td>{product.price.toLocaleString()} FCFA</td>
                <td>
                  <span className={product.stock > 0 ? 'text-success' : 'text-error'}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="text-warning">★</span>
                    <span>{ratingAvg.toFixed(1)}</span>
                    <span className="text-sm text-base-content/60">({ratingCount})</span>
                  </div>
                </td>
                {userRole === 'ADMIN' && (
                  <td>{product.supplier.fullName || product.supplier.email}</td>
                )}
                <td>
                  <div className="flex items-center gap-2">
                    {canEdit(product) && (
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="btn btn-ghost btn-sm"
                        title="Éditer"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                    )}
                    {product.stock > 0 && canEdit(product) && (
                      <button
                        onClick={() => handleMarkUnavailable(product.id)}
                        className="btn btn-ghost btn-sm"
                        title="Marquer indisponible"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete(product) && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Supprimer"
                        disabled={deletingId === product.id}
                      >
                        <FiTrash2 className="w-4 h-4" />
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

