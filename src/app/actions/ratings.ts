'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { RatingLevel } from '@prisma/client'
import { ratingLevelToNumber } from '@/types'

// Submit a rating for a product
export async function submitRating(productId: string, level: string, comment: string) {
  try {
    // Check authentication
    const { user: session } = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Vous devez être connecté pour noter un produit.' }
    }

    // Check if user is a supplier (suppliers cannot rate)
    if (session.role === 'SUPPLIER') {
      return { success: false, error: 'Les fournisseurs ne peuvent pas noter les produits.' }
    }

    // Validate rating level
    const validLevels: RatingLevel[] = ['CAILLOU', 'TORTUE', 'COOL', 'FEU', 'LEGENDAIRE']
    if (!validLevels.includes(level as RatingLevel)) {
      return { success: false, error: 'Niveau de note invalide.' }
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { supplier: true },
    })

    if (!product) {
      return { success: false, error: 'Produit introuvable.' }
    }

    // Suppliers cannot rate their own products
    if (product.supplierId === session.id) {
      return { success: false, error: 'Vous ne pouvez pas noter vos propres produits.' }
    }

    // Check if user already rated this product
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: session.id,
        productId,
      },
    })

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    if (existingRating) {
      // Update existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          level: level as RatingLevel,
          comment: comment || null,
        },
      })
    } else {
      // Create new rating
      await prisma.rating.create({
        data: {
          userId: session.id,
          productId,
          level: level as RatingLevel,
          comment: comment || null,
        },
      })
    }

    // Update product stats with new average
    const allRatings = await prisma.rating.findMany({
      where: { productId },
    })

    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + ratingLevelToNumber(r.level), 0) / allRatings.length
        : 0

    await prisma.productStat.upsert({
      where: { productId },
      update: {
        ratingAvg: avgRating,
      },
      create: {
        productId,
        ratingAvg: avgRating,
        views: 0,
        clicks: 0,
        complaints: 0,
      },
    })

    // Log the rating
    await prisma.log.create({
      data: {
        userId: session.id,
        userRole: session.role,
        action: 'RATE',
        target: 'Product',
        targetId: productId,
        ip,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error submitting rating:', error)
    return { success: false, error: "Erreur lors de l'envoi de la note." }
  }
}

// Get ratings for a product
export async function getProductRatings(productId: string) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, ratings }
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return { success: false, error: 'Failed to fetch ratings', ratings: [] }
  }
}

// Delete a rating (users can only delete their own ratings)
export async function deleteRating(ratingId: string) {
  try {
    // Check authentication
    const { user: session } = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Vous devez être connecté pour supprimer un avis.' }
    }

    // Get the rating to check ownership
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
      include: { product: true },
    })

    if (!rating) {
      return { success: false, error: 'Avis introuvable.' }
    }

    // Check if user owns this rating
    if (rating.userId !== session.id) {
      return { success: false, error: 'Vous ne pouvez supprimer que vos propres avis.' }
    }

    const productId = rating.productId

    // Delete the rating
    await prisma.rating.delete({
      where: { id: ratingId },
    })

    // Update product stats with new average
    const allRatings = await prisma.rating.findMany({
      where: { productId },
    })

    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + ratingLevelToNumber(r.level), 0) / allRatings.length
        : 0

    await prisma.productStat.upsert({
      where: { productId },
      update: {
        ratingAvg: avgRating,
      },
      create: {
        productId,
        ratingAvg: avgRating,
        views: 0,
        clicks: 0,
        complaints: 0,
      },
    })

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    // Log the deletion
    await prisma.log.create({
      data: {
        userId: session.id,
        userRole: session.role,
        action: 'DELETE_RATING',
        target: 'Rating',
        targetId: ratingId,
        ip,
      },
    })

    revalidatePath('/')
    revalidatePath(`/products/${productId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting rating:', error)
    return { success: false, error: "Erreur lors de la suppression de l'avis." }
  }
}
