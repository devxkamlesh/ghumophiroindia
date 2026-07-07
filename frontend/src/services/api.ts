import axios from 'axios'
import { clearAuth } from '@/lib/auth'
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
  Banner,
  TourCategory,
  PlaceCard,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.origin}/api/v1`
    : 'http://localhost:4000/api/v1')

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  // Send httpOnly auth cookies (gpi_at / gpi_rt) on every request.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor: unwrap envelope + handle 401 ───────────────────────
let isRefreshing = false
let failedQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Auto-refresh on 401, but only once per request (_retry flag).
    // The refresh token travels as an httpOnly cookie, so there is nothing to
    // read or attach here — the browser sends it automatically.
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Never try to refresh the refresh call itself.
      if (typeof originalRequest.url === 'string' && originalRequest.url.includes('/auth/refresh')) {
        clearAuth()
        if (typeof window !== 'undefined') {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }

      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes.
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
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
    const wrapped = new Error(message)
    // Surface field-level validation errors (Record<field, string[]>) so
    // callers can map them onto individual form fields.
    const fieldErrors = error.response?.data?.errors
    if (fieldErrors) (wrapped as any).fieldErrors = fieldErrors
    return Promise.reject(wrapped)
  }
)

// ─── Tours ────────────────────────────────────────────────────────────────────

export const tourService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
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

  getCategories: async (): Promise<TourCategory[]> => {
    const { data } = await api.get('/tours/categories')
    return data.data.categories ?? []
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
  bulkImport: async (locations: Partial<LocationNode>[]): Promise<{
    success: LocationNode[]
    failed: { row: number; data: any; error: string }[]
    skipped: { row: number; data: any; reason: string }[]
  }> => {
    const { data } = await api.post('/locations/bulk-import', { locations })
    return data.data
  },
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export const bannerService = {
  getActive: async (): Promise<Banner[]> => {
    const { data } = await api.get('/banners/active')
    return data.data?.banners ?? []
  },
  getAll: async (): Promise<Banner[]> => {
    const { data } = await api.get('/banners')
    return data.data?.banners ?? []
  },
  getById: async (id: number): Promise<Banner> => {
    const { data } = await api.get(`/banners/${id}`)
    return data.data.banner
  },
  create: async (input: Partial<Banner>): Promise<Banner> => {
    const { data } = await api.post('/banners', input)
    return data.data.banner
  },
  update: async (id: number, input: Partial<Banner>): Promise<Banner> => {
    const { data } = await api.patch(`/banners/${id}`, input)
    return data.data.banner
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/banners/${id}`)
  },
  reorder: async (orders: { id: number; displayOrder: number }[]): Promise<void> => {
    await api.post('/banners/reorder', { orders })
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

// ─── Admin Management (superadmin only) ──────────────────────────────────────

export const adminService = {
  getUsers: async () => {
    const { data } = await api.get('/admin/users')
    return data.data.users as Array<{ id: number; name: string; email: string; role: string; isActive: boolean; createdAt: string }>
  },
  setRole: async (userId: number, role: 'admin' | 'user') => {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role })
    return data.data.user
  },
  deactivate: async (userId: number) => {
    await api.delete(`/admin/users/${userId}`)
  },
}

// ─── Gallery (Cloudinary) ─────────────────────────────────────────────────────

export interface GalleryImage {
  publicId:  string
  url:       string
  format:    string
  width:     number
  height:    number
  bytes:     number
  folder:    string
  tags:      string[]
  context:   Record<string, string>
  createdAt: string
}

export interface GalleryFolder {
  name: string
  path: string
}

export const galleryService = {
  getFolders: async (): Promise<GalleryFolder[]> => {
    const { data } = await api.get('/gallery/folders')
    return data.data.folders ?? []
  },

  getStats: async () => {
    const { data } = await api.get('/gallery/stats')
    return data.data.stats
  },

  getImages: async (folder = 'general', nextCursor?: string): Promise<{
    images: GalleryImage[]
    nextCursor: string | null
  }> => {
    const { data } = await api.get('/gallery', {
      params: { folder, ...(nextCursor ? { next_cursor: nextCursor } : {}) },
    })
    return { images: data.data.images ?? [], nextCursor: data.data.nextCursor ?? null }
  },

  upload: async (
    files: File[],
    folder: string,
    tags: string[],
    onProgress?: (pct: number) => void
  ): Promise<GalleryImage[]> => {
    const formData = new FormData()
    files.forEach(f => formData.append('images', f))
    formData.append('folder', folder)
    if (tags.length) formData.append('tags', JSON.stringify(tags))

    const { data } = await api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data.data.images ?? []
  },

  update: async (publicId: string, input: { tags?: string[]; title?: string; altText?: string }) => {
    const encoded = btoa(publicId)
    const { data } = await api.patch(`/gallery/${encoded}`, input)
    return data.data
  },

  delete: async (publicId: string): Promise<void> => {
    const encoded = btoa(publicId)
    await api.delete(`/gallery/${encoded}`)
  },

  bulkDelete: async (publicIds: string[]): Promise<void> => {
    await api.post('/gallery/bulk-delete', { publicIds })
  },

  createFolder: async (folder: string): Promise<void> => {
    await api.post('/gallery/create-folder', { folder })
  },

  moveImages: async (publicIds: string[], targetFolder: string): Promise<void> => {
    await api.post('/gallery/move', { publicIds, targetFolder })
  },
}

// ─── Place Cards ("Wonderful Place For You") ─────────────────────────────────

export const placeCardService = {
  getActive: async (): Promise<PlaceCard[]> => {
    const { data } = await api.get('/place-cards/active')
    return data.data?.placeCards ?? []
  },
  getAll: async (): Promise<PlaceCard[]> => {
    const { data } = await api.get('/place-cards')
    return data.data?.placeCards ?? []
  },
  getById: async (id: number): Promise<PlaceCard> => {
    const { data } = await api.get(`/place-cards/${id}`)
    return data.data.placeCard
  },
  create: async (input: Partial<PlaceCard>): Promise<PlaceCard> => {
    const { data } = await api.post('/place-cards', input)
    return data.data.placeCard
  },
  update: async (id: number, input: Partial<PlaceCard>): Promise<PlaceCard> => {
    const { data } = await api.patch(`/place-cards/${id}`, input)
    return data.data.placeCard
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/place-cards/${id}`)
  },
  reorder: async (orders: { id: number; displayOrder: number }[]): Promise<void> => {
    await api.post('/place-cards/reorder', { orders })
  },
}

export default api
