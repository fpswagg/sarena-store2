import { requireAdmin } from '@/lib/utils/auth'
import { getComplaints, getAllAdmins } from '@/app/actions/complaints'
import { ComplaintsTable } from '@/components/ComplaintsTable'

export default async function ComplaintsPage() {
  await requireAdmin()
  const complaintsResult = await getComplaints()
  const adminsResult = await getAllAdmins()
  
  const complaints = complaintsResult.success ? complaintsResult.complaints : []
  const admins = adminsResult.success ? adminsResult.admins : []

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold mb-8">Plaintes</h1>
      <ComplaintsTable complaints={complaints} admins={admins} />
    </div>
  )
}

