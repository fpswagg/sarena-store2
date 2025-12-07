'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// Record a product interaction (view, click)
export async function recordInteraction(productId: string) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    // Create interaction record
    await prisma.interaction.create({
      data: {
        productId,
        userIp: ip,
      },
    })

    // Update product stats
    await prisma.productStat.upsert({
      where: { productId },
      update: {
        clicks: { increment: 1 },
      },
      create: {
        productId,
        clicks: 1,
        views: 0,
        complaints: 0,
        ratingAvg: 0,
      },
    })

    // Log the interaction if user is logged in
    const { user: session } = await getSession()
    if (session?.id) {
      await prisma.log.create({
        data: {
          userId: session.id,
          userRole: session.role,
          action: 'CLICK',
          target: 'Product',
          targetId: productId,
          ip,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error recording interaction:', error)
    return { success: false, error: 'Failed to record interaction' }
  }
}

// Record a product view
export async function recordView(productId: string) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    // Update product stats
    await prisma.productStat.upsert({
      where: { productId },
      update: {
        views: { increment: 1 },
      },
      create: {
        productId,
        views: 1,
        clicks: 0,
        complaints: 0,
        ratingAvg: 0,
      },
    })

    // Log the view if user is logged in
    const { user: session } = await getSession()
    if (session?.id) {
      await prisma.log.create({
        data: {
          userId: session.id,
          userRole: session.role,
          action: 'VIEW',
          target: 'Product',
          targetId: productId,
          ip,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error recording view:', error)
    return { success: false, error: 'Failed to record view' }
  }
}
