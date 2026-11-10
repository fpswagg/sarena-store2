import type { Metadata } from 'next'
import { PurchasePage } from './PurchasePage'

export const metadata: Metadata = { title: 'Achat', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <PurchasePage token={token} />
}
