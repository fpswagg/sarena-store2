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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">Produits</h1>
        <Link href="/dashboard/products/new" className="btn btn-primary gap-2">
          <FiPlus className="w-5 h-5" />
          Nouveau produit
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

