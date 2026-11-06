import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { ConversationList } from '@/components/dashboard/ConversationList'
import { PageTitle } from '@/components/dashboard/fields'
import { botSettings, listConversations } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function SupportPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const [bot, conversations] = await Promise.all([
    botSettings(access.storeId),
    listConversations(access.storeId),
  ])
  const on = bot.enabled && bot.widgetEnabled
  return (
    <div>
      <PageTitle>Service client</PageTitle>
      <div
        className={`flex items-start gap-3 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-sm ${
          on ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
        }`}
      >
        {on ? (
          <FiCheckCircle className="w-5 h-5 shrink-0" />
        ) : (
          <FiAlertCircle className="w-5 h-5 shrink-0" />
        )}
        <span>
          {on
            ? `${bot.name} répond aux clients sur le site. Les réglages du bot restent dans SSS.`
            : "L'assistant n'est pas affiché sur le site : activez-le dans SSS, rubrique Bot client."}
        </span>
      </div>
      <ConversationList conversations={conversations.filter(row => row.source !== 'test')} />
    </div>
  )
}
