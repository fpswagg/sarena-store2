'use server'

import { prisma } from '@/lib/prisma'
import { ProductWithRelations } from '@/types'

// Get all products with relations
export async function getProducts(): Promise<{
  success: boolean
  products: ProductWithRelations[]
}> {
  try {
    const products = await prisma.product.findMany({
      include: {
        supplier: true,
        ratings: true,
        complaints: true,
        interactions: true,
        stats: true,
      },
      orderBy: [{ isNew: 'desc' }, { createdAt: 'desc' }],
    })

    return { success: true, products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, products: [] }
  }
}

// Get a single product by ID
export async function getProduct(
  id: string
): Promise<{ success: boolean; product?: ProductWithRelations }> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        ratings: true,
        complaints: true,
        interactions: true,
        stats: true,
      },
    })

    if (!product) {
      return { success: false }
    }

    return { success: true, product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false }
  }
}

// Get first admin (for WhatsApp contact)
export async function getDefaultAdmin(): Promise<{
  success: boolean
  admin?: { id: string; phone: string | null; fullName: string | null }
}> {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        phone: true,
        fullName: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    if (!admin) {
      return { success: false }
    }

    return { success: true, admin }
  } catch (error) {
    console.error('Error fetching admin:', error)
    return { success: false }
  }
}

// Get all admins (for complaint selection)
export async function getAllAdmins(): Promise<{
  success: boolean
  admins: Array<{ id: string; fullName: string | null; avatar: string | null }>
}> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        fullName: true,
        avatar: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return { success: true, admins }
  } catch (error) {
    console.error('Error fetching admins:', error)
    return { success: false, admins: [] }
  }
}
