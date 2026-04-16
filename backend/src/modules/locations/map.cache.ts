/**
 * Map Cache Service — STUBBED
 * Requires locations, tour_destinations, location_summary tables.
 * All methods return null/empty until those tables are created.
 */

import logger from '../../core/logger'

export interface MapCenter   { lat: number | null; lng: number | null }
export interface MapLocation { id: number; name: string; slug: string; type: string; path: string }
export interface MapSummary  { totalTours: number; avgPrice: number; popularityScore: number }
export interface MapPlace    { id: number; name: string; slug: string; type: string; lat: number | null; lng: number | null }
export interface MapTour     { id: number; title: string; slug: string; price: string; rating: string | null; duration: number }
export interface MapCore     { center: MapCenter; location: MapLocation; summary: MapSummary; cachedAt: string }
export interface MapFull extends MapCore { places: MapPlace[]; tours: MapTour[] }

const stats = { hits: 0, misses: 0, builds: 0 }
export function getMapCacheStats() { return { ...stats } }

export class MapCacheService {
  async getCore(_slug: string): Promise<MapCore | null>   { return null }
  async getPlaces(_slug: string): Promise<MapPlace[] | null> { return null }
  async getTours(_slug: string): Promise<MapTour[] | null>   { return null }
  async getFull(_slug: string): Promise<MapFull | null>   { return null }
  async build(_slug: string): Promise<MapFull | null> {
    logger.info('[map-cache] build() skipped — new tables not yet in DB')
    return null
  }
  async invalidate(_slug: string): Promise<void> {}
  async getOrBuild(slug: string): Promise<MapFull | null>     { return this.build(slug) }
  async getCoreOrBuild(slug: string): Promise<MapCore | null> { return this.build(slug) }
}

export default new MapCacheService()
