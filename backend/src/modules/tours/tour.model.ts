import { tours } from '../../core/database/schema'

// Infer Tour type from schema
export type Tour = typeof tours.$inferSelect

// Itinerary item type
export interface ItineraryItem {
  day: number
  title: string
  description: string
  activities: string[]
}
