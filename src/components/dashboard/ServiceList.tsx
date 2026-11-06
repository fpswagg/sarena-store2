'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEdit2, FiEyeOff, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { deleteService } from '@/app/dashboard/actions'
import type { DashRecord } from '@/lib/dashboard/data'
import { ConfirmDialog } from './ConfirmDialog'
import { Empty } from './fields'

export function ServiceList({ services }: { services: DashRecord[] }) {
  const router = useRouter()
  const [target, setTarget] = useState<DashRecord | null>(null)

  if (services.length === 0) return <Empty>Aucun service pour le moment.</Empty>

  return (
    <>
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
        {services.map(service => (
          <article
            key={service.id}
            className={`premium-card rounded-xl p-4 sm:p-5 flex gap-3 ${
              service.data.active === false ? 'opacity-60' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-semibold flex items-center gap-2">
                <span className="truncate">{service.name}</span>
                {service.data.active === false && (
                  <FiEyeOff className="w-3.5 h-3.5 shrink-0" title="Masqué" />
                )}
              </h2>
              {typeof service.data.area === 'string' && service.data.area && (
                <p className="text-xs text-primary font-medium mt-0.5">{service.data.area}</p>
              )}
              <p className="text-xs sm:text-sm text-base-content/60 mt-1.5 line-clamp-2">
                {String(service.data.description ?? '')}
              </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Link
                href={`/dashboard/services/${service.id}`}
                prefetch={false}
                className="btn btn-ghost btn-sm btn-square"
                aria-label={`Éditer ${service.name}`}
              >
                <FiEdit2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setTarget(service)}
                className="btn btn-ghost btn-sm btn-square text-error"
                aria-label={`Supprimer ${service.name}`}
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={target !== null}
        title="Supprimer le service"
        subject={target?.name ?? ''}
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return
          const result = await deleteService(target.id)
          if (result.ok) {
            toast.success('Service supprimé')
            setTarget(null)
            router.refresh()
          } else {
            toast.error(result.error)
          }
        }}
      />
    </>
  )
}
