import { Router } from 'express'
import locationService from './location.service'
import mapCacheService, { getMapCacheStats } from './map.cache'
import { createLocationSchema, updateLocationSchema, locationQuerySchema } from './location.validator'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateQuery, validateParams } from '../../middleware/validate.middleware'
import { mapLimiter } from '../../middleware/rateLimiter'
import { z } from 'zod'

const idParam   = z.object({ id:   z.coerce.number().int().positive() })
const slugParam = z.object({ slug: z.string().min(1) })

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/', validateQuery(locationQuerySchema), async (req, res, next) => {
  try {
    const result = await locationService.getAll(req.query as any)
    sendSuccess(res, result)
  } catch (e) { next(e) }
})

// Map cache endpoints — rate limited, split payload for lazy loading
router.get('/map/:slug',        mapLimiter, async (req, res, next) => {
  try {
    // Core only — fast, used for initial map render
    const payload = await mapCacheService.getCoreOrBuild(req.params.slug)
    if (!payload) return sendSuccess(res, null, 'Location not found', 404)
    sendSuccess(res, payload)
  } catch (e) { next(e) }
})

router.get('/map/:slug/places', mapLimiter, async (req, res, next) => {
  try {
    let places = await mapCacheService.getPlaces(req.params.slug)
    if (!places) {
      const full = await mapCacheService.build(req.params.slug)
      places = full?.places ?? []
    }
    sendSuccess(res, { places })
  } catch (e) { next(e) }
})

router.get('/map/:slug/tours',  mapLimiter, async (req, res, next) => {
  try {
    let tours = await mapCacheService.getTours(req.params.slug)
    if (!tours) {
      const full = await mapCacheService.build(req.params.slug)
      tours = full?.tours ?? []
    }
    sendSuccess(res, { tours })
  } catch (e) { next(e) }
})

router.get('/map/:slug/full',   mapLimiter, async (req, res, next) => {
  try {
    const payload = await mapCacheService.getOrBuild(req.params.slug)
    if (!payload) return sendSuccess(res, null, 'Location not found', 404)
    sendSuccess(res, payload)
  } catch (e) { next(e) }
})

router.get('/slug/:slug', validateParams(slugParam), async (req, res, next) => {
  try {
    const location = await locationService.getBySlug(req.params.slug)
    sendSuccess(res, { location })
  } catch (e) { next(e) }
})

router.get('/:id/children', validateParams(idParam), async (req, res, next) => {
  try {
    const children = await locationService.getChildren(Number(req.params.id))
    sendSuccess(res, { locations: children })
  } catch (e) { next(e) }
})

// Get all tours linked to a location
router.get('/:id/tours', validateParams(idParam), async (req, res, next) => {
  try {
    const { tourLocations, tours } = await import('../../core/database/schema')
    const { eq } = await import('drizzle-orm')
    const db = (await import('../../core/database')).default
    const rows = await db
      .select({
        id:       tours.id,
        title:    tours.title,
        slug:     tours.slug,
        price:    tours.price,
        duration: tours.duration,
        rating:   tours.rating,
        images:   tours.images,
        category: tours.category,
        difficulty: tours.difficulty,
        isFeatured: tours.isFeatured,
      })
      .from(tourLocations)
      .innerJoin(tours, eq(tourLocations.tourId, tours.id))
      .where(eq(tourLocations.locationId, Number(req.params.id)))
    sendSuccess(res, { tours: rows })
  } catch (e) { next(e) }
})

router.get('/:id/descendants', validateParams(idParam), async (req, res, next) => {
  try {
    const descendants = await locationService.getDescendants(Number(req.params.id))
    sendSuccess(res, { locations: descendants })
  } catch (e) { next(e) }
})

router.get('/:fromId/distance/:toId', async (req, res, next) => {
  try {
    const distance = await locationService.getDistance(
      Number(req.params.fromId),
      Number(req.params.toId),
    )
    sendSuccess(res, { distance })
  } catch (e) { next(e) }
})

router.get('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    const location = await locationService.getById(Number(req.params.id))
    sendSuccess(res, { location })
  } catch (e) { next(e) }
})

// ── Admin ─────────────────────────────────────────────────────────────────────

router.use(authenticate, authorize('admin'))

router.post('/', validateBody(createLocationSchema), async (req, res, next) => {
  try {
    const location = await locationService.create(req.body)
    sendSuccess(res, { location }, 'Location created', 201)
  } catch (e) { next(e) }
})

router.patch('/:id', validateParams(idParam), validateBody(updateLocationSchema), async (req, res, next) => {
  try {
    const location = await locationService.update(Number(req.params.id), req.body)
    sendSuccess(res, { location }, 'Location updated')
  } catch (e) { next(e) }
})

router.delete('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    await locationService.delete(Number(req.params.id))
    sendSuccess(res, null, 'Location deleted')
  } catch (e) { next(e) }
})
router.put('/:fromId/distance/:toId', async (req, res, next) => {
  try {
    const { distanceKm, durationMinutes } = req.body
    await locationService.upsertDistance(
      Number(req.params.fromId),
      Number(req.params.toId),
      distanceKm,
      durationMinutes,
    )
    sendSuccess(res, null, 'Distance upserted')
  } catch (e) { next(e) }
})

// Manually trigger cache rebuild for a location
router.post('/map/:slug/rebuild', async (req, res, next) => {
  try {
    await mapCacheService.invalidate(req.params.slug)
    const payload = await mapCacheService.build(req.params.slug)
    sendSuccess(res, payload, 'Map cache rebuilt')
  } catch (e) { next(e) }
})

// Observability — cache hit/miss stats
router.get('/map/_stats', async (_req, res) => {
  sendSuccess(res, getMapCacheStats())
})

export default router
