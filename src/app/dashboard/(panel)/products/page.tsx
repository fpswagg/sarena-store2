import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { ProductTable } from '@/components/dashboard/ProductTable'
import { PageTitle } from '@/components/dashboard/fields'
import { listProducts } from '@/lib/dashboard/data'
import { dashboardAccess } from '@/lib/dashboard/session'

export default async function ProductsPage() {
  const access = await dashboardAccess()
  if (!access.ok) return null
  const products = await listProducts(access.storeId)
  return (
    <div>
      <PageTitle
        action={
          <Link href="/dashboard/products/new" prefetch={false} className="btn btn-primary gap-2">
            <FiPlus className="w-5 h-5" />
            Nouveau produit
          </Link>
        }
      >
        Produits
      </PageTitle>
      <ProductTable products={products} />
    </div>
  )
}
