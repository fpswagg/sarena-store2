import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { getProduct } from '@/app/actions/products'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireDashboardAccess()
  const { product } = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  // Check permissions
  if (user.role === 'SUPPLIER' && product.supplierId !== user.id) {
    notFound()
  }

  // Get suppliers if admin
  const suppliers =
    user.role === 'ADMIN'
      ? await prisma.user.findMany({
          where: { role: 'SUPPLIER' },
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        })
      : []

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4 sm:mb-8">Éditer le produit</h1>
      <ProductForm
        product={product}
        suppliers={suppliers}
        currentUser={{ id: user.id, role: user.role }}
      />
    </div>
  )
}


