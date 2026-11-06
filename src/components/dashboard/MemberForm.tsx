'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiLoader, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { updateMemberMetadata } from '@/app/dashboard/actions'
import type { DashMember } from '@/lib/dashboard/data'
import type { SocialMediaPlatform } from '@/lib/types'
import { Field, Toggle } from './fields'
import { ImagesField } from './ImagesField'

const PLATFORMS: { id: SocialMediaPlatform; label: string }[] = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'github', label: 'GitHub' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'email', label: 'E-mail' },
  { id: 'link', label: 'Site web' },
]

type Social = { platform: SocialMediaPlatform; url: string }

/** The member's public card: stored in their SSS metadata, other keys are left alone. */
export function MemberForm({ member }: { member: DashMember }) {
  const router = useRouter()
  const meta = member.metadata ?? {}
  const en = (meta.en as { title?: string; bio?: string } | undefined) ?? {}
  const text = (value: unknown) => (typeof value === 'string' ? value : '')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    public: meta.public === true,
    displayName: text(meta.displayName),
    title: text(meta.title),
    titleEn: en.title ?? '',
    bio: text(meta.bio),
    bioEn: en.bio ?? '',
    order: typeof meta.order === 'number' ? String(meta.order) : '',
  })
  const [photo, setPhoto] = useState<string[]>(text(meta.photo) ? [text(meta.photo)] : [])
  const [socials, setSocials] = useState<Social[]>(
    Array.isArray(meta.socials) ? (meta.socials as Social[]) : []
  )
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(current => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const next: Record<string, unknown> = {
      ...meta,
      public: form.public,
      displayName: form.displayName.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      en: { ...en, title: form.titleEn.trim(), bio: form.bioEn.trim() },
      photo: photo[0] ?? '',
      socials: socials
        .map(social => ({ platform: social.platform, url: social.url.trim() }))
        .filter(social => social.url),
    }
    if (form.order.trim()) next.order = Number(form.order)
    else delete next.order
    const result = await updateMemberMetadata(member.id, next)
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success('Fiche enregistrée')
    router.push('/dashboard/team')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Toggle
        label="Afficher sur le site"
        hint={
          member.status === 'pending'
            ? "Cette personne n'a pas encore accepté l'invitation : elle n'apparaîtra qu'après."
            : undefined
        }
        checked={form.public}
        onChange={value => set('public', value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nom affiché" hint={`Vide : « ${member.name} ».`}>
          <input
            maxLength={80}
            className="input input-bordered w-full"
            value={form.displayName}
            onChange={e => set('displayName', e.target.value)}
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
        <Field label="Titre (FR)">
          <input
            maxLength={120}
            className="input input-bordered w-full"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
        </Field>
        <Field label="Title (EN)">
          <input
            maxLength={120}
            className="input input-bordered w-full"
            value={form.titleEn}
            onChange={e => set('titleEn', e.target.value)}
          />
        </Field>
        <Field label="Présentation (FR)">
          <textarea
            rows={5}
            maxLength={1000}
            className="textarea textarea-bordered w-full"
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
          />
        </Field>
        <Field label="Bio (EN)">
          <textarea
            rows={5}
            maxLength={1000}
            className="textarea textarea-bordered w-full"
            value={form.bioEn}
            onChange={e => set('bioEn', e.target.value)}
          />
        </Field>
      </div>

      <ImagesField label="Photo" value={photo} max={1} onChange={setPhoto} />

      <div className="space-y-2">
        <div className="label">
          <span className="label-text">Réseaux</span>
        </div>
        {socials.map((social, index) => (
          <div key={index} className="flex gap-2">
            <select
              aria-label="Réseau"
              className="select select-bordered w-36 sm:w-44 shrink-0"
              value={social.platform}
              onChange={e =>
                setSocials(rows =>
                  rows.map((row, i) =>
                    i === index ? { ...row, platform: e.target.value as SocialMediaPlatform } : row
                  )
                )
              }
            >
              {PLATFORMS.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.label}
                </option>
              ))}
            </select>
            <input
              aria-label="Adresse"
              placeholder={social.platform === 'email' ? 'nom@exemple.com' : 'https://…'}
              className="input input-bordered flex-1 min-w-0"
              value={social.url}
              onChange={e =>
                setSocials(rows =>
                  rows.map((row, i) => (i === index ? { ...row, url: e.target.value } : row))
                )
              }
            />
            <button
              type="button"
              onClick={() => setSocials(rows => rows.filter((_, i) => i !== index))}
              className="btn btn-ghost btn-square text-error shrink-0"
              aria-label="Retirer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSocials(rows => [...rows, { platform: 'facebook', url: '' }])}
          className="btn btn-ghost btn-sm gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Ajouter un réseau
        </button>
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
