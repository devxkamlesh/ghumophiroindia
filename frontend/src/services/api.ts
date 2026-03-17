import axios from 'axios'
import { getToken, getRefreshToken, updateAccessToken, clearAuth } from '@/lib/auth'
import type {
  Tour,
  Booking,
  CreateBookingInput,
  Inquiry,
  CustomTourRequest,
  AuthResponse,
  AuthUser,
  PaginationMeta,
  MapCore,
  MapFull,
  MapPlace,
  MapTour,
  LocationNode,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach Bearer token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: unwrap envelope + handle 401 ───────────────────────
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Auto-refresh on 401, but only once per request (_retry flag)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // No refresh token — clear auth and redirect to login
        clearAuth()
        if (typeof window !== 'undefined') {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }

      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        )
        const newAccessToken: string = data.data.accessToken
        updateAccessToken(newAccessToken)
        processQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        if (typeof window !== 'undefined') {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(new Error('Session expired. Please log in again.'))
      } finally {
        isRefreshing = false
      }
    }

    // Unwrap backend error message for all other errors
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

  getTourLocations: async (tourId: number) => {
    const { data } = await api.get(`/tours/${tourId}/locations`)
    return data.data.locations ?? []
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
    // Backend getUserBookings returns: { success, data: { bookings: [...] } }
    return Array.isArray(data.data?.bookings) ? data.data.bookings
         : Array.isArray(data.data)           ? data.data
         : []
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
    return data.data  // { user, accessToken, refreshToken }
  },

  login: async (input: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', input)
    return data.data  // { user, accessToken, refreshToken }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout')
    } finally {
      // Always clear local auth regardless of server response
      clearAuth()
    }
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

// ─── Map ──────────────────────────────────────────────────────────────────────
// In-memory cache so navigating back to the same location costs 0 network calls.
// TTL matches backend Redis TTL (30 minutes).

const MAP_CACHE_TTL_MS = 30 * 60 * 1000
const mapMemCache = new Map<string, { data: MapFull; expiresAt: number }>()

export const mapService = {
  /**
   * GET /locations/map/:slug/full
   * Returns center + location + summary + places[] + tours[].
   * Results are cached in-memory for 30 minutes — no refetch on re-render.
   */
  getFull: async (slug: string): Promise<MapFull | null> => {
    const cached = mapMemCache.get(slug)
    if (cached && Date.now() < cached.expiresAt) return cached.data

    const { data } = await api.get(`/locations/map/${slug}/full`)
    const payload: MapFull | null = data.data ?? null
    if (payload) {
      mapMemCache.set(slug, { data: payload, expiresAt: Date.now() + MAP_CACHE_TTL_MS })
    }
    return payload
  },

  /**
   * GET /locations/map/:slug
   * Core only — center, location, summary. No places or tours.
   * Use for initial render before lazy-loading the rest.
   */
  getCore: async (slug: string): Promise<MapCore | null> => {
    // Check full cache first — core is a subset
    const cached = mapMemCache.get(slug)
    if (cached && Date.now() < cached.expiresAt) {
      const { places: _p, tours: _t, ...core } = cached.data
      return core
    }
    const { data } = await api.get(`/locations/map/${slug}`)
    return data.data ?? null
  },

  /**
   * GET /locations/map/:slug/places
   * Place markers only — used to render map pins.
   */
  getPlaces: async (slug: string): Promise<MapPlace[]> => {
    const cached = mapMemCache.get(slug)
    if (cached && Date.now() < cached.expiresAt) return cached.data.places

    const { data } = await api.get(`/locations/map/${slug}/places`)
    return data.data?.places ?? []
  },

  /**
   * GET /locations/map/:slug/tours
   * Tour cards only — used for sidebar / overlay list.
   */
  getTours: async (slug: string): Promise<MapTour[]> => {
    const cached = mapMemCache.get(slug)
    if (cached && Date.now() < cached.expiresAt) return cached.data.tours

    const { data } = await api.get(`/locations/map/${slug}/tours`)
    return data.data?.tours ?? []
  },

  /** Manually evict a slug from the in-memory cache (e.g. after admin rebuild). */
  invalidate: (slug: string) => {
    mapMemCache.delete(slug)
  },

  /** Clear the entire in-memory cache. */
  clearAll: () => {
    mapMemCache.clear()
  },
}

// ─── Locations ────────────────────────────────────────────────────────────────

export const locationAdminService = {
  getAll: async (): Promise<LocationNode[]> => {
    const { data } = await api.get('/locations')
    return data.data?.locations ?? []
  },
  getBySlug: async (slug: string): Promise<LocationNode> => {
    const { data } = await api.get(`/locations/slug/${slug}`)
    return data.data.location
  },
  getById: async (id: number): Promise<LocationNode> => {
    const { data } = await api.get(`/locations/${id}`)
    return data.data.location
  },
  getTours: async (locationId: number): Promise<Tour[]> => {
    const { data } = await api.get(`/locations/${locationId}/tours`)
    return data.data?.tours ?? []
  },
  create: async (input: Partial<LocationNode>): Promise<LocationNode> => {
    const { data } = await api.post('/locations', input)
    return data.data.location
  },
  update: async (id: number, input: Partial<LocationNode>): Promise<LocationNode> => {
    const { data } = await api.patch(`/locations/${id}`, input)
    return data.data.location
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/locations/${id}`)
  },
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadService = {
  image: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.url as string
  },
}

export default api
