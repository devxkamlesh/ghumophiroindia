import {
  pgTable, serial, text, integer, timestamp, boolean,
  jsonb, decimal, primaryKey, index, doublePrecision,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id:            serial('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  password:      text('password').notNull(),
  phone:         text('phone'),
  role:          text('role').notNull().default('user'), // 'admin' | 'user'
  avatar:        text('avatar'),
  address:       text('address'),
  city:          text('city'),
  country:       text('country'),
  isActive:      boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow(),
}, (t) => ({
  emailIdx:    index('idx_users_email').on(t.email),
  activeIdx:   index('idx_users_is_active').on(t.isActive),
}))

// ─── Locations (unified geo hierarchy) ───────────────────────────────────────
// Replaces the flat `destinations` table.
// type: 'country' | 'state' | 'city' | 'place'
// path: materialized path e.g. "india/rajasthan/jaipur"
//       → query subtree with: WHERE path LIKE 'india/rajasthan/%'

export const locations = pgTable('locations', {
  id:          serial('id').primaryKey(),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  type:        text('type').notNull(),              // country | state | city | place
  parentId:    integer('parent_id'),                // self-reference (no FK to avoid circular)
  path:        text('path').notNull(),              // india/rajasthan/jaipur
  subtitle:    text('subtitle'),
  description: text('description'),
  image:       text('image'),
  lat:         doublePrecision('lat'),
  lng:         doublePrecision('lng'),
  isPopular:   boolean('is_popular').default(false),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow(),
}, (t) => ({
  slugIdx:     index('idx_locations_slug').on(t.slug),
  pathIdx:     index('idx_locations_path').on(t.path),   // enables LIKE 'india/%' fast
  typeIdx:     index('idx_locations_type').on(t.type),
  parentIdx:   index('idx_locations_parent_id').on(t.parentId),
  popularIdx:  index('idx_locations_popular').on(t.isPopular),
}))

// ─── Destinations (kept for backward compat, now backed by locations) ─────────
// Thin view-like table — points to a location row.
// tourCount is REMOVED (computed via COUNT on tour_destinations).

export const destinations = pgTable('destinations', {
  id:          serial('id').primaryKey(),
  locationId:  integer('location_id').references(() => locations.id),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  subtitle:    text('subtitle').notNull(),
  description: text('description').notNull(),
  image:       text('image').notNull(),
  isPopular:   boolean('is_popular').default(false),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow(),
}, (t) => ({
  slugIdx:     index('idx_destinations_slug').on(t.slug),
  popularIdx:  index('idx_destinations_popular').on(t.isPopular),
  locationIdx: index('idx_destinations_location_id').on(t.locationId),
}))

// ─── Precomputed Distances ────────────────────────────────────────────────────
// Computed once (via script or admin action), never at runtime.
// Enables "nearby" queries and route planning without live calculation.

export const distances = pgTable('distances', {
  fromLocationId:  integer('from_location_id').notNull().references(() => locations.id),
  toLocationId:    integer('to_location_id').notNull().references(() => locations.id),
  distanceKm:      doublePrecision('distance_km').notNull(),
  durationMinutes: integer('duration_minutes'),
}, (t) => ({
  pk:       primaryKey({ columns: [t.fromLocationId, t.toLocationId] }),
  fromIdx:  index('idx_distances_from').on(t.fromLocationId),
  toIdx:    index('idx_distances_to').on(t.toLocationId),
}))

// ─── Tours ────────────────────────────────────────────────────────────────────
// destinations jsonb[] REMOVED — replaced by tour_destinations junction table.

export const tours = pgTable('tours', {
  id:              serial('id').primaryKey(),
  title:           text('title').notNull(),
  slug:            text('slug').notNull().unique(),
  description:     text('description').notNull(),
  longDescription: text('long_description'),
  duration:        integer('duration').notNull(),
  price:           decimal('price', { precision: 10, scale: 2 }).notNull(),
  maxGroupSize:    integer('max_group_size').notNull(),
  difficulty:      text('difficulty').notNull(),   // easy | moderate | challenging
  category:        text('category').notNull(),     // city | heritage | desert | custom
  images:          jsonb('images').$type<string[]>().notNull(),
  highlights:      jsonb('highlights').$type<string[]>().notNull(),
  included:        jsonb('included').$type<string[]>().notNull(),
  excluded:        jsonb('excluded').$type<string[]>().notNull(),
  itinerary:       jsonb('itinerary').$type<Array<{
    day: number; title: string; description: string; activities: string[]
  }>>().notNull(),
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
  activeCategoryIdx: index('idx_tours_active_category').on(t.isActive, t.category),
}))

