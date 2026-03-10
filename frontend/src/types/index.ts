// ─── Tours ────────────────────────────────────────────────────────────────────

export interface Tour {
  id: number
  title: string
  slug: string
  description: string
  longDescription?: string
  category: string
  difficulty: string
  duration: number
  price: string | number
  maxGroupSize: number
  images: string[]
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: Itinerary[]
  destinations: string[]
  rating?: string | number | null
  reviewCount?: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface Itinerary {
  day: number
  title: string
  description: string
  activities: string[]
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  phone?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Booking {
  id: number
  tourId: number
  userId?: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCountry: string
  numberOfTravelers: number
  startDate: string
  endDate: string
  totalPrice: string
  specialRequests?: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  // Joined fields from getUserBookings
  tour?: {
    id: number
    title: string
    destination: string
    duration: number
  } | null
}

export interface CreateBookingInput {
  tourId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCountry: string
  numberOfTravelers: number
  startDate: string
  specialRequests?: string
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export interface Inquiry {
  name: string
  email: string
  phone: string
  country?: string
  tourInterest?: string
  message: string
}

// ─── Custom Tours ─────────────────────────────────────────────────────────────

export interface CustomTourRequest {
  name: string
  email: string
  phone: string
  country: string
  numberOfTravelers: number
  duration: number
  budget: string
  destinations: string[]
  interests?: string[]
  startDate?: string
  additionalInfo?: string
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export interface Destination {
  id: number
  name: string
  slug: string
  subtitle: string
  description: string
  image: string
  tourCount: number
  isPopular: boolean
  createdAt: string
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedData<T> {
  pagination: PaginationMeta
}
