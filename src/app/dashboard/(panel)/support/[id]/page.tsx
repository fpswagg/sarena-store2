import { notFound } from 'next/navigation'
import { ConversationThread } from '@/components/dashboard/ConversationThread'
import { conversationMessages, listConversations } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await dashboardAccess()
  if (!access.ok) return null
  const [conversations, messages] = await Promise.all([
    listConversations(access.storeId),
    conversationMessages(access.storeId, id),
  ])
  const conversation = conversations.find(row => row.id === id)
  if (!conversation) notFound()
  return <ConversationThread conversation={conversation} messages={messages} />
}
