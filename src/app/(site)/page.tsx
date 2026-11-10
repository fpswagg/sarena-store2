import { getSite } from '@/lib/sss'
import { HomePage } from './HomePage'

export default async function Page() {
  const site = await getSite()
  return (
    <HomePage
      products={site.products}
      services={site.services}
      team={site.team}
      clients={site.clients}
      hasAssistant={Boolean(site.chatbot)}
    />
  )
}
