import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { getProducts } from '@/app/actions/products'
import { ProductTable } from '@/components/ProductTable'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

export default async function ProductsPage() {
  const user = await requireDashboardAccess()
  const result = await getProducts()
  const products = result.success ? result.products : []

  // Filter products by role
  const filteredProducts =
    user.role === 'ADMIN'
      ? products
      : products.filter(p => p.supplierId === user.id)

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Produits</h1>
        <Link href="/dashboard/products/new" className="btn btn-primary btn-sm sm:btn-md gap-2 w-full sm:w-auto">
          <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Nouveau produit</span>
        </Link>
      </div>

      <ProductTable
        products={filteredProducts}
        userRole={user.role}
        currentUserId={user.id}
      />
    </div>
  )
}

