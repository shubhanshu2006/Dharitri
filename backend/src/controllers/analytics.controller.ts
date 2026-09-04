import { Request, Response, NextFunction } from "express";
import analyticsService from "../services/analytics.service.js";
import {
  analyticsQuerySchema,
  bottleneckQuerySchema,
} from "../validators/analytics.validator.js";
import { successResponse } from "../utils/response.js";

export class AnalyticsController {
  async getAcquisitionTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = analyticsQuerySchema.parse(req.query);
      const trends =
        await analyticsService.getAcquisitionTrends(validatedQuery);
      return successResponse(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getCompensationTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = analyticsQuerySchema.parse(req.query);
      const trends =
        await analyticsService.getCompensationTrends(validatedQuery);
      return successResponse(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = analyticsQuerySchema.parse(req.query);
      const analytics =
        await analyticsService.getPaymentAnalytics(validatedQuery);
      return successResponse(res, analytics);
    } catch (error) {
      next(error);
    }
  }

  async getRRTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = analyticsQuerySchema.parse(req.query);
      const trends = await analyticsService.getRRTrends(validatedQuery);
      return successResponse(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getPossessionTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = analyticsQuerySchema.parse(req.query);
      const trends = await analyticsService.getPossessionTrends(validatedQuery);
      return successResponse(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getBottlenecks(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = bottleneckQuerySchema.parse(req.query);
      const bottlenecks = await analyticsService.getBottlenecks(validatedQuery);
      return successResponse(res, bottlenecks);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
