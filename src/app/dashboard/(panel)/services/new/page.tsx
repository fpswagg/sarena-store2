import { ServiceForm } from '@/components/dashboard/ServiceForm'
import { PageTitle } from '@/components/dashboard/fields'

export default function NewServicePage() {
  return (
    <div>
      <PageTitle>Nouveau service</PageTitle>
      <ServiceForm />
    </div>
  )
}
