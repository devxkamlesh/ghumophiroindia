import {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  CACHE_TTL,
  CACHE_KEYS,
  generateCacheKey,
} from '../../core/redis'
import type { Tour } from './tour.model'

// Return types
interface ToursListResponse {
  tours: Tour[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class TourCache {
  /**
   * Get single tour from cache
   */
  async getTour(id: number): Promise<Tour | null> {
    const key = generateCacheKey(CACHE_KEYS.TOUR, id)
    return getCache(key)
  }

  /**
   * Set single tour in cache
   */
  async setTour(id: number, data: Tour): Promise<void> {
    const key = generateCacheKey(CACHE_KEYS.TOUR, id)
    await setCache(key, data, CACHE_TTL.WARM)
  }

  /**
   * Get tour by slug from cache
   */
  async getTourBySlug(slug: string): Promise<Tour | null> {
    const key = generateCacheKey(CACHE_KEYS.TOUR, 'slug', slug)
    return getCache(key)
  }

  /**
   * Set tour by slug in cache
   */
  async setTourBySlug(slug: string, data: Tour): Promise<void> {
    const key = generateCacheKey(CACHE_KEYS.TOUR, 'slug', slug)
    await setCache(key, data, CACHE_TTL.WARM)
  }

  /**
   * Get tours list from cache
   */
  async getToursList(queryKey: string): Promise<ToursListResponse | null> {
    const key = generateCacheKey(CACHE_KEYS.TOURS, 'list', queryKey)
    return getCache(key)
  }

  /**
   * Set tours list in cache
   */
  async setToursList(queryKey: string, data: ToursListResponse): Promise<void> {
    const key = generateCacheKey(CACHE_KEYS.TOURS, 'list', queryKey)
    await setCache(key, data, CACHE_TTL.WARM)
  }

  /**
   * Get featured tours from cache
   */
  async getFeaturedTours(): Promise<Tour[] | null> {
    const key = generateCacheKey(CACHE_KEYS.TOURS, 'featured')
    return getCache(key)
  }

  /**
   * Set featured tours in cache
   */
  async setFeaturedTours(data: Tour[]): Promise<void> {
    const key = generateCacheKey(CACHE_KEYS.TOURS, 'featured')
    await setCache(key, data, CACHE_TTL.HOT)
  }

  /**
   * Invalidate single tour cache
   */
  async invalidateTour(id: number) {
    const key = generateCacheKey(CACHE_KEYS.TOUR, id)
    await deleteCache(key)
  }

  /**
   * Invalidate tour by slug cache
   */
  async invalidateTourBySlug(slug: string) {
    const key = generateCacheKey(CACHE_KEYS.TOUR, 'slug', slug)
    await deleteCache(key)
  }

  /**
   * Invalidate all tours list cache
   */
  async invalidateAllTours() {
    await deleteCachePattern(`${CACHE_KEYS.TOURS}:*`)
  }

  /**
   * Invalidate tour and related caches
   */
  async invalidateTourAndRelated(id: number, slug?: string) {
    await this.invalidateTour(id)
    if (slug) {
      await this.invalidateTourBySlug(slug)
    }
    await this.invalidateAllTours()
  }

  /**
   * Generate query cache key from filters
   */
  generateQueryKey(filters: Record<string, any>): string {
    const sortedKeys = Object.keys(filters).sort()
    const parts = sortedKeys.map(key => `${key}:${filters[key]}`)
    return parts.join('|')
  }
}

export default new TourCache()
