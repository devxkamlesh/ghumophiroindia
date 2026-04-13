import { Request, Response, NextFunction } from 'express'
import tourService from './tour.service'
import { sendSuccess, sendPaginated } from '../../shared/response'
import type { CreateTourInput, UpdateTourInput, TourQueryInput } from './tour.validator'

export class TourController {
  /**
   * Get all tours with filters
   * GET /api/v1/tours
   */
  async getTours(req: Request, res: Response, next: NextFunction) {
    try {
      const query: TourQueryInput = req.query as any
      const result = await tourService.getTours(query)
      
      sendPaginated(
        res,
        result.tours,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Tours retrieved successfully'
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get featured tours
   * GET /api/v1/tours/featured
   */
  async getFeaturedTours(req: Request, res: Response, next: NextFunction) {
    try {
      const tours = await tourService.getFeaturedTours()
      sendSuccess(res, { tours }, 'Featured tours retrieved successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get single tour by ID
   * GET /api/v1/tours/:id
   */
  async getTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const tour = await tourService.getTourById(parseInt(id, 10))
      sendSuccess(res, { tour }, 'Tour retrieved successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get single tour by slug
   * GET /api/v1/tours/slug/:slug
   */
  async getTourBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      const tour = await tourService.getTourBySlug(slug)
      sendSuccess(res, { tour }, 'Tour retrieved successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create new tour (admin only)
   * POST /api/v1/tours
   */
  async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateTourInput = req.body
      const tour = await tourService.createTour(data)
      sendSuccess(res, { tour }, 'Tour created successfully', 201)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update tour (admin only)
   * PATCH /api/v1/tours/:id
   */
  async updateTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data: UpdateTourInput = req.body
      const tour = await tourService.updateTour(parseInt(id, 10), data)
      sendSuccess(res, { tour }, 'Tour updated successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete tour (admin only)
   * DELETE /api/v1/tours/:id
   */
  async deleteTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await tourService.deleteTour(parseInt(id, 10))
      sendSuccess(res, result, 'Tour deleted successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get tour statistics (admin only)
   * GET /api/v1/tours/stats
   */
  async getTourStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await tourService.getTourStats()
      sendSuccess(res, { stats }, 'Tour statistics retrieved successfully')
    } catch (error) {
      next(error)
    }
  }
}

export default new TourController()
