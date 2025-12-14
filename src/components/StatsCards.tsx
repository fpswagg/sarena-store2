'use client'

import { FiPackage, FiAlertCircle, FiStar, FiSparkles } from 'react-icons/fi'

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
      icon: FiSparkles,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="premium-card p-6 rounded-xl animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-base-content/60">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

