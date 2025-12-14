import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { getProduct } from '@/app/actions/products'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireDashboardAccess()
  const productResult = await getProduct(id)

  if (!productResult.success || !productResult.product) {
    notFound()
  }

  const product = productResult.product

  // Check permissions
  if (user.role === 'SUPPLIER' && product.supplierId !== user.id) {
    notFound()
  }

  // Get suppliers if admin (includes both ADMIN and SUPPLIER roles)
  const suppliers =
    user.role === 'ADMIN'
      ? await prisma.user.findMany({
          where: {
            role: {
              in: ['ADMIN', 'SUPPLIER'],
            },
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
          orderBy: [
            { role: 'asc' }, // Admins first
            { fullName: 'asc' },
          ],
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


