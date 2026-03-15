export interface Tour {
  id: number
  title: string
  slug: string
  description: string
  longDescription?: string
  duration: number
  price: number
  maxGroupSize: number
  difficulty: 'easy' | 'moderate' | 'challenging'
  category: 'city' | 'heritage' | 'desert' | 'custom'
  images: string[]
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: ItineraryDay[]
  destinations: string[]
  rating?: number
  reviewCount: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
}

export interface Booking {
  id: number
  tourId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCountry: string
  numberOfTravelers: number
  startDate: Date
  endDate: Date
  totalPrice: number
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: number
  tourId: number
  bookingId?: number
  customerName: string
  customerCountry: string
  rating: number
  title: string
  comment: string
  images?: string[]
  isVerified: boolean
  isPublished: boolean
  createdAt: Date
}

export interface Destination {
  id: number
  name: string
  slug: string
  subtitle: string
  description: string
  image: string
  tourCount: number
  isPopular: boolean
  createdAt: Date
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  category: string
  tags?: string[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  country?: string
  tourInterest?: string
  message: string
  status: 'new' | 'contacted' | 'converted' | 'closed'
  createdAt: Date
}

export interface CustomTourRequest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  numberOfTravelers: number
  duration: number
  budget: string
  destinations: string[]
  interests?: string[]
  startDate?: Date
  additionalInfo?: string
  status: 'new' | 'processing' | 'quoted' | 'confirmed' | 'closed'
  createdAt: Date
}
