import Image from 'next/image'
import Link from 'next/link'
import { FiChevronRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { Empty, PageTitle } from '@/components/dashboard/fields'
import { listMembers } from '@/lib/dashboard/data'
import { ROLE_LABEL, dashboardAccess } from '@/lib/dashboard/session'

export default async function TeamPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const members = await listMembers(access.storeId)
  const order = (row: (typeof members)[number]) =>
    row.metadata?.public === true
      ? typeof row.metadata.order === 'number'
        ? row.metadata.order
        : 1000
      : 2000
  const rows = [...members].sort((a, b) => order(a) - order(b))
  return (
    <div>
      <PageTitle>Équipe</PageTitle>
      <p className="text-sm text-base-content/60 -mt-2 sm:-mt-5 mb-4 sm:mb-6">
        Les membres viennent de SSS. Choisissez ici qui apparaît sur le site, et avec quelle fiche.
      </p>
      {rows.length === 0 ? (
        <Empty>Aucun membre.</Empty>
      ) : (
        <ul className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {rows.map(member => {
            const meta = member.metadata ?? {}
            const shown = meta.public === true && Boolean(member.userId)
            const name = (typeof meta.displayName === 'string' && meta.displayName) || member.name
            const photo = typeof meta.photo === 'string' ? meta.photo : null
            return (
              <li key={member.id}>
                <Link
                  href={`/dashboard/team/${member.id}`}
                  prefetch={false}
                  className="premium-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <span className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-heading font-bold shrink-0">
                    {photo ? (
                      <Image src={photo} alt="" fill className="object-cover" sizes="48px" />
                    ) : (
                      (name || '?').charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium truncate">{name}</span>
                    <span className="block text-xs text-base-content/60 truncate">
                      {typeof meta.title === 'string' && meta.title
                        ? meta.title
                        : (ROLE_LABEL[member.role] ?? member.role)}
                    </span>
                  </span>
                  {member.status === 'pending' ? (
                    <span className="badge badge-warning badge-sm border-0 shrink-0">Invité</span>
                  ) : shown ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success shrink-0">
                      <FiEye className="w-3.5 h-3.5" />
                      Sur le site
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-base-content/50 shrink-0">
                      <FiEyeOff className="w-3.5 h-3.5" />
                      Masqué
                    </span>
                  )}
                  <FiChevronRight className="w-4 h-4 text-base-content/40 shrink-0" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
