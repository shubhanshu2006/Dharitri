import { Request, Response, NextFunction } from "express";
import possessionService from "../services/possession.service.js";
import {
  recordPossessionSchema,
  updateChecklistItemSchema,
  possessionQuerySchema,
} from "../validators/possession.validator.js";
import { successResponse } from "../utils/response.js";

export class PossessionController {
  async getPossessionRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const acquisitionCaseId = req.params.caseId as string;
      const possession =
        await possessionService.getPossessionRecord(acquisitionCaseId);
      return successResponse(res, possession);
    } catch (error) {
      next(error);
    }
  }

  async listPossessionRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = possessionQuerySchema.parse(req.query);
      const result =
        await possessionService.listPossessionRecords(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async recordPossession(req: Request, res: Response, next: NextFunction) {
    try {
      const acquisitionCaseId = req.params.caseId as string;
      const validatedData = recordPossessionSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const possession = await possessionService.recordPossession(
        acquisitionCaseId,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        possession,
        "Possession recorded successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async updateChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = req.params.itemId as string;
      const validatedData = updateChecklistItemSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const item = await possessionService.updateChecklistItem(
        itemId,
        validatedData,
        userId,
      );
      return successResponse(res, item, "Checklist item updated");
    } catch (error) {
      next(error);
    }
  }

  async issueNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const acquisitionCaseId = req.params.caseId as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const possession = await possessionService.issueNotice(
        acquisitionCaseId,
        userId,
      );
      return successResponse(res, possession, "Possession notice issued");
    } catch (error) {
      next(error);
    }
  }

  async markReady(req: Request, res: Response, next: NextFunction) {
    try {
      const possessionRecordId = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const possession = await possessionService.markReady(
        possessionRecordId,
        userId,
      );
      return successResponse(res, possession, "Possession marked ready");
    } catch (error) {
      next(error);
    }
  }
}

export default new PossessionController();
