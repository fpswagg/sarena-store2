'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ProductWithRelations } from '@/types'
import { getSession } from '@/lib/auth'
import { createLog, getClientIp } from '@/lib/utils/logs'
import { Role } from '@prisma/client'

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
): Promise<{ success: boolean; product?: ProductWithRelations; error?: string }> {
  try {
    // Validate ID format (should be UUID)
    if (!id || typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) {
      return { success: false, error: 'Invalid product ID format' }
    }

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
      return { success: false, error: 'Product not found' }
    }

    return { success: true, product }
  } catch (error) {
    console.error('Error fetching product:', error)
    // Check if it's a Prisma validation error
    if (error instanceof Error && error.message.includes('Invalid')) {
      return { success: false, error: 'Invalid product ID' }
    }
    return { success: false, error: 'Failed to fetch product' }
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

// Create product (for dashboard)
export async function createProduct(formData: FormData) {
  try {
    const { user } = await getSession()
    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    // Check permissions
    if (user.role !== Role.ADMIN && user.role !== Role.SUPPLIER) {
      return { success: false, error: 'Non autorisé' }
    }

    const nameFr = formData.get('nameFr') as string
    const nameEn = formData.get('nameEn') as string
    const shortDescFr = formData.get('shortDescFr') as string
    const shortDescEn = formData.get('shortDescEn') as string
    const longDescFr = formData.get('longDescFr') as string
    const longDescEn = formData.get('longDescEn') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const stock = parseInt(formData.get('stock') as string) || 0
    const city = formData.get('city') as string
    const thumbnail = formData.get('thumbnail') as string
    const images = (formData.get('images') as string)?.split(',').filter(Boolean) || []
    const isNewValue = formData.get('isNew')
    const isNew = isNewValue === 'true' || isNewValue === 'on'
    const supplierId = formData.get('supplierId') as string || user.id

    // Validate
    if (!nameFr || !nameEn || !city || !thumbnail) {
      return { success: false, error: 'Tous les champs requis doivent être remplis' }
    }
    if (price <= 0) {
      return { success: false, error: 'Le prix doit être supérieur à 0' }
    }
    if (stock < 0) {
      return { success: false, error: 'Le stock ne peut pas être négatif' }
    }

    // Supplier can only create products for themselves
    if (user.role === Role.SUPPLIER && supplierId !== user.id) {
      return { success: false, error: 'Non autorisé' }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: { fr: nameFr, en: nameEn },
        shortDesc: { fr: shortDescFr, en: shortDescEn },
        longDesc: { fr: longDescFr, en: longDescEn },
        price,
        stock,
        city,
        thumbnail,
        images,
        isNew,
        supplierId,
      },
    })

    // Create stats
    await prisma.productStat.create({
      data: {
        productId: product.id,
        views: 0,
        clicks: 0,
        complaints: 0,
        ratingAvg: 0,
      },
    })

    // Log
    const headersList = await headers()
    const ip = getClientIp(headersList)
    await createLog(user.id, user.role, 'CREATE', 'Product', product.id, ip)

    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard')
    return { success: true, productId: product.id }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Erreur lors de la création du produit' }
  }
}

