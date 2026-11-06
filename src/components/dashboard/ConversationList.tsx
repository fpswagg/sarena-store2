'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'
import type { Conversation } from '@/lib/dashboard/data'
import { Empty, formatDate } from './fields'
import { SOURCE_LABEL, handoffLabel } from './support'
import clsx from 'clsx'

type Filter = 'all' | 'open'

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  const open = conversations.filter(
    row => row.handoff?.status === 'pending' || row.handoff?.status === 'active'
  )
  const [filter, setFilter] = useState<Filter>(open.length > 0 ? 'open' : 'all')
  const rows = filter === 'open' ? open : conversations

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ['open', `À traiter (${open.length})`],
            ['all', `Toutes (${conversations.length})`],
          ] as [Filter, string][]
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
        <Empty>
          {filter === 'open'
            ? 'Personne à reprendre pour le moment.'
            : 'Aucune conversation pour le moment.'}
        </Empty>
      ) : (
        <ul className="space-y-2">
          {rows.map(row => {
            const state = handoffLabel(row)
            return (
              <li key={row.id}>
                <Link
                  href={`/dashboard/support/${row.id}`}
                  prefetch={false}
                  className="premium-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm truncate">{row.visitor}</span>
                      <span className="badge badge-ghost badge-sm">{SOURCE_LABEL[row.source]}</span>
                      {state && (
                        <span className={`badge badge-sm border-0 ${state.tone}`}>{state.text}</span>
                      )}
                    </span>
                    <span className="block text-xs sm:text-sm text-base-content/60 truncate mt-1">
                      {row.lastRole === 'assistant' ? 'Bot : ' : ''}
                      {row.lastMessage}
                    </span>
                    <span className="block text-xs text-base-content/40 mt-0.5">
                      {formatDate(row.at)} · {row.messages} message{row.messages > 1 ? 's' : ''}
                    </span>
                  </span>
                  <FiChevronRight className="w-4 h-4 text-base-content/40 shrink-0" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
