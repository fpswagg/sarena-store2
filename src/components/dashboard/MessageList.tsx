'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiMail, FiPhone, FiRotateCcw, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { deleteMessage, setMessageStatus } from '@/app/dashboard/actions'
import type { DashRecord } from '@/lib/dashboard/data'
import { whatsappUrl } from '@/lib/site'
import { ConfirmDialog } from './ConfirmDialog'
import { Empty, formatDate } from './fields'
import clsx from 'clsx'

const TYPE_LABEL: Record<string, string> = {
  order_request: 'Commande',
  complaint: 'Réclamation',
  callback: 'À rappeler',
  booking: 'Rendez-vous',
  quote: 'Devis',
  feedback: 'Avis',
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export function MessageList({ messages }: { messages: DashRecord[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'new' | 'all'>('new')
  const [target, setTarget] = useState<DashRecord | null>(null)
  const unread = messages.filter(row => row.data.status !== 'done')
  const rows = filter === 'new' ? unread : messages

  const toggle = async (row: DashRecord) => {
    const next = row.data.status === 'done' ? 'new' : 'done'
    const result = await setMessageStatus(row.id, row.data, next)
    if (result.ok) router.refresh()
    else toast.error(result.error)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ['new', `Nouveaux (${unread.length})`],
            ['all', `Tous (${messages.length})`],
          ] as ['new' | 'all', string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors',
              filter === id ? 'bg-primary text-primary-content' : 'bg-base-200 hover:bg-base-300'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Empty>{filter === 'new' ? 'Rien de nouveau.' : 'Aucun message pour le moment.'}</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map(row => {
            const name = text(row.data.name) || row.name || 'Sans nom'
            const email = text(row.data.email)
            const phone = text(row.data.phone)
            const type = TYPE_LABEL[text(row.data.type)]
            const done = row.data.status === 'done'
            return (
              <li
                key={row.id}
                className={clsx('premium-card rounded-xl p-4 sm:p-5', done && 'opacity-60')}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-heading font-semibold flex items-center gap-2">
                    {name}
                    {type && <span className="badge badge-primary badge-sm border-0">{type}</span>}
                  </h2>
                  <span className="text-xs text-base-content/50">{formatDate(row.createdAt)}</span>
                </div>
                <p className="text-sm whitespace-pre-line text-base-content/80 mt-2">
                  {text(row.data.message)}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {phone && (
                    <>
                      <a
                        href={whatsappUrl(phone.replace(/\D/g, ''))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-ghost gap-1"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                      <a href={`tel:${phone}`} className="btn btn-xs btn-ghost gap-1">
                        <FiPhone className="w-3.5 h-3.5" />
                        {phone}
                      </a>
                    </>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="btn btn-xs btn-ghost gap-1">
                      <FiMail className="w-3.5 h-3.5" />
                      {email}
                    </a>
                  )}
                  <span className="flex-1" />
                  <button onClick={() => void toggle(row)} className="btn btn-xs btn-ghost gap-1">
                    {done ? <FiRotateCcw className="w-3.5 h-3.5" /> : <FiCheck className="w-3.5 h-3.5" />}
                    {done ? 'Remettre en nouveau' : 'Traité'}
                  </button>
                  <button
                    onClick={() => setTarget(row)}
                    className="btn btn-xs btn-ghost btn-square text-error"
                    aria-label="Supprimer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Supprimer le message"
        subject={target ? text(target.data.name) || target.name || '' : ''}
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return
          const result = await deleteMessage(target.id)
          if (result.ok) {
            toast.success('Message supprimé')
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
