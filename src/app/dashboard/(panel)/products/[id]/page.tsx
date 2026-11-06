import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/dashboard/ProductForm'
import { PageTitle } from '@/components/dashboard/fields'
import { getProduct } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'
import { SssApiError } from '@/lib/sss-auth'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await dashboardAccess()
  if (!access.ok) return null
  const product = await getProduct(access.storeId, id).catch(err => {
    if (err instanceof SssApiError && err.status === 404) notFound()
    throw err
  })
  return (
    <div>
      <PageTitle>Éditer le produit</PageTitle>
      <ProductForm product={product} />
    </div>
  )
}
