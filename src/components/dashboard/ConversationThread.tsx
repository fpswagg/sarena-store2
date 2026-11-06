'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheck, FiLoader, FiRepeat, FiSend, FiUserCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { replyToCustomer, setHandoff } from '@/app/dashboard/actions'
import type { Conversation, ConversationMessage } from '@/lib/dashboard/data'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from './fields'
import { SOURCE_LABEL, handoffLabel } from './support'
import clsx from 'clsx'

export function ConversationThread({
  conversation,
  messages,
}: {
  conversation: Conversation
  messages: ConversationMessage[]
}) {
  const router = useRouter()
  const bottom = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const state = handoffLabel(conversation)
  const status = conversation.handoff?.status

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  // Customers write while the page is open: keep it fresh.
  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 20_000)
    return () => window.clearInterval(timer)
  }, [router])

  const act = async (action: 'take' | 'refuse' | 'release') => {
    setBusy(action)
    const result = await setHandoff(conversation.id, action)
    setBusy(null)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(
      action === 'take'
        ? 'Vous avez la main : le bot se tait.'
        : action === 'refuse'
          ? 'Le client est prévenu.'
          : 'Le bot reprend la conversation.'
    )
    router.refresh()
  }

  const send = async (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setBusy('send')
    const result = await replyToCustomer(conversation.id, text)
    setBusy(null)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    if (result.data && result.data.sent === false && !result.data.queued) {
      toast.error(
        result.data.reason === 'no-template'
          ? 'Ce client a écrit il y a trop longtemps : WhatsApp bloque le message.'
          : "Le message n'a pas pu partir."
      )
      return
    }
    setDraft('')
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-9rem)]">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-heading font-bold truncate">
            {conversation.visitor}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="badge badge-ghost badge-sm">{SOURCE_LABEL[conversation.source]}</span>
            {state && <span className={`badge badge-sm border-0 ${state.tone}`}>{state.text}</span>}
          </div>
        </div>

        {conversation.canHandoff && (
          <div className="flex flex-wrap gap-2">
            {status === 'active' ? (
              <button
                onClick={() => void act('release')}
                disabled={busy !== null}
                className="btn btn-sm btn-ghost gap-2"
              >
                {busy === 'release' ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiRepeat className="w-4 h-4" />
                )}
                Rendre au bot
              </button>
            ) : (
              <button
                onClick={() => void act('take')}
                disabled={busy !== null}
                className="btn btn-sm btn-primary gap-2"
              >
                {busy === 'take' ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiUserCheck className="w-4 h-4" />
                )}
                Prendre la main
              </button>
            )}
            {status === 'pending' && (
              <button
                onClick={() => void act('refuse')}
                disabled={busy !== null}
                className="btn btn-sm btn-ghost gap-2"
              >
                <FiX className="w-4 h-4" />
                Personne de libre
              </button>
            )}
          </div>
        )}
      </div>

      {conversation.handoff?.reason && status === 'pending' && (
        <p className="rounded-xl bg-warning/10 p-3 text-sm mb-4">{conversation.handoff.reason}</p>
      )}

      <div className="flex-1 space-y-3 mb-4">
        {messages.length === 0 && (
          <p className="text-sm text-base-content/60 text-center py-8">Aucun message.</p>
        )}
        {messages.map((message, index) => {
          const mine = message.role === 'assistant'
          if (message.notice) {
            return (
              <p key={index} className="text-center text-xs text-base-content/50">
                {message.content}
              </p>
            )
          }
          return (
            <div key={index} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={clsx(
                  'max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  mine
                    ? message.team
                      ? 'rounded-br-md bg-primary text-primary-content'
                      : 'rounded-br-md bg-base-300'
                    : 'rounded-bl-md bg-base-200'
                )}
              >
                {mine ? (
                  <div
                    className="chat-md"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.files?.map(file =>
                  file.url ? (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block underline mt-1 text-xs"
                    >
                      {file.name}
                    </a>
                  ) : null
                )}
                <p className="text-[10px] opacity-60 mt-1">
                  {mine ? (message.team ? 'Équipe · ' : 'Bot · ') : ''}
                  {formatDate(message.at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottom} />
      </div>

      {conversation.canMessage ? (
        <form onSubmit={send} className="sticky bottom-0 flex items-end gap-2 bg-base-100 py-2">
          <textarea
            rows={1}
            value={draft}
            maxLength={3500}
            onChange={e => setDraft(e.target.value)}
            placeholder={
              status === 'active' ? 'Votre réponse…' : 'Écrire au client (le bot peut aussi répondre)'
            }
            aria-label="Votre réponse"
            className="textarea textarea-bordered flex-1 min-h-[42px] max-h-40 resize-none rounded-2xl text-sm"
          />
          <button
            type="submit"
            disabled={busy !== null || !draft.trim()}
            aria-label="Envoyer"
            className="btn btn-primary btn-circle shrink-0"
          >
            {busy === 'send' ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSend className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <p className="flex items-start gap-2 rounded-xl bg-base-200 p-3 text-xs sm:text-sm text-base-content/70">
          <FiCheck className="w-4 h-4 shrink-0 mt-0.5" />
          {conversation.optedOut
            ? 'Ce client a demandé à ne plus recevoir de messages.'
            : "Sur le site, le visiteur n'a laissé aucun moyen de lui écrire : le bot répond, vous pouvez lire ici. Les reprises à la main marchent sur Telegram et WhatsApp."}
        </p>
      )}
    </div>
  )
}
