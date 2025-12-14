'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductWithRelations } from '@/types'
import { User, Role } from '@prisma/client'
import { createProduct, updateProduct } from '@/app/actions/products'
import { getTranslated } from '@/lib/i18n/context'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface ProductFormProps {
  product?: ProductWithRelations
  suppliers?: Array<{ id: string; fullName: string | null; email: string | null }>
  currentUser: { id: string; role: Role }
}

export function ProductForm({ product, suppliers = [], currentUser }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nameFr: product ? getTranslated(product.name as Record<string, string>, 'fr') : '',
    nameEn: product ? getTranslated(product.name as Record<string, string>, 'en') : '',
    shortDescFr: product ? getTranslated(product.shortDesc as Record<string, string>, 'fr') : '',
    shortDescEn: product ? getTranslated(product.shortDesc as Record<string, string>, 'en') : '',
    longDescFr: product ? getTranslated(product.longDesc as Record<string, string>, 'fr') : '',
    longDescEn: product ? getTranslated(product.longDesc as Record<string, string>, 'en') : '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    city: product?.city || '',
    thumbnail: product?.thumbnail || '',
    images: product?.images.join(',') || '',
    isNew: product?.isNew || false,
    supplierId: product?.supplierId || currentUser.id,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'isNew') {
        formDataObj.append(key, value ? 'true' : 'false')
      } else {
        formDataObj.append(key, String(value))
      }
    })

    const result = product
      ? await updateProduct(product.id, formDataObj)
      : await createProduct(formDataObj)

    setIsSubmitting(false)

    if (result.success) {
      toast.success(product ? 'Produit mis à jour' : 'Produit créé')
      router.push('/dashboard/products')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name FR */}
        <div>
          <label className="label">
            <span className="label-text">Nom (Français) *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.nameFr}
            onChange={e => setFormData({ ...formData, nameFr: e.target.value })}
            required
          />
        </div>

        {/* Name EN */}
        <div>
          <label className="label">
            <span className="label-text">Nom (English) *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.nameEn}
            onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
            required
          />
        </div>

        {/* Short Desc FR */}
        <div>
          <label className="label">
            <span className="label-text">Description courte (FR) *</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.shortDescFr}
            onChange={e => setFormData({ ...formData, shortDescFr: e.target.value })}
            required
            rows={3}
          />
        </div>

        {/* Short Desc EN */}
        <div>
          <label className="label">
            <span className="label-text">Short Description (EN) *</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.shortDescEn}
            onChange={e => setFormData({ ...formData, shortDescEn: e.target.value })}
            required
            rows={3}
          />
        </div>

        {/* Long Desc FR */}
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text">Description longue (FR) *</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.longDescFr}
            onChange={e => setFormData({ ...formData, longDescFr: e.target.value })}
            required
            rows={5}
          />
        </div>

        {/* Long Desc EN */}
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text">Long Description (EN) *</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.longDescEn}
            onChange={e => setFormData({ ...formData, longDescEn: e.target.value })}
            required
            rows={5}
          />
        </div>

        {/* Price */}
        <div>
          <label className="label">
            <span className="label-text">Prix (FCFA) *</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
            min="0"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="label">
            <span className="label-text">Stock *</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={formData.stock}
            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            required
            min="0"
          />
        </div>

        {/* City */}
        <div>
          <label className="label">
            <span className="label-text">Ville *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        {/* Supplier (Admin only) */}
        {currentUser.role === 'ADMIN' && suppliers.length > 0 && (
          <div>
            <label className="label">
              <span className="label-text">Fournisseur</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.supplierId}
              onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
            >
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.fullName || supplier.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text">Image principale (URL) *</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={formData.thumbnail}
            onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
            required
          />
          {formData.thumbnail && (
            <div className="mt-2 w-32 h-32 relative rounded-lg overflow-hidden bg-base-200">
              <Image
                src={formData.thumbnail}
                alt="Preview"
                fill
                className="object-cover"
                sizes="128px"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text">Images supplémentaires (URLs séparées par des virgules)</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.images}
            onChange={e => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>

        {/* Is New */}
        <div className="md:col-span-2">
          <label className="label cursor-pointer">
            <span className="label-text">Marquer comme nouveau</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.isNew}
              onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}


