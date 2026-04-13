import { Router } from 'express'
import destinationService from './destination.service'
import { sendSuccess } from '../../shared/response'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const destinations = await destinationService.getAll()
    sendSuccess(res, { destinations })
  } catch (error) {
    next(error)
  }
})

router.get('/popular', async (req, res, next) => {
  try {
    const destinations = await destinationService.getPopular()
    sendSuccess(res, { destinations })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const destination = await destinationService.getById(parseInt(req.params.id, 10))
    sendSuccess(res, { destination })
  } catch (error) {
    next(error)
  }
})

export default router
