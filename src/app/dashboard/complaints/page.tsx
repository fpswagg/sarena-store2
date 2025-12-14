import { requireAdmin } from '@/lib/utils/auth'
import { getComplaints } from '@/app/actions/complaints'
import { getAllAdmins } from '@/app/actions'
import { ComplaintsTable } from '@/components/ComplaintsTable'

export default async function ComplaintsPage() {
  await requireAdmin()
  const complaintsResult = await getComplaints()
  const adminsResult = await getAllAdmins()
  
  const rawComplaints = complaintsResult.success ? complaintsResult.complaints : []
  const admins = adminsResult.success ? adminsResult.admins : []

  // Transform complaints to match expected type
  const complaints = rawComplaints.map(complaint => ({
    ...complaint,
    product: complaint.product
      ? {
          ...complaint.product,
          name:
            typeof complaint.product.name === 'string' ||
            (typeof complaint.product.name === 'object' &&
              complaint.product.name !== null &&
              !Array.isArray(complaint.product.name))
              ? (complaint.product.name as string | Record<string, string>)
              : '',
        }
      : null,
  }))

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4 sm:mb-8">Plaintes</h1>
      <ComplaintsTable complaints={complaints} admins={admins} />
    </div>
  )
}

