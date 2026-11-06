import { MessageList } from '@/components/dashboard/MessageList'
import { PageTitle } from '@/components/dashboard/fields'
import { listRecords } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function MessagesPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const rows = await listRecords(access.storeId, 'feedback')
  const sorted = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <div>
      <PageTitle>Messages</PageTitle>
      <p className="text-sm text-base-content/60 -mt-2 sm:-mt-5 mb-4 sm:mb-6">
        Ce qui arrive par le formulaire du site et les demandes prises par le bot.
      </p>
      <MessageList messages={sorted} />
    </div>
  )
}