// ─── Tour ↔ Destination junction ─────────────────────────────────────────────
// Replaces tours.destinations jsonb[].
// Enables: "all tours in Rajasthan", "all destinations for tour X".

export const tourDestinations = pgTable('tour_destinations', {
  tourId:        integer('tour_id').notNull().references(() => tours.id, { onDelete: 'cascade' }),
  destinationId: integer('destination_id').notNull().references(() => destinations.id, { onDelete: 'restrict' }),
}, (t) => ({
  pk:      primaryKey({ columns: [t.tourId, t.destinationId] }),
  tourIdx: index('idx_td_tour_id').on(t.tourId),
  destIdx: index('idx_td_destination_id').on(t.destinationId),
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
  status:            text('status').notNull().default('pending'),      // pending|confirmed|cancelled|completed
  paymentStatus:     text('payment_status').notNull().default('pending'), // pending|paid|refunded
  createdAt:         timestamp('created_at').defaultNow(),
  updatedAt:         timestamp('updated_at').defaultNow(),
}, (t) => ({
  userIdx:    index('idx_bookings_user_id').on(t.userId),
  tourIdx:    index('idx_bookings_tour_id').on(t.tourId),
  statusIdx:  index('idx_bookings_status').on(t.status),
  paymentIdx: index('idx_bookings_payment_status').on(t.paymentStatus),
  createdIdx: index('idx_bookings_created_at').on(t.createdAt),
  // Composite: most common admin query pattern
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
  status:       text('status').notNull().default('new'), // new|contacted|converted|closed
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
  destinations:      jsonb('destinations').$type<string[]>().notNull(), // free-text until locations migrated
  interests:         jsonb('interests').$type<string[]>(),
  startDate:         timestamp('start_date'),
  additionalInfo:    text('additional_info'),
  status:            text('status').notNull().default('pending'), // pending|processing|quoted|confirmed|rejected
  createdAt:         timestamp('created_at').defaultNow(),
  updatedAt:         timestamp('updated_at').defaultNow(),
}, (t) => ({
  statusIdx:  index('idx_ctr_status').on(t.status),
  createdIdx: index('idx_ctr_created_at').on(t.createdAt),
}))

// ─── Location Summary (denormalized read model) ───────────────────────────────
// Precomputed aggregates — avoids JOINs and COUNT at read time.
// Updated by background workers, not at request time.

export const locationSummary = pgTable('location_summary', {
  locationId:      integer('location_id').primaryKey().references(() => locations.id, { onDelete: 'cascade' }),
  totalPlaces:     integer('total_places').notNull().default(0),
  totalTours:      integer('total_tours').notNull().default(0),
  avgPrice:        integer('avg_price').notNull().default(0),       // stored as integer (₹)
  popularityScore: integer('popularity_score').notNull().default(0), // bookings + clicks + rating weight
  updatedAt:       timestamp('updated_at').defaultNow(),
}, (t) => ({
  popularityIdx: index('idx_ls_popularity').on(t.popularityScore),
  toursIdx:      index('idx_ls_total_tours').on(t.totalTours),
}))

export const reviews = pgTable('reviews', {
  id:              serial('id').primaryKey(),
  tourId:          integer('tour_id').references(() => tours.id),
  bookingId:       integer('booking_id').references(() => bookings.id),
  customerName:    text('customer_name').notNull(),
  customerCountry: text('customer_country').notNull(),
  rating:          integer('rating').notNull(), // 1-5
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

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}))

export const locationsRelations = relations(locations, ({ one, many }) => ({
  parent:          one(locations, { fields: [locations.parentId], references: [locations.id], relationName: 'parent' }),
  children:        many(locations, { relationName: 'parent' }),
  destinations:    many(destinations),
  summary:         one(locationSummary, { fields: [locations.id], references: [locationSummary.locationId] }),
}))

export const locationSummaryRelations = relations(locationSummary, ({ one }) => ({
  location: one(locations, { fields: [locationSummary.locationId], references: [locations.id] }),
}))

export const destinationsRelations = relations(destinations, ({ one, many }) => ({
  location:        one(locations, { fields: [destinations.locationId], references: [locations.id] }),
  tourDestinations: many(tourDestinations),
}))

export const toursRelations = relations(tours, ({ many }) => ({
  bookings:        many(bookings),
  reviews:         many(reviews),
  tourDestinations: many(tourDestinations),
}))

export const tourDestinationsRelations = relations(tourDestinations, ({ one }) => ({
  tour:        one(tours,        { fields: [tourDestinations.tourId],        references: [tours.id] }),
  destination: one(destinations, { fields: [tourDestinations.destinationId], references: [destinations.id] }),
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  tour: one(tours, { fields: [bookings.tourId], references: [tours.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tour:    one(tours,    { fields: [reviews.tourId],    references: [tours.id] }),
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
}))
