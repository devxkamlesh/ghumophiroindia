// App-wide constants
export const APP_NAME = 'Ghumo Phiro India'
export const APP_DESCRIPTION = 'Curated travel experiences across Incredible India'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const INQUIRY_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
} as const

export const TOUR_DIFFICULTY = {
  EASY: 'easy',
  MODERATE: 'moderate',
  CHALLENGING: 'challenging',
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

export const CONTACT = {
  PHONE: '+91 98765 43210',
  EMAIL: 'info@ghumophiroindia.com',
  WHATSAPP: 'https://wa.me/919876543210',
} as const
