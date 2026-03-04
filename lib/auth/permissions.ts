import { UserRole } from './config'

export const permissions = {
  // Dashboard permissions
  'dashboard:view': ['admin'],
  'dashboard:tours:create': ['admin'],
  'dashboard:tours:edit': ['admin'],
  'dashboard:tours:delete': ['admin'],
  'dashboard:bookings:view': ['admin'],
  'dashboard:bookings:edit': ['admin'],
  'dashboard:inquiries:view': ['admin'],
  'dashboard:inquiries:edit': ['admin'],
  'dashboard:analytics:view': ['admin'],
  'dashboard:settings:edit': ['admin'],

  // User panel permissions
  'account:view': ['admin', 'user'],
  'account:edit': ['admin', 'user'],
  'bookings:view:own': ['admin', 'user'],
  'bookings:create': ['admin', 'user'],
} as const

export type Permission = keyof typeof permissions

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = permissions[permission] as readonly UserRole[]
  return allowedRoles.includes(role)
}

/**
 * Check if a role can access a route
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Dashboard routes - admin only
  if (pathname.startsWith('/dashboard')) {
    return role === 'admin'
  }

  // User panel routes - authenticated users
  if (pathname.startsWith('/my-account')) {
    return role === 'admin' || role === 'user'
  }

  // Public routes - everyone
  return true
}
