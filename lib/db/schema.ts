import { pgTable, serial, text, integer, timestamp, boolean, jsonb, decimal } from 'drizzle-orm/pg-core'

export const tours = pgTable('tours', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  duration: integer('duration').notNull(), // in days
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  maxGroupSize: integer('max_group_size').notNull(),
  difficulty: text('difficulty').notNull(), // easy, moderate, challenging
  category: text('category').notNull(), // city, heritage, desert, custom
  images: jsonb('images').$type<string[]>().notNull(),
  highlights: jsonb('highlights').$type<string[]>().notNull(),
  included: jsonb('included').$type<string[]>().notNull(),
  excluded: jsonb('excluded').$type<string[]>().notNull(),
  itinerary: jsonb('itinerary').$type<Array<{
    day: number
    title: string
    description: string
    activities: string[]
  }>>().notNull(),
  destinations: jsonb('destinations').$type<string[]>().notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }),
  reviewCount: integer('review_count').default(0),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  tourId: integer('tour_id').references(() => tours.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerCountry: text('customer_country').notNull(),
  numberOfTravelers: integer('number_of_travelers').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  specialRequests: text('special_requests'),
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled, completed
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, paid, refunded
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  tourId: integer('tour_id').references(() => tours.id),
  bookingId: integer('booking_id').references(() => bookings.id),
  customerName: text('customer_name').notNull(),
  customerCountry: text('customer_country').notNull(),
  rating: integer('rating').notNull(), // 1-5
  title: text('title').notNull(),
  comment: text('comment').notNull(),
  images: jsonb('images').$type<string[]>(),
  isVerified: boolean('is_verified').default(false),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  tourCount: integer('tour_count').default(0),
  isPopular: boolean('is_popular').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country'),
  tourInterest: text('tour_interest'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // new, contacted, converted, closed
  createdAt: timestamp('created_at').defaultNow(),
})

export const customTourRequests = pgTable('custom_tour_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  numberOfTravelers: integer('number_of_travelers').notNull(),
  duration: integer('duration').notNull(),
  budget: text('budget').notNull(),
  destinations: jsonb('destinations').$type<string[]>().notNull(),
  interests: jsonb('interests').$type<string[]>(),
  startDate: timestamp('start_date'),
  additionalInfo: text('additional_info'),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
})
