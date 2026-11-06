import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { ServiceList } from '@/components/dashboard/ServiceList'
import { PageTitle } from '@/components/dashboard/fields'
import { listRecords } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function ServicesPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const services = await listRecords(access.storeId, 'service')
  const order = (row: (typeof services)[number]) =>
    typeof row.metadata?.order === 'number' ? row.metadata.order : Number.MAX_SAFE_INTEGER
  return (
    <div>
      <PageTitle
        action={
          <Link href="/dashboard/services/new" prefetch={false} className="btn btn-primary gap-2">
            <FiPlus className="w-5 h-5" />
            Nouveau service
          </Link>
        }
      >
        Services
      </PageTitle>
      <ServiceList services={[...services].sort((a, b) => order(a) - order(b))} />
    </div>
  )
}
