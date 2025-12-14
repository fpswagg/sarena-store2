import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/ProductForm'

export default async function NewProductPage() {
  const user = await requireDashboardAccess()

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
      <h1 className="text-3xl font-heading font-bold mb-8">Nouveau produit</h1>
      <ProductForm suppliers={suppliers} currentUser={user} />
    </div>
  )
}

