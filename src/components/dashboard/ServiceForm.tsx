'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiLoader, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { createService, updateService } from '@/app/dashboard/actions'
import type { DashRecord } from '@/lib/dashboard/data'
import { Field, Toggle } from './fields'

type I18n = { en?: { name?: string; description?: string } }

export function ServiceForm({ service }: { service?: DashRecord }) {
  const router = useRouter()
  const meta = service?.metadata ?? {}
  const data = service?.data ?? {}
  const en = (meta.i18n as I18n | undefined)?.en ?? {}
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: service?.name ?? '',
    nameEn: en.name ?? '',
    description: typeof data.description === 'string' ? data.description : '',
    descriptionEn: en.description ?? '',
    area: typeof data.area === 'string' ? data.area : '',
    price: data.price != null ? String(data.price) : '',
    active: data.active !== false,
    featured: meta.featured === true,
    order: typeof meta.order === 'number' ? String(meta.order) : '',
  })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(current => ({ ...current, [key]: value }))

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
        },
      },
    }
    metadata.featured = form.featured
    if (form.order.trim()) metadata.order = Number(form.order)
    else delete metadata.order

    const nextData: Record<string, unknown> = {
      ...data,
      description: form.description.trim(),
      area: form.area.trim(),
      active: form.active,
      currency: data.currency ?? 'XAF',
    }
    if (form.price.trim()) nextData.price = Number(form.price)
    else delete nextData.price

    const body = { name: form.name.trim(), data: nextData, metadata }
    const result = service ? await updateService(service.id, body) : await createService(body)
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(service ? 'Service enregistré' : 'Service créé')
    router.push('/dashboard/services')
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
            className="textarea textarea-bordered w-full"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </Field>
        <Field label="Description (EN)">
          <textarea
            rows={5}
            className="textarea textarea-bordered w-full"
            value={form.descriptionEn}
            onChange={e => set('descriptionEn', e.target.value)}
          />
        </Field>
        <Field label="Domaine">
          <input
            maxLength={80}
            className="input input-bordered w-full"
            value={form.area}
            onChange={e => set('area', e.target.value)}
          />
        </Field>
        <Field
          label="Prix (FCFA)"
          hint="Vide si la description donne déjà les prix, ou si le tarif dépend du projet."
        >
          <input
            type="number"
            min="0"
            step="1"
            className="input input-bordered w-full"
            value={form.price}
            onChange={e => set('price', e.target.value)}
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

      <Toggle
        label="Sur la page d'accueil"
        hint="Les 3 premiers services cochés passent sur l'accueil."
        checked={form.featured}
        onChange={value => set('featured', value)}
      />
      <Toggle
        label="Visible sur le site"
        checked={form.active}
        onChange={value => set('active', value)}
      />

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