// Update product
export async function updateProduct(id: string, formData: FormData) {
  try {
    const { user } = await getSession()
    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return { success: false, error: 'Produit introuvable' }
    }

    // Check permissions
    if (user.role === Role.SUPPLIER && existingProduct.supplierId !== user.id) {
      return { success: false, error: 'Non autorisé' }
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPPLIER) {
      return { success: false, error: 'Non autorisé' }
    }

    const nameFr = formData.get('nameFr') as string
    const nameEn = formData.get('nameEn') as string
    const shortDescFr = formData.get('shortDescFr') as string
    const shortDescEn = formData.get('shortDescEn') as string
    const longDescFr = formData.get('longDescFr') as string
    const longDescEn = formData.get('longDescEn') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const stock = parseInt(formData.get('stock') as string) || 0
    const city = formData.get('city') as string
    const thumbnail = formData.get('thumbnail') as string
    const images = (formData.get('images') as string)?.split(',').filter(Boolean) || []
    const isNewValue = formData.get('isNew')
    const isNew = isNewValue === 'true' || isNewValue === 'on'
    const supplierId = formData.get('supplierId') as string || existingProduct.supplierId

    // Validate
    if (!nameFr || !nameEn || !city || !thumbnail) {
      return { success: false, error: 'Tous les champs requis doivent être remplis' }
    }
    if (price <= 0) {
      return { success: false, error: 'Le prix doit être supérieur à 0' }
    }
    if (stock < 0) {
      return { success: false, error: 'Le stock ne peut pas être négatif' }
    }

    // Update product
    await prisma.product.update({
      where: { id },
      data: {
        name: { fr: nameFr, en: nameEn },
        shortDesc: { fr: shortDescFr, en: shortDescEn },
        longDesc: { fr: longDescFr, en: longDescEn },
        price,
        stock,
        city,
        thumbnail,
        images,
        isNew,
        supplierId: user.role === Role.ADMIN ? supplierId : existingProduct.supplierId,
      },
    })

    // Log
    const headersList = await headers()
    const ip = getClientIp(headersList)
    await createLog(user.id, user.role, 'UPDATE', 'Product', id, ip)

    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/${id}`)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Erreur lors de la mise à jour du produit' }
  }
}

// Get product relationships (for warnings)
export async function getProductRelationships(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ratings: { select: { id: true } },
        complaints: { select: { id: true } },
        interactions: { select: { id: true } },
        stats: { select: { id: true } },
      },
    })

    if (!product) {
      return { success: false, relationships: null }
    }

    return {
      success: true,
      relationships: {
        ratingsCount: product.ratings.length,
        complaintsCount: product.complaints.length,
        interactionsCount: product.interactions.length,
        hasStats: !!product.stats,
      },
    }
  } catch (error) {
    console.error('Error fetching product relationships:', error)
    return { success: false, relationships: null }
  }
}

// Delete product (Admin only) - handles all relationships
export async function deleteProduct(id: string) {
  try {
    const { user } = await getSession()
    if (!user || user.role !== Role.ADMIN) {
      return { success: false, error: 'Non autorisé' }
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ratings: true,
        complaints: true,
        interactions: true,
        stats: true,
      },
    })

    if (!product) {
      return { success: false, error: 'Produit introuvable' }
    }

    // Delete all related records first (to avoid foreign key constraints)
    // Delete ratings
    if (product.ratings.length > 0) {
      await prisma.rating.deleteMany({
        where: { productId: id },
      })
    }

    // Delete interactions
    if (product.interactions.length > 0) {
      await prisma.interaction.deleteMany({
        where: { productId: id },
      })
    }

    // Delete product stats
    if (product.stats) {
      await prisma.productStat.delete({
        where: { productId: id },
      })
    }

    // Note: Complaints are kept but their productId is set to null
    // This preserves complaint history even if product is deleted
    await prisma.complaint.updateMany({
      where: { productId: id },
      data: { productId: null },
    })

    // Now delete the product
    await prisma.product.delete({
      where: { id },
    })

    // Log
    const headersList = await headers()
    const ip = getClientIp(headersList)
    await createLog(user.id, user.role, 'DELETE', 'Product', id, ip)

    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Erreur lors de la suppression du produit' }
  }
}

// Mark product as unavailable (set stock to 0)
export async function markProductUnavailable(id: string) {
  try {
    const { user } = await getSession()
    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return { success: false, error: 'Produit introuvable' }
    }

    // Check permissions
    if (user.role === Role.SUPPLIER && product.supplierId !== user.id) {
      return { success: false, error: 'Non autorisé' }
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPPLIER) {
      return { success: false, error: 'Non autorisé' }
    }

    await prisma.product.update({
      where: { id },
      data: { stock: 0 },
    })

    // Log
    const headersList = await headers()
    const ip = getClientIp(headersList)
    await createLog(user.id, user.role, 'UPDATE', 'Product', id, ip)

    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error marking product unavailable:', error)
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}
