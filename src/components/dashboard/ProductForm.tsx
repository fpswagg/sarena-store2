'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiLoader, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { createProduct, updateProduct } from '@/app/dashboard/actions'
import { formatPrice } from '@/lib/site'
import type { DashProduct } from '@/lib/dashboard/data'
import { Field, Toggle } from './fields'
import { ImagesField } from './ImagesField'

type I18n = { en?: { name?: string; description?: string; category?: string } }

function slug(text: string) {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return base || 'produit'
}

export function ProductForm({ product }: { product?: DashProduct }) {
  const router = useRouter()
  const meta = product?.metadata ?? {}
  const en = (meta.i18n as I18n | undefined)?.en ?? {}
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    nameEn: en.name ?? '',
    description: product?.description ?? '',
    descriptionEn: en.description ?? '',
    category: product?.category ?? '',
    categoryEn: en.category ?? '',
    sku: product?.sku ?? '',
    price: product ? String(product.price) : '',
    cost: product?.cost != null ? String(product.cost) : '',
    quantity: product ? String(product.quantity) : '0',
    unlimitedStock: product?.unlimitedStock ?? false,
    active: product?.active ?? true,
    featured: meta.featured === true,
    isNew: meta.new === true,
    priceOnRequest: meta.priceOnRequest === true,
    order: typeof meta.order === 'number' ? String(meta.order) : '',
  })
  const [images, setImages] = useState<string[]>(
    (product?.images ?? []).map(image => image.url ?? '').filter(Boolean)
  )
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(current => ({ ...current, [key]: value }))

  const price = Number(form.price) || 0
  const cost = Number(form.cost) || 0
  const margin = !form.priceOnRequest && price > 0 && cost > 0 ? price - cost : null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)

    const metadata: Record<string, unknown> = {
      ...meta,
      i18n: {
        ...(meta.i18n as object | undefined),
        en: {
          ...en,
          name: form.nameEn.trim() || undefined,
          description: form.descriptionEn.trim() || undefined,
          category: form.categoryEn.trim() || undefined,
        },
      },
      featured: form.featured,
      new: form.isNew,
      priceOnRequest: form.priceOnRequest,
    }
    if (form.order.trim()) metadata.order = Number(form.order)
    else delete metadata.order

    const body: Record<string, unknown> = {
      sku: form.sku.trim() || slug(form.name),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price,
      quantity: Math.max(0, Math.floor(Number(form.quantity) || 0)),
      unlimitedStock: form.unlimitedStock,
      active: form.active,
      images: images.map(url => {
        const known = product?.images.find(image => image.url === url)
        return {
          url,
          ...(known?.key ? { key: known.key } : {}),
          ...(known?.alt ? { alt: known.alt } : {}),
        }
      }),
      metadata,
    }
    if (form.cost.trim()) body.cost = Number(form.cost)

    const result = product ? await updateProduct(product.id, body) : await createProduct(body)
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(product ? 'Produit enregistré' : 'Produit créé')
    router.push('/dashboard/products')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nom (FR) *">
          <input
            required
            maxLength={200}
            className="input input-bordered w-full"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <Field label="Name (EN)">
          <input
            maxLength={200}
            className="input input-bordered w-full"
            value={form.nameEn}
            onChange={e => set('nameEn', e.target.value)}
          />
        </Field>
        <Field label="Description (FR)">
          <textarea
            rows={5}
            maxLength={2000}
            className="textarea textarea-bordered w-full"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </Field>
        <Field label="Description (EN)">
          <textarea
            rows={5}
            maxLength={2000}
            className="textarea textarea-bordered w-full"
            value={form.descriptionEn}
            onChange={e => set('descriptionEn', e.target.value)}
          />
        </Field>
        <Field label="Catégorie (FR)">
          <input
            maxLength={80}
            className="input input-bordered w-full"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          />
        </Field>
        <Field label="Category (EN)">
          <input
            maxLength={80}
            className="input input-bordered w-full"
            value={form.categoryEn}
            onChange={e => set('categoryEn', e.target.value)}
          />
        </Field>
        <Field label="Prix de vente (FCFA) *">
          <input
            required
            type="number"
            min="0"
            step="1"
            className="input input-bordered w-full"
            value={form.price}
            onChange={e => set('price', e.target.value)}
          />
        </Field>
        <Field
          label="Prix d'achat (FCFA)"
          hint={
            margin !== null
              ? `Marge : ${formatPrice(margin)} par pièce. Jamais affiché sur le site.`
              : 'Jamais affiché sur le site.'
          }
        >
          <input
            type="number"
            min="0"
            step="1"
            className="input input-bordered w-full"
            value={form.cost}
            onChange={e => set('cost', e.target.value)}
          />
        </Field>
        <Field label="Stock" hint={form.unlimitedStock ? 'Stock illimité : ce nombre est ignoré.' : undefined}>
          <input
            type="number"
            min="0"
            step="1"
            disabled={form.unlimitedStock}
            className="input input-bordered w-full"
            value={form.quantity}
            onChange={e => set('quantity', e.target.value)}
          />
        </Field>
        <Field label="Référence" hint="Remplie toute seule si vous la laissez vide.">
          <input
            maxLength={80}
            className="input input-bordered w-full"
            value={form.sku}
            onChange={e => set('sku', e.target.value)}
          />
        </Field>
        <Field label="Ordre d'affichage" hint="Les plus petits nombres passent en premier.">
          <input
            type="number"
            step="1"
            className="input input-bordered w-full"
            value={form.order}
            onChange={e => set('order', e.target.value)}
          />
        </Field>
      </div>

      <ImagesField label="Photos" value={images} max={12} onChange={setImages} />

      <div className="grid md:grid-cols-2 gap-4">
        <Toggle
          label="Visible sur le site"
          checked={form.active}
          onChange={value => set('active', value)}
        />
        <Toggle
          label="Stock illimité"
          checked={form.unlimitedStock}
          onChange={value => set('unlimitedStock', value)}
        />
        <Toggle
          label="Populaire"
          hint="Affiche le badge « Populaire ». Les 4 premiers cochés passent sur l'accueil."
          checked={form.featured}
          onChange={value => set('featured', value)}
        />
        <Toggle
          label="Nouveau"
          hint="Affiche le badge « Nouveau »."
          checked={form.isNew}
          onChange={value => set('isNew', value)}
        />
        <Toggle
          label="Prix sur demande"
          hint="Le prix est caché, le client demande sur WhatsApp."
          checked={form.priceOnRequest}
          onChange={value => set('priceOnRequest', value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary gap-2">
          {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          Enregistrer
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  )
}
