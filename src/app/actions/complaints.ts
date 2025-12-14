'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createLog, getClientIp } from '@/lib/utils/logs'

// Submit a complaint (with or without product, user can choose admin)
export async function submitComplaint(message: string, productId?: string, adminId?: string) {
  try {
    // Check authentication
    const { user: session } = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Vous devez être connecté pour envoyer une plainte.' }
    }

    // Check if user is a supplier (suppliers cannot complain)
    if (session.role === 'SUPPLIER') {
      return { success: false, error: 'Les fournisseurs ne peuvent pas envoyer de plaintes.' }
    }

    // Validate message
    if (!message || message.trim().length < 10) {
      return { success: false, error: 'Le message doit contenir au moins 10 caractères.' }
    }

    // Get assigned admin (either specified or first admin as default)
    let assignedAdmin
    if (adminId) {
      assignedAdmin = await prisma.user.findFirst({
        where: { id: adminId, role: 'ADMIN' },
      })
    }

    if (!assignedAdmin) {
      // Fallback to first admin
      assignedAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'asc' },
      })
    }

    if (!assignedAdmin) {
      return { success: false, error: 'Aucun administrateur disponible.' }
    }

    // If productId is provided, verify it exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        return { success: false, error: 'Produit introuvable.' }
      }
    }

    const headersList = await headers()
    const ip = getClientIp(headersList)

    // Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        message: message.trim(),
        userId: session.id,
        productId: productId || null,
        assignedAdminId: assignedAdmin.id,
        status: 'RECEIVED',
      },
    })

    // Update product stats if complaint is about a product
    if (productId) {
      await prisma.productStat.upsert({
        where: { productId },
        update: {
          complaints: { increment: 1 },
        },
        create: {
          productId,
          complaints: 1,
          views: 0,
          clicks: 0,
          ratingAvg: 0,
        },
      })
    }

    // Log the complaint
    await createLog(
      session.id,
      session.role,
      'COMPLAINT',
      productId ? 'Product' : 'General',
      productId || undefined,
      ip
    )

    revalidatePath('/')
    return { success: true, complaintId: complaint.id }
  } catch (error) {
    console.error('Error submitting complaint:', error)
    return { success: false, error: "Erreur lors de l'envoi de la plainte." }
  }
}

// Get complaints (for admins)
export async function getComplaints(status?: string) {
  try {
    const { user: session } = await getSession()
    if (!session?.id || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized', complaints: [] }
    }

    const complaints = await prisma.complaint.findMany({
      where: status ? { status: status as 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED' } : undefined,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
          },
        },
        assignedAdmin: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, complaints }
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return { success: false, error: 'Failed to fetch complaints', complaints: [] }
  }
}

// Reassign complaint to another admin
export async function reassignComplaint(complaintId: string, newAdminId: string) {
  try {
    const { user: session } = await getSession()
    if (!session?.id || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify the new admin exists and is an admin
    const newAdmin = await prisma.user.findFirst({
      where: { id: newAdminId, role: 'ADMIN' },
    })

    if (!newAdmin) {
      return { success: false, error: 'Admin introuvable.' }
    }

    // Update complaint
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { assignedAdminId: newAdminId },
    })

    const headersList = await headers()
    const ip = getClientIp(headersList)

    // Log the reassignment
    await createLog(session.id, session.role, 'REASSIGN', 'Complaint', complaintId, ip)

    revalidatePath('/dashboard/complaints')
    return { success: true }
  } catch (error) {
    console.error('Error reassigning complaint:', error)
    return { success: false, error: 'Erreur lors de la réassignation.' }
  }
}

// Update complaint status
export async function updateComplaintStatus(
  complaintId: string,
  status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED'
) {
  try {
    const { user: session } = await getSession()
    if (!session?.id || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    })

    const headersList = await headers()
    const ip = getClientIp(headersList)

    // Log the status update
    await createLog(session.id, session.role, 'UPDATE_STATUS', 'Complaint', complaintId, ip)

    revalidatePath('/dashboard/complaints')
    return { success: true }
  } catch (error) {
    console.error('Error updating complaint status:', error)
    return { success: false, error: 'Erreur lors de la mise à jour.' }
  }
}

// Delete complaint (Admin only)
export async function deleteComplaint(complaintId: string) {
  try {
    const { user: session } = await getSession()
    if (!session?.id || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get complaint to check if it has a product
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { productId: true },
    })

    if (!complaint) {
      return { success: false, error: 'Plainte introuvable.' }
    }

    // Delete complaint
    await prisma.complaint.delete({
      where: { id: complaintId },
    })

    // Update product stats if complaint was about a product
    if (complaint.productId) {
      await prisma.productStat.updateMany({
        where: { productId: complaint.productId },
        data: {
          complaints: { decrement: 1 },
        },
      })
    }

    const headersList = await headers()
    const ip = getClientIp(headersList)

    // Log the deletion
    await createLog(session.id, session.role, 'DELETE', 'Complaint', complaintId, ip)

    revalidatePath('/dashboard/complaints')
    return { success: true }
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return { success: false, error: 'Erreur lors de la suppression.' }
  }
}

// Update complaint message (Admin only)
export async function updateComplaintMessage(complaintId: string, message: string) {
  try {
    const { user: session } = await getSession()
    if (!session?.id || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate message
    if (!message || message.trim().length < 10) {
      return { success: false, error: 'Le message doit contenir au moins 10 caractères.' }
    }

    // Update complaint
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { message: message.trim() },
    })

    const headersList = await headers()
    const ip = getClientIp(headersList)

    // Log the update
    await createLog(session.id, session.role, 'UPDATE', 'Complaint', complaintId, ip)

    revalidatePath('/dashboard/complaints')
    return { success: true }
  } catch (error) {
    console.error('Error updating complaint message:', error)
    return { success: false, error: 'Erreur lors de la mise à jour.' }
  }
}
