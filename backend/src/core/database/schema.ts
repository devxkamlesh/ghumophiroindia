import {
  pgTable, serial, text, integer, timestamp, boolean,
  jsonb, decimal, primaryKey, index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id:            serial('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  password:      text('password').notNull(),
  phone:         text('phone'),
  role:          text('role').notNull().default('user'),
  avatar:        text('avatar'),
  address:       text('address'),
  city:          text('city'),
  country:       text('country'),
  isActive:      boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow(),
}, (t) => ({
  emailIdx:  index('idx_users_email').on(t.email),
  activeIdx: index('idx_users_is_active').on(t.isActive),
}))

// ─── Destinations ─────────────────────────────────────────────────────────────

export const destinations = pgTable('destinations', {
  id:          serial('id').primaryKey(),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  subtitle:    text('subtitle').notNull(),
  description: text('description').notNull(),
  image:       text('image').notNull(),
  tourCount:   integer('tour_count').default(0),
  isPopular:   boolean('is_popular').default(false),
  createdAt:   timestamp('created_at').defaultNow(),
}, (t) => ({
  slugIdx:    index('idx_destinations_slug').on(t.slug),
  popularIdx: index('idx_destinations_popular').on(t.isPopular),
}))

// ─── Tours ────────────────────────────────────────────────────────────────────

export const tours = pgTable('tours', {
  id:              serial('id').primaryKey(),
  title:           text('title').notNull(),
  slug:            text('slug').notNull().unique(),
  description:     text('description').notNull(),
  longDescription: text('long_description'),
  duration:        integer('duration').notNull(),
  price:           decimal('price', { precision: 10, scale: 2 }).notNull(),
  maxGroupSize:    integer('max_group_size').notNull(),
  difficulty:      text('difficulty').notNull(),
  category:        text('category').notNull(),
  images:          jsonb('images').$type<string[]>().notNull(),
  highlights:      jsonb('highlights').$type<string[]>().notNull(),
  included:        jsonb('included').$type<string[]>().notNull(),
  excluded:        jsonb('excluded').$type<string[]>().notNull(),
  itinerary:       jsonb('itinerary').$type<Array<{
    day: number; title: string; description: string; activities: string[]
  }>>().notNull(),
  destinations:    jsonb('destinations').$type<string[]>().notNull(),
  rating:          decimal('rating', { precision: 2, scale: 1 }),
  reviewCount:     integer('review_count').default(0),
  isActive:        boolean('is_active').default(true),
  isFeatured:      boolean('is_featured').default(false),
  createdAt:       timestamp('created_at').defaultNow(),
  updatedAt:       timestamp('updated_at').defaultNow(),
}, (t) => ({
  activeIdx:         index('idx_tours_is_active').on(t.isActive),
  featuredIdx:       index('idx_tours_is_featured').on(t.isFeatured),
  categoryIdx:       index('idx_tours_category').on(t.category),
  difficultyIdx:     index('idx_tours_difficulty').on(t.difficulty),
  priceIdx:          index('idx_tours_price').on(t.price),
  ratingIdx:         index('idx_tours_rating').on(t.rating),
  activeFeaturedIdx: index('idx_tours_active_featured').on(t.isActive, t.isFeatured),
}))

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = pgTable('bookings', {
  id:                serial('id').primaryKey(),
  tourId:            integer('tour_id').references(() => tours.id),
  userId:            integer('user_id').references(() => users.id),
  customerName:      text('customer_name').notNull(),
  customerEmail:     text('customer_email').notNull(),
  customerPhone:     text('customer_phone').notNull(),
  customerCountry:   text('customer_country').notNull(),
  numberOfTravelers: integer('number_of_travelers').notNull(),
  startDate:         timestamp('start_date').notNull(),
  endDate:           timestamp('end_date').notNull(),
  totalPrice:        decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  specialRequests:   text('special_requests'),
  status:            text('status').notNull().default('pending'),
  paymentStatus:     text('payment_status').notNull().default('pending'),
  createdAt:         timestamp('created_at').defaultNow(),
  updatedAt:         timestamp('updated_at').defaultNow(),
}, (t) => ({
  userIdx:       index('idx_bookings_user_id').on(t.userId),
  tourIdx:       index('idx_bookings_tour_id').on(t.tourId),
  statusIdx:     index('idx_bookings_status').on(t.status),
  paymentIdx:    index('idx_bookings_payment_status').on(t.paymentStatus),
  createdIdx:    index('idx_bookings_created_at').on(t.createdAt),
  userStatusIdx: index('idx_bookings_user_status').on(t.userId, t.status),
}))

