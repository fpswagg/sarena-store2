import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { StatsCards } from '@/components/StatsCards'
import { LogsTable } from '@/components/LogsTable'
import { getLogs } from '@/app/actions/logs'

export default async function DashboardPage() {
  const user = await requireDashboardAccess()

  // Get statistics based on role
  const whereClause = user.role === 'SUPPLIER' ? { supplierId: user.id } : {}

  // Get products for stats
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      stats: true,
    },
  })

  const totalProducts = products.length
  const outOfStock = products.filter(p => p.stock === 0).length
  const newProducts = products.filter(
    p => p.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  // Calculate average rating from stats
  const statsWithRatings = products.filter(p => p.stats && p.stats.ratingAvg > 0)
  const avgRatingValue =
    statsWithRatings.length > 0
      ? statsWithRatings.reduce((sum, p) => sum + (p.stats?.ratingAvg || 0), 0) /
        statsWithRatings.length
      : 0

  // Get recent logs for admin
  const recentLogs =
    user.role === 'ADMIN' ? await getLogs(10) : { success: true, logs: [] }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4 sm:mb-8">Tableau de bord</h1>

      <StatsCards
        totalProducts={totalProducts}
        outOfStock={outOfStock}
        avgRating={avgRatingValue}
        newProducts={newProducts}
      />

      {user.role === 'ADMIN' && recentLogs.success && (
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-heading font-bold mb-4">Logs récents</h2>
          <LogsTable logs={recentLogs.logs} />
        </div>
      )}
    </div>
  )
}

