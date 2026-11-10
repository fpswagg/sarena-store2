'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { createLink, deleteLink } from '@/app/dashboard/actions'
import type { DashLink } from '@/lib/dashboard/data'

const KINDS: { value: string; label: string; placeholder: string }[] = [
  { value: 'whatsapp_group', label: 'Groupe WhatsApp', placeholder: 'https://chat.whatsapp.com/…' },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@…' },
  { value: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/…' },
  { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/…' },
  { value: 'website', label: 'Site web', placeholder: 'https://…' },
  { value: 'other', label: 'Autre', placeholder: 'https://…' },
]

const labelOf = (kind: string) => KINDS.find(k => k.value === kind)?.label ?? kind

/** Store links in SSS: the site shows WhatsApp groups and networks from this list (nothing else). */
export function LinksManager({ links }: { links: DashLink[] }) {
  const router = useRouter()
  const [kind, setKind] = useState('whatsapp_group')
  const [busy, setBusy] = useState(false)

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const url = String(data.get('url') ?? '').trim()
    const label = String(data.get('label') ?? '').trim()
    if (kind === 'whatsapp_group' && !/^https:\/\/chat\.whatsapp\.com\//.test(url)) {
      toast.error('Un lien de groupe commence par https://chat.whatsapp.com/')
      return
    }
    setBusy(true)
    const result = await createLink({ kind, url, ...(label ? { label } : {}) })
    setBusy(false)
    if (!result.ok) return void toast.error(result.error)
    toast.success('Lien ajouté')
    form.reset()
    router.refresh()
  }

  const remove = async (link: DashLink) => {
    if (!confirm(`Retirer « ${link.label} » ?`)) return
    const result = await deleteLink(link.id)
    if (!result.ok) return void toast.error(result.error)
    toast.success('Lien retiré')
    router.refresh()
  }

  const groups = links.filter(l => l.kind === 'whatsapp_group' || l.url.includes('chat.whatsapp.com/'))
  const others = links.filter(l => !groups.includes(l))

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-base-content/60">
        Les groupes WhatsApp s’affichent dans « Communauté » sur le site, les réseaux aussi et dans le pied de page.
      </p>

      <form onSubmit={add} className="border border-base-300 p-4 grid gap-3 sm:grid-cols-[10rem_1fr]">
        <select className="select select-bordered w-full" value={kind} onChange={e => setKind(e.target.value)}>
          {KINDS.map(k => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <input
          name="url"
          required
          type="url"
          maxLength={400}
          placeholder={KINDS.find(k => k.value === kind)?.placeholder}
          className="input input-bordered w-full font-mono text-sm"
        />
        <input
          name="label"
          maxLength={80}
          placeholder={kind === 'whatsapp_group' ? 'Nom du groupe (ex. Sarena Business)' : 'Nom affiché (facultatif)'}
          className="input input-bordered w-full sm:col-span-2"
        />
        <button type="submit" disabled={busy} className="btn btn-primary gap-2 sm:col-span-2 sm:justify-self-start">
          <FiPlus className="w-4 h-4" />
          Ajouter
        </button>
      </form>

      {[
        { title: 'Groupes WhatsApp', rows: groups },
        { title: 'Réseaux et autres liens', rows: others },
      ].map(section => (
        <section key={section.title}>
          <h2 className="text-sm font-semibold mb-2">{section.title}</h2>
          {section.rows.length === 0 ? (
            <p className="text-sm text-base-content/50 border border-dashed border-base-300 px-4 py-3">Aucun pour l’instant.</p>
          ) : (
            <ul className="border border-base-300">
              {section.rows.map(link => (
                <li key={link.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-base-300 last:border-b-0">
                  <span className="font-mono text-[11px] uppercase text-base-content/50 w-24 flex-shrink-0 truncate">
                    {labelOf(link.kind)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-sm">{link.label}</span>
                    <span className="block truncate font-mono text-xs text-base-content/50">{link.url}</span>
                  </span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs btn-square" aria-label="Ouvrir">
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button type="button" onClick={() => remove(link)} className="btn btn-ghost btn-xs btn-square text-error" aria-label="Retirer">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