// ─── Inquiries ────────────────────────────────────────────────────────────────

export const inquiries = pgTable('inquiries', {
  id:           serial('id').primaryKey(),
  name:         text('name').notNull(),
  email:        text('email').notNull(),
  phone:        text('phone').notNull(),
  country:      text('country'),
  tourInterest: text('tour_interest'),
  message:      text('message').notNull(),
  status:       text('status').notNull().default('new'),
  createdAt:    timestamp('created_at').defaultNow(),
}, (t) => ({
  statusIdx:  index('idx_inquiries_status').on(t.status),
  createdIdx: index('idx_inquiries_created_at').on(t.createdAt),
}))

// ─── Custom Tour Requests ─────────────────────────────────────────────────────

export const customTourRequests = pgTable('custom_tour_requests', {
  id:                serial('id').primaryKey(),
  name:              text('name').notNull(),
  email:             text('email').notNull(),
  phone:             text('phone').notNull(),
  country:           text('country').notNull(),
  numberOfTravelers: integer('number_of_travelers').notNull(),
  duration:          integer('duration').notNull(),
  budget:            text('budget').notNull(),
  destinations:      jsonb('destinations').$type<string[]>().notNull(),
  interests:         jsonb('interests').$type<string[]>(),
  startDate:         timestamp('start_date'),
  additionalInfo:    text('additional_info'),
  status:            text('status').notNull().default('pending'),
  createdAt:         timestamp('created_at').defaultNow(),
  updatedAt:         timestamp('updated_at').defaultNow(),
}, (t) => ({
  statusIdx:  index('idx_ctr_status').on(t.status),
  createdIdx: index('idx_ctr_created_at').on(t.createdAt),
}))

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable('reviews', {
  id:              serial('id').primaryKey(),
  tourId:          integer('tour_id').references(() => tours.id),
  bookingId:       integer('booking_id').references(() => bookings.id),
  customerName:    text('customer_name').notNull(),
  customerCountry: text('customer_country').notNull(),
  rating:          integer('rating').notNull(),
  title:           text('title').notNull(),
  comment:         text('comment').notNull(),
  images:          jsonb('images').$type<string[]>(),
  isVerified:      boolean('is_verified').default(false),
  isPublished:     boolean('is_published').default(false),
  createdAt:       timestamp('created_at').defaultNow(),
}, (t) => ({
  tourIdx:      index('idx_reviews_tour_id').on(t.tourId),
  publishedIdx: index('idx_reviews_published').on(t.isPublished),
}))

// ─── Locations (Hierarchy: Country → State → City → Place) ───────────────────

export const locations = pgTable('locations', {
  id:          serial('id').primaryKey(),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  type:        text('type').notNull(),          // country | state | city | place
  parentId:    integer('parent_id'),            // null = root (country)
  path:        text('path').notNull(),          // e.g. "india/rajasthan/jaipur"
  lat:         decimal('lat',  { precision: 10, scale: 7 }),
  lng:         decimal('lng',  { precision: 10, scale: 7 }),
  description: text('description'),
  image:       text('image'),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at').defaultNow(),
}, (t) => ({
  slugIdx:   index('idx_locations_slug').on(t.slug),
  parentIdx: index('idx_locations_parent_id').on(t.parentId),
  typeIdx:   index('idx_locations_type').on(t.type),
  pathIdx:   index('idx_locations_path').on(t.path),
}))

export const locationsRelations = relations(locations, ({ one, many }) => ({
  parent:   one(locations,  { fields: [locations.parentId], references: [locations.id], relationName: 'children' }),
  children: many(locations, { relationName: 'children' }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}))

export const toursRelations = relations(tours, ({ many }) => ({
  bookings: many(bookings),
  reviews:  many(reviews),
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  tour: one(tours, { fields: [bookings.tourId], references: [tours.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tour:    one(tours,    { fields: [reviews.tourId],    references: [tours.id] }),
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
}))
