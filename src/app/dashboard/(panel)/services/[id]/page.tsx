import { notFound } from 'next/navigation'
import { ServiceForm } from '@/components/dashboard/ServiceForm'
import { PageTitle } from '@/components/dashboard/fields'
import { getRecord } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'
import { SssApiError } from '@/lib/sss-auth'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await dashboardAccess()
  if (!access.ok) return null
  const service = await getRecord(access.storeId, 'service', id).catch(err => {
    if (err instanceof SssApiError && err.status === 404) notFound()
    throw err
  })
  return (
    <div>
      <PageTitle>Éditer le service</PageTitle>
      <ServiceForm service={service} />
    </div>
  )
}
