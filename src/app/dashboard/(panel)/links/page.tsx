import { LinksManager } from '@/components/dashboard/LinksManager'
import { PageTitle } from '@/components/dashboard/fields'
import { listLinks } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function LinksPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const links = await listLinks(access.storeId)
  return (
    <div>
      <PageTitle>Liens</PageTitle>
      <LinksManager links={links} />
    </div>
  )
}
