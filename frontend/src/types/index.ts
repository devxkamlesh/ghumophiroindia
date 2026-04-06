// ─── Banners ──────────────────────────────────────────────────────────────────

export interface Banner {
  id: number
  title: string
  subtitle?: string | null
  description?: string | null
  image: string
  linkUrl?: string | null
  linkText?: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PlaceCard {
  id: number
  title: string
  subtitle?: string | null
  image: string
  linkUrl: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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
  destinations: string[]      // legacy text array — kept for backward compat
  locationIds?: number[]      // new: linked location IDs
  tourLocations?: TourLocation[] // new: full location objects (joined)
  rating?: string | number | null
  reviewCount?: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface TourCategory {
  category: string   // slug, e.g. "city" | "heritage" | "desert" | "custom"
  label: string      // human-friendly label, e.g. "City Tours"
  count: number      // number of active tours in this category
  image: string | null
}

export interface TourLocation {
  id:       number
  name:     string
  slug:     string
  type:     LocationType
  path:     string
  lat:      string | null
  lng:      string | null
  parentId: number | null
}

export interface Itinerary {
  day: number
  title: string
  description: string
  activities: string[]           // location names (for display)
  meals?: string[]               // ['breakfast','lunch','dinner']
  locationId?: number | null     // main location for this day
  activityLocationIds?: number[] // location IDs for activities
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'superadmin'
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
  numberOfAdults?: number | null
  numberOfChildren?: number | null
  startDate: string
  endDate: string
  departureCity?: string | null
  roomsCount?: number | null
  travelGoing?: string | null
  travelReturn?: string | null
  addons?: Record<string, number> | null
  passengers?: Array<{ name?: string; mobile?: string; gender?: string; age?: string; type?: 'adult' | 'child' }> | null
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
  // Rich booking selection (optional)
  numberOfAdults?: number
  numberOfChildren?: number
  departureCity?: string
  roomsCount?: number
  travelGoing?: string
  travelReturn?: string
  addons?: Record<string, number>
  passengers?: Array<{ name?: string; mobile?: string; gender?: string; age?: string; type?: 'adult' | 'child' }>
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

// ─── Locations ────────────────────────────────────────────────────────────────

export type LocationType = 'country' | 'state' | 'city' | 'place'

export interface LocationNode {
  id:          number
  name:        string
  slug:        string
  type:        LocationType
  parentId:    number | null
  path:        string
  lat:         string | null
  lng:         string | null
  description: string | null
  image:       string | null
  isActive:    boolean
  isPopular:   boolean
  createdAt:   string
  // client-only — built from flat list
  children?:   LocationNode[]
}

// ─── Map ──────────────────────────────────────────────────────────────────────
// Mirrors backend MapCore / MapPlace / MapTour / MapFull from map.cache.ts

export interface MapCenter {
  lat: number | null
  lng: number | null
}

export interface MapLocation {
  id:   number
  name: string
  slug: string
  type: string   // country | state | city | place
  path: string   // materialized path e.g. "india/rajasthan/jaipur"
}

export interface MapSummary {
  totalTours:      number
  avgPrice:        number
  popularityScore: number
}

/** Lightweight place marker — used for map pins */
export interface MapPlace {
  id:   number
  name: string
  slug: string
  type: string
  lat:  number | null
  lng:  number | null
}

/** Tour card shown in map overlay / sidebar */
export interface MapTour {
  id:       number
  title:    string
  slug:     string
  price:    string   // decimal string from DB e.g. "12500.00"
  rating:   string | null
  duration: number
}

/** Core payload — returned by GET /locations/map/:slug (fast, no places/tours) */
export interface MapCore {
  center:   MapCenter
  location: MapLocation
  summary:  MapSummary
  cachedAt: string
}

/** Full payload — returned by GET /locations/map/:slug/full */
export interface MapFull extends MapCore {
  places: MapPlace[]
  tours:  MapTour[]
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
  data: T[]
  pagination: PaginationMeta
}
