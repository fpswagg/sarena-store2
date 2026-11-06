import { notFound } from 'next/navigation'
import { MemberForm } from '@/components/dashboard/MemberForm'
import { PageTitle } from '@/components/dashboard/fields'
import { listMembers } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await dashboardAccess()
  if (!access.ok) return null
  const members = await listMembers(access.storeId)
  const member = members.find(row => row.id === id)
  if (!member) notFound()
  return (
    <div>
      <PageTitle>{member.name}</PageTitle>
      <MemberForm member={member} />
    </div>
  )
}
