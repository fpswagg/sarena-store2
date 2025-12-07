'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { LogExport } from '@/types'

// Get logs (for admins and suppliers)
export async function getLogs(
  limit: number = 100
): Promise<{ success: boolean; logs: LogExport[]; error?: string }> {
  try {
    const { user: session } = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized', logs: [] }
    }

    // Only admins and suppliers can view logs
    if (session.role !== 'ADMIN' && session.role !== 'SUPPLIER') {
      return { success: false, error: 'Unauthorized', logs: [] }
    }

    // For suppliers, only show logs related to their products
    let logs
    if (session.role === 'SUPPLIER') {
      // Get supplier's product IDs
      const supplierProducts = await prisma.product.findMany({
        where: { supplierId: session.id },
        select: { id: true },
      })
      const productIds = supplierProducts.map(p => p.id)

      logs = await prisma.log.findMany({
        where: {
          OR: [{ targetId: { in: productIds } }, { userId: session.id }],
        },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } else {
      // Admins can see all logs
      logs = await prisma.log.findMany({
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    }

    const formattedLogs: LogExport[] = logs.map(log => ({
      id: log.id,
      userName: log.user.fullName,
      userRole: log.userRole,
      action: log.action,
      target: log.target,
      targetId: log.targetId,
      ip: log.ip,
      createdAt: log.createdAt,
    }))

    return { success: true, logs: formattedLogs }
  } catch (error) {
    console.error('Error fetching logs:', error)
    return { success: false, error: 'Failed to fetch logs', logs: [] }
  }
}

// Export logs as JSON or CSV (admin only)
export async function exportLogs(
  format: 'json' | 'csv'
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const { user: session } = await getSession()
    if (!session?.id || (session.role !== 'ADMIN' && session.role !== 'SUPPLIER')) {
      return { success: false, error: 'Unauthorized' }
    }

    const { logs } = await getLogs(1000) // Get more logs for export

    if (format === 'json') {
      return { success: true, data: JSON.stringify(logs, null, 2) }
    }

    // CSV format
    const headers = ['ID', 'Date', 'Utilisateur', 'Rôle', 'Action', 'Cible', 'ID Cible', 'IP']
    const rows = logs.map(log => [
      log.id,
      new Date(log.createdAt).toISOString(),
      log.userName || 'Anonyme',
      log.userRole,
      log.action,
      log.target,
      log.targetId || '',
      log.ip || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    return { success: true, data: csvContent }
  } catch (error) {
    console.error('Error exporting logs:', error)
    return { success: false, error: 'Failed to export logs' }
  }
}
