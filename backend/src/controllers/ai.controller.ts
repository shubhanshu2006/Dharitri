import { Request, Response, NextFunction } from "express";
import aiService from "../services/ai.service.js";
import { successResponse } from "../utils/response.js";

export class AIController {
  async getProjectRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const risk = await aiService.calculateProjectRisk(projectId as string);
      return successResponse(res, risk);
    } catch (error) {
      next(error);
    }
  }

  async getParcelVerificationRisk(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { parcelId } = req.params;
      const risk = await aiService.calculateParcelVerificationRisk(
        parcelId as string,
      );
      return successResponse(res, risk);
    } catch (error) {
      next(error);
    }
  }

  async getCompensationDelayRisk(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { caseId } = req.params;
      const risk = await aiService.calculateCompensationDelayRisk(
        caseId as string,
      );
      return successResponse(res, risk);
    } catch (error) {
      next(error);
    }
  }

  async getRRDelayRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { rrCaseId } = req.params;
      const risk = await aiService.calculateRRDelayRisk(rrCaseId as string);
      return successResponse(res, risk);
    } catch (error) {
      next(error);
    }
  }

  async getPossessionDelayRisk(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { possessionId } = req.params;
      const risk = await aiService.calculatePossessionDelayRisk(
        possessionId as string,
      );
      return successResponse(res, risk);
    } catch (error) {
      next(error);
    }
  }

  async getProjectAnomalies(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const anomalies = await aiService.detectAnomalies(projectId as string);
      return successResponse(res, anomalies);
    } catch (error) {
      next(error);
    }
  }
}

export default new AIController();
