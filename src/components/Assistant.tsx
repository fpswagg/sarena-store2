'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCpu, FiMessageCircle, FiSend, FiX } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { renderMarkdown } from '@/lib/markdown'
import type { Chatbot } from '@/lib/types'
import clsx from 'clsx'

/**
 * The business's customer assistant (SSS > Customer bot). It talks to SSS's public bot API from the
 * browser. Answers count on the business's SSS credits, so nothing is sent until the visitor says so.
 *
 * Open it from anywhere: a link to `#assistant`, or the `sss:ask` event (see askAssistant).
 */

type ChatFile = { name: string; mediaType: string; url?: string }
type Choices = { question: string; options: string[]; multiple: boolean }
type Message = {
  role: 'user' | 'assistant'
  content: string
  files?: ChatFile[]
  choices?: Choices
  pending?: boolean
}

const VISITOR_KEY = 'sss_visitor_id'

function visitorId(): string {
  try {
    const saved = localStorage.getItem(VISITOR_KEY)
    if (saved) return saved
    const id = `v_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`
    localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    // Private mode: a new conversation per page load.
    return `v_${Math.random().toString(36).slice(2, 14)}${Date.now().toString(36)}`
  }
}

export function Assistant({ bot, apiUrl }: { bot: Chatbot; apiUrl: string }) {
  const { t } = useI18n()
  const base = `${apiUrl}/api/v1/bot/${encodeURIComponent(bot.publicKey)}/messages`
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const visitor = useRef('')
  const historyRequested = useRef(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const loadHistory = useCallback(async () => {
    visitor.current ||= visitorId()
    try {
      const res = await fetch(
        `${base}?source=widget&visitorId=${encodeURIComponent(visitor.current)}`
      )
      const body = (await res.json()) as { data?: Message[] }
      if (res.ok && Array.isArray(body.data)) {
        setMessages(body.data.map(m => ({ ...m, content: m.content ?? '' })))
      }
    } catch {
      /* the greeting still shows */
    } finally {
      setLoaded(true)
    }
  }, [base])

  const send = useCallback(
    async (text: string) => {
      const message = text.trim()
      if (!message || busy) return
      visitor.current ||= visitorId()
      setError(null)
      setDraft('')
      setPicked([])
      setBusy(true)
      setMessages(prev => [
        ...prev.map(m => ({ ...m, choices: undefined })),
        { role: 'user', content: message },
        { role: 'assistant', content: '', pending: true },
      ])
      try {
        const res = await fetch(base, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message, visitorId: visitor.current, source: 'widget' }),
        })
        const body = (await res.json().catch(() => null)) as {
          data?: { reply: string; files?: ChatFile[]; choices?: Choices }
        } | null
        if (!res.ok || !body?.data) throw new Error('no answer')
        const reply = body.data
        setMessages(prev => [
          ...prev.filter(m => !m.pending),
          { role: 'assistant', content: reply.reply, files: reply.files, choices: reply.choices },
        ])
      } catch {
        setMessages(prev => prev.filter(m => !m.pending))
        setError(t.assistant.error)
        setDraft(message)
      } finally {
        setBusy(false)
      }
    },
    [base, busy, t]
  )

  /** Opens the panel; the first time, also loads the saved conversation. */
  const openPanel = useCallback(() => {
    setOpen(true)
    if (!historyRequested.current) {
      historyRequested.current = true
      void loadHistory()
    }
  }, [loadHistory])

  const reset = useCallback(async () => {
    visitor.current ||= visitorId()
    setMessages([])
    setError(null)
    await fetch(`${base}?source=widget&visitorId=${encodeURIComponent(visitor.current)}`, {
      method: 'DELETE',
    }).catch(() => undefined)
  }, [base])

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === '#assistant') {
        openPanel()
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
    const onAsk = (event: Event) => {
      openPanel()
      const text = (event as CustomEvent<string>).detail
      if (typeof text === 'string' && text.trim()) setDraft(text)
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    window.addEventListener('sss:ask', onAsk)
    return () => {
      window.removeEventListener('hashchange', fromHash)
      window.removeEventListener('sss:ask', onAsk)
    }
  }, [openPanel])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const last = messages[messages.length - 1]
  const choices = !busy && last?.role === 'assistant' ? last.choices : undefined
  const showSuggestions = loaded && messages.length === 0 && bot.suggestions.length > 0

  return (
    <div id="assistant">
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={openPanel}
            className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-content shadow-lg shadow-primary/30 flex items-center justify-center"
            aria-label={t.assistant.open}
          >
            <FiMessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={bot.name}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-base-300 bg-base-100 shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[min(640px,calc(100dvh-2.5rem))] sm:w-[400px] sm:rounded-2xl"
          >
            <header className="flex items-center gap-3 border-b border-base-200 bg-base-200/50 px-4 py-3">
              <Avatar bot={bot} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading font-semibold">{bot.name}</p>
                <p className="truncate text-xs text-base-content/60">{t.assistant.online}</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => void reset()}
                  className="btn btn-ghost btn-xs text-base-content/60"
                >
                  {t.assistant.reset}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.assistant.close}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <FiX className="w-5 h-5" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {bot.greeting && <Bubble role="assistant" content={bot.greeting} />}
              {messages.map((m, i) => (
                <Bubble key={i} {...m} />
              ))}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {bot.suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="rounded-full bg-primary/10 text-primary px-3 py-1.5 text-left text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {choices && (
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {choices.options.map(option => {
                      const on = picked.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={choices.multiple ? on : undefined}
                          onClick={() =>
                            choices.multiple
                              ? setPicked(p => (on ? p.filter(x => x !== option) : [...p, option]))
                              : void send(option)
                          }
                          className={clsx(
                            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                            on
                              ? 'bg-primary text-primary-content'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          )}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                  {choices.multiple && picked.length > 0 && (
                    <button
                      type="button"
                      onClick={() => void send(picked.join(', '))}
                      className="btn btn-primary btn-xs"
                    >
                      {t.assistant.send}
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="border-t border-base-200 bg-error/10 px-4 py-2 text-xs text-error">
                {error}
              </p>
            )}

            <form
              className="flex items-end gap-2 border-t border-base-200 bg-base-200/50 p-3"
              onSubmit={e => {
                e.preventDefault()
                void send(draft)
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={2000}
                placeholder={t.assistant.placeholder}
                aria-label={t.assistant.placeholder}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void send(draft)
                  }
                }}
                className="textarea textarea-bordered min-h-[42px] max-h-32 flex-1 resize-none rounded-2xl text-sm"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label={t.assistant.send}
                className="btn btn-primary btn-circle shrink-0"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

function Avatar({ bot, size }: { bot: Chatbot; size: number }) {
  if (bot.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={bot.avatarUrl}
        alt=""
        className="shrink-0 rounded-xl object-cover ring-2 ring-primary/20"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <FiCpu className="w-5 h-5" />
    </span>
  )
}

function Bubble({ role, content, files, pending }: Message) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          mine ? 'rounded-br-md bg-primary text-primary-content' : 'rounded-bl-md bg-base-200'
        )}
      >
        {pending ? (
          <span className="inline-flex gap-1 py-1" aria-label="…">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        ) : mine ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="chat-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        )}
        {files && files.length > 0 && (
          <div className="mt-2 grid gap-2">
            {files.map((file, i) =>
              file.url && file.mediaType.startsWith('image/') ? (
                <a key={i} href={file.url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-h-56 w-full rounded-xl object-cover"
                  />
                </a>
              ) : file.url ? (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {file.name}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  )
}
