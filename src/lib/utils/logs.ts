import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

/**
 * Create a log entry
 */
export async function createLog(
  userId: string,
  userRole: Role,
  action: string,
  target: string,
  targetId?: string,
  ip?: string
) {
  try {
    await prisma.log.create({
      data: {
        userId,
        userRole,
        action,
        target,
        targetId: targetId || null,
        ip: ip || null,
      },
    })
  } catch (error) {
    console.error('Error creating log:', error)
    // Don't throw - logging should not break the app
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string | undefined {
  // Try various headers that might contain the IP
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  return undefined
}

