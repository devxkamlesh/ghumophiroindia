/**
 * Location Service — STUBBED
 * Requires the `locations` and `distances` tables which are not yet in the DB.
 * All methods return empty/null until those tables are created via db:push.
 */

import { NotFoundError } from '../../shared/errors'
import type { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from './location.validator'

export class LocationService {
  async getAll(_query: LocationQueryInput) {
    return { locations: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } }
  }
  async getById(_id: number): Promise<never> {
    throw new NotFoundError('Location not found')
  }
  async getBySlug(_slug: string): Promise<never> {
    throw new NotFoundError('Location not found')
  }
  async getDescendants(_id: number) { return [] }
  async getChildren(_parentId: number) { return [] }
  async getDistance(_fromId: number, _toId: number) { return null }
  async create(_data: CreateLocationInput): Promise<never> {
    throw new Error('Locations table not yet created. Run db:push first.')
  }
  async update(_id: number, _data: UpdateLocationInput): Promise<never> {
    throw new Error('Locations table not yet created. Run db:push first.')
  }
  async upsertDistance(_fromId: number, _toId: number, _distanceKm: number, _durationMinutes?: number) {
    throw new Error('Distances table not yet created. Run db:push first.')
  }
}

export default new LocationService()
