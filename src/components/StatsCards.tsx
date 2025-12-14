'use client'

import { FiPackage, FiAlertCircle, FiStar, FiTrendingUp } from 'react-icons/fi'

interface StatsCardsProps {
  totalProducts: number
  outOfStock: number
  avgRating: number
  newProducts: number
}

export function StatsCards({
  totalProducts,
  outOfStock,
  avgRating,
  newProducts,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Produits',
      value: totalProducts,
      icon: FiPackage,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Rupture de Stock',
      value: outOfStock,
      icon: FiAlertCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Note Moyenne',
      value: avgRating.toFixed(1),
      icon: FiStar,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Nouveaux (7j)',
      value: newProducts,
      icon: FiTrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="premium-card p-4 sm:p-6 rounded-xl animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-base-content/60">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}


