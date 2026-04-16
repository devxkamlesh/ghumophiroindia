/**
 * Event Bus — lightweight in-process event emitter for cache invalidation.
 *
 * Emitters (services) fire events after mutations.
 * Listeners (cache layers) react and invalidate/rebuild.
 *
 * Events:
 *   tour.created   { tourId, locationSlugs }
 *   tour.updated   { tourId, locationSlugs }
 *   tour.deleted   { tourId, locationSlugs }
 *   booking.created { tourId, locationId }
 *   booking.updated { tourId, locationId }
 *   destination.updated { locationSlug }
 */

import { EventEmitter } from 'events'

export interface TourEvent {
  tourId: number
  locationSlugs: string[]   // slugs of all locations this tour belongs to
}

export interface BookingEvent {
  tourId: number
  locationId?: number
}

export interface DestinationEvent {
  locationSlug: string
}

class AppEventBus extends EventEmitter {
  emitTourCreated(data: TourEvent)      { this.emit('tour.created',          data) }
  emitTourUpdated(data: TourEvent)      { this.emit('tour.updated',           data) }
  emitTourDeleted(data: TourEvent)      { this.emit('tour.deleted',           data) }
  emitBookingCreated(data: BookingEvent){ this.emit('booking.created',        data) }
  emitBookingUpdated(data: BookingEvent){ this.emit('booking.updated',        data) }
  emitDestinationUpdated(data: DestinationEvent){ this.emit('destination.updated', data) }
}

export const events = new AppEventBus()
export default events
