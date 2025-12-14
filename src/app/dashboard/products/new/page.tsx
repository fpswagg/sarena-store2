import { getSession } from '@/lib/auth'
import { requireDashboardAccess } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/ProductForm'

export default async function NewProductPage() {
  const user = await requireDashboardAccess()

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
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4 sm:mb-8">Nouveau produit</h1>
      <ProductForm
        suppliers={suppliers}
        currentUser={{ id: user.id, role: user.role }}
      />
    </div>
  )
}


