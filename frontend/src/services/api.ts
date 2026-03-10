import axios, { AxiosRequestConfig } from 'axios'
import { getToken } from '@/lib/auth'
import type {
  Tour,
  Booking,
  CreateBookingInput,
  Inquiry,
  CustomTourRequest,
  Destination,
  AuthResponse,
  AuthUser,
  PaginationMeta,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token automatically on every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap the standard { success, data, message } envelope
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Tours ────────────────────────────────────────────────────────────────────

export const tourService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    featured?: boolean
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ tours: Tour[]; pagination: PaginationMeta }> => {
    const { data } = await api.get('/tours', { params })
    return data.data // { tours: [...], pagination: {...} }
  },

  getFeatured: async (): Promise<Tour[]> => {
    const { data } = await api.get('/tours/featured')
    return data.data.tours ?? []
  },

  getBySlug: async (slug: string): Promise<Tour> => {
    const { data } = await api.get(`/tours/slug/${slug}`)
    return data.data.tour
  },

  getById: async (id: number): Promise<Tour> => {
    const { data } = await api.get(`/tours/${id}`)
    return data.data.tour
  },

  create: async (tourData: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.post('/tours', tourData)
    return data.data.tour
  },

  update: async (id: number, tourData: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.patch(`/tours/${id}`, tourData)
    return data.data.tour
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tours/${id}`)
  },

  getStats: async () => {
    const { data } = await api.get('/tours/stats')
    return data.data.stats
  },
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingService = {
  create: async (booking: CreateBookingInput): Promise<Booking> => {
    const { data } = await api.post('/bookings', booking)
    return data.data.booking
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings/my-bookings')
    return data.data.bookings ?? []
  },

  getAll: async (params?: {
    page?: number
    limit?: number
    status?: string
    paymentStatus?: string
  }): Promise<{ bookings: Booking[]; pagination: PaginationMeta }> => {
    const { data } = await api.get('/bookings', { params })
    return data.data
  },

  getById: async (id: number): Promise<Booking> => {
    const { data } = await api.get(`/bookings/${id}`)
    return data.data.booking
  },

  updateStatus: async (id: number, status: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/status`, { status })
    return data.data.booking
  },

  updatePaymentStatus: async (id: number, paymentStatus: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/payment`, { paymentStatus })
    return data.data.booking
  },

  getStats: async () => {
    const { data } = await api.get('/bookings/stats')
    return data.data.stats
  },
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  register: async (input: {
    name: string
    email: string
    password: string
    phone?: string
    country?: string
  }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', input)
    return data.data
  },

  login: async (input: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', input)
    return data.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getProfile: async (): Promise<AuthUser> => {
    const { data } = await api.get('/auth/profile')
    return data.data.user
  },

  updateProfile: async (input: Partial<AuthUser>): Promise<AuthUser> => {
    const { data } = await api.patch('/auth/profile', input)
    return data.data.user
  },

  changePassword: async (input: {
    currentPassword: string
    newPassword: string
  }): Promise<void> => {
    await api.post('/auth/change-password', input)
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password })
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await api.post(
      '/auth/refresh',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    )
    return data.data
  },
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export const inquiryService = {
  create: async (inquiry: Inquiry): Promise<void> => {
    await api.post('/inquiries', inquiry)
  },

  getAll: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get('/inquiries', { params })
    return data.data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/inquiries/${id}`)
    return data.data.inquiry
  },

  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/inquiries/${id}/status`, { status })
    return data.data.inquiry
  },
}

// ─── Custom Tours ─────────────────────────────────────────────────────────────

export const customTourService = {
  create: async (request: CustomTourRequest): Promise<void> => {
    await api.post('/custom-tours', request)
  },

  getAll: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get('/custom-tours', { params })
    return data.data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/custom-tours/${id}`)
    return data.data.request
  },

  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/custom-tours/${id}/status`, { status })
    return data.data.request
  },
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export const destinationService = {
  getAll: async (): Promise<Destination[]> => {
    const { data } = await api.get('/destinations')
    return data.data.destinations ?? []
  },

  getPopular: async (): Promise<Destination[]> => {
    const { data } = await api.get('/destinations/popular')
    return data.data.destinations ?? []
  },

  getBySlug: async (slug: string): Promise<Destination> => {
    const { data } = await api.get(`/destinations/slug/${slug}`)
    return data.data.destination
  },

  getById: async (id: number): Promise<Destination> => {
    const { data } = await api.get(`/destinations/${id}`)
    return data.data.destination
  },
}

export default api
