import Link from 'next/link'
import {
  FiAlertCircle,
  FiBriefcase,
  FiChevronRight,
  FiHeadphones,
  FiMail,
  FiPackage,
} from 'react-icons/fi'
import { Empty, PageTitle, formatDate } from '@/components/dashboard/fields'
import { listConversations, listProducts, listRecords, stockSummary } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function DashboardHome() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const { storeId } = access
  const [summary, services, messages, conversations, products] = await Promise.all([
    stockSummary(storeId),
    listRecords(storeId, 'service'),
    listRecords(storeId, 'feedback').catch(() => []),
    listConversations(storeId).catch(() => []),
    listProducts(storeId),
  ])
  const unread = messages.filter(row => row.data.status !== 'done')
  const waiting = conversations.filter(row => row.handoff?.status === 'pending')
  const soldOut = products.filter(row => row.active && !row.unlimitedStock && row.quantity <= 0)

  const stats = [
    { label: 'Total produits', value: summary.totalProducts, icon: FiPackage, tone: 'text-primary', bg: 'bg-primary/10', href: '/dashboard/products' },
    { label: 'Rupture de stock', value: summary.outOfStock, icon: FiAlertCircle, tone: 'text-error', bg: 'bg-error/10', href: '/dashboard/products' },
    { label: 'Services', value: services.length, icon: FiBriefcase, tone: 'text-secondary', bg: 'bg-secondary/10', href: '/dashboard/services' },
    { label: 'Nouveaux messages', value: unread.length, icon: FiMail, tone: 'text-warning', bg: 'bg-warning/10', href: '/dashboard/messages' },
  ]

  return (
    <div>
      <PageTitle>Tableau de bord</PageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              prefetch={false}
              className="premium-card p-4 sm:p-6 rounded-xl animate-fade-in block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 ${stat.bg}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.tone}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-base-content/60">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section>
          <h2 className="font-heading font-semibold mb-3 flex items-center gap-2">
            <FiHeadphones className="w-4 h-4 text-primary" />
            Clients qui attendent quelqu&apos;un
          </h2>
          {waiting.length === 0 ? (
            <Empty>Personne n&apos;attend pour le moment.</Empty>
          ) : (
            <ul className="space-y-2">
              {waiting.slice(0, 5).map(row => (
                <li key={row.id}>
                  <Link
                    href={`/dashboard/support/${row.id}`}
                    prefetch={false}
                    className="premium-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-sm truncate">{row.visitor}</span>
                      <span className="block text-xs text-base-content/60 truncate">
                        {row.lastMessage}
                      </span>
                    </span>
                    <FiChevronRight className="w-4 h-4 text-base-content/40 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-heading font-semibold mb-3 flex items-center gap-2">
            <FiMail className="w-4 h-4 text-primary" />
            Derniers messages
          </h2>
          {unread.length === 0 ? (
            <Empty>Aucun nouveau message.</Empty>
          ) : (
            <ul className="space-y-2">
              {unread.slice(0, 5).map(row => (
                <li key={row.id}>
                  <Link
                    href="/dashboard/messages"
                    prefetch={false}
                    className="premium-card rounded-xl p-3 sm:p-4 block"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-sm truncate">
                        {String(row.data.name || row.name || 'Sans nom')}
                      </span>
                      <span className="text-xs text-base-content/50 shrink-0">
                        {formatDate(row.createdAt)}
                      </span>
                    </span>
                    <span className="block text-xs text-base-content/60 truncate mt-0.5">
                      {String(row.data.message ?? '')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {soldOut.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading font-semibold mb-3 flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-error" />
            En rupture
          </h2>
          <div className="flex flex-wrap gap-2">
            {soldOut.map(row => (
              <Link
                key={row.id}
                href={`/dashboard/products/${row.id}`}
                prefetch={false}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-error/10 text-error hover:bg-error/20 transition-colors"
              >
                {row.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
