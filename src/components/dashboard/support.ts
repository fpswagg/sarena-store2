import type { Conversation } from '@/lib/dashboard/data'

export const SOURCE_LABEL: Record<Conversation['source'], string> = {
  widget: 'Site web',
  api: 'Site web',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  test: 'Essai',
}

export function handoffLabel(conversation: Conversation): { text: string; tone: string } | null {
  switch (conversation.handoff?.status) {
    case 'pending':
      return {
        text:
          conversation.handoff.origin === 'bot' ? 'Le bot propose de reprendre' : 'Attend quelqu’un',
        tone: 'badge-error',
      }
    case 'active':
      return { text: 'Pris en charge', tone: 'badge-success' }
    default:
      return null
  }
}
