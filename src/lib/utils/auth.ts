import { getSession } from '@/lib/auth'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const { user } = await getSession()
  if (!user) {
    redirect('/login')
  }
  return user
}

/**
 * Require specific role(s) - throws if user doesn't have required role
 */
export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect('/dashboard')
  }
  return user
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole([Role.ADMIN])
}

/**
 * Require dashboard access (ADMIN or SUPPLIER)
 */
export async function requireDashboardAccess() {
  return requireRole([Role.ADMIN, Role.SUPPLIER])
}

/**
 * Check if user has access to a resource
 */
export function hasAccess(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: Role): boolean {
  return userRole === Role.ADMIN
}

/**
 * Check if user is supplier
 */
export function isSupplier(userRole: Role): boolean {
  return userRole === Role.SUPPLIER
}


