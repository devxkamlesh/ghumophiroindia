import { Router } from 'express'
import { eq } from 'drizzle-orm'
import db from '../../core/database'
import { placeCards } from '../../core/database/schema'
import { sendSuccess } from '../../shared/response'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { validateBody, validateParams } from '../../middleware/validate.middleware'
import { z } from 'zod'
import logger from '../../core/logger'

const idParam = z.object({ id: z.coerce.number().int().positive() })

const createSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional(),
  image: z.string().url(),
  linkUrl: z.string().max(500).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

const updateSchema = createSchema.partial()

const reorderSchema = z.object({
  orders: z.array(z.object({
    id: z.number().int().positive(),
    displayOrder: z.number().int().min(0),
  })),
})

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/active', async (_req, res, next) => {
  try {
    const cards = await db
      .select()
      .from(placeCards)
      .where(eq(placeCards.isActive, true))
      .orderBy(placeCards.displayOrder, placeCards.id)
    sendSuccess(res, { placeCards: cards })
  } catch (e) { next(e) }
})

// ── Admin ─────────────────────────────────────────────────────────────────────

router.use(authenticate, authorize('admin'))

router.get('/', async (_req, res, next) => {
  try {
    const cards = await db.select().from(placeCards).orderBy(placeCards.displayOrder, placeCards.id)
    sendSuccess(res, { placeCards: cards })
  } catch (e) { next(e) }
})

router.get('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    const [card] = await db.select().from(placeCards).where(eq(placeCards.id, Number(req.params.id))).limit(1)
    if (!card) return res.status(404).json({ success: false, error: 'Place card not found' })
    sendSuccess(res, { placeCard: card })
  } catch (e) { next(e) }
})

router.post('/', validateBody(createSchema), async (req, res, next) => {
  try {
    const [card] = await db.insert(placeCards).values({
      title: req.body.title,
      subtitle: req.body.subtitle ?? null,
      image: req.body.image,
      linkUrl: req.body.linkUrl ?? '/tours',
      displayOrder: req.body.displayOrder ?? 0,
      isActive: req.body.isActive ?? true,
    }).returning()
    logger.info(`Place card created: ${card.title}`)
    sendSuccess(res, { placeCard: card }, 'Place card created', 201)
  } catch (e) { next(e) }
})

router.patch('/:id', validateParams(idParam), validateBody(updateSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (req.body.title !== undefined) updateData.title = req.body.title
    if (req.body.subtitle !== undefined) updateData.subtitle = req.body.subtitle
    if (req.body.image !== undefined) updateData.image = req.body.image
    if (req.body.linkUrl !== undefined) updateData.linkUrl = req.body.linkUrl
    if (req.body.displayOrder !== undefined) updateData.displayOrder = req.body.displayOrder
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive

    const [updated] = await db.update(placeCards).set(updateData).where(eq(placeCards.id, id)).returning()
    if (!updated) return res.status(404).json({ success: false, error: 'Place card not found' })
    logger.info(`Place card updated: ${updated.title}`)
    sendSuccess(res, { placeCard: updated }, 'Place card updated')
  } catch (e) { next(e) }
})

router.delete('/:id', validateParams(idParam), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await db.delete(placeCards).where(eq(placeCards.id, id))
    logger.info(`Place card deleted: ${id}`)
    sendSuccess(res, null, 'Place card deleted')
  } catch (e) { next(e) }
})

router.post('/reorder', validateBody(reorderSchema), async (req, res, next) => {
  try {
    for (const { id, displayOrder } of req.body.orders) {
      await db.update(placeCards).set({ displayOrder, updatedAt: new Date() }).where(eq(placeCards.id, id))
    }
    logger.info(`Place cards reordered: ${req.body.orders.length} items`)
    sendSuccess(res, null, 'Place cards reordered')
  } catch (e) { next(e) }
})

export default router
