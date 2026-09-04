import { Request, Response, NextFunction } from "express";
import dashboardService from "../services/dashboard.service.js";
import { successResponse } from "../utils/response.js";

export class DashboardController {
  async getNationalMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await dashboardService.getNationalMetrics();
      return successResponse(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  async getStateMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const stateId = req.params.stateId as string;
      const metrics = await dashboardService.getStateMetrics(stateId);
      return successResponse(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  async getDistrictMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const districtId = req.params.districtId as string;
      const metrics = await dashboardService.getDistrictMetrics(districtId);
      return successResponse(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  async getProjectMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const metrics = await dashboardService.getProjectMetrics(projectId);
      return successResponse(res, metrics);
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
