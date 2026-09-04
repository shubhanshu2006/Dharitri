import { Request, Response, NextFunction } from "express";
import auditService from "../services/audit.service.js";
import { auditQuerySchema } from "../validators/audit.validator.js";
import { successResponse } from "../utils/response.js";

export class AuditController {
  async getEntityTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const entityType = req.params.entityType as string;
      const entityId = req.params.entityId as string;

      const timeline = await auditService.getEntityTimeline(
        entityType,
        entityId,
      );

      return successResponse(res, timeline);
    } catch (error) {
      next(error);
    }
  }

  async getActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = auditQuerySchema.parse(req.query);
      const result = await auditService.getActivityLog(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditController();
