import { Request, Response, NextFunction } from "express";
import fieldService from "../services/field.service.js";
import {
  createFieldVisitSchema,
  uploadEvidenceSchema,
  updateChecklistItemSchema,
  fieldVisitQuerySchema,
  requestCorrectionSchema,
} from "../validators/field.validator.js";
import { successResponse } from "../utils/response.js";

export class FieldController {
  async createFieldVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createFieldVisitSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const visit = await fieldService.createFieldVisit(validatedData, userId);
      return successResponse(res, visit, "Field visit created successfully");
    } catch (error) {
      next(error);
    }
  }

  async getFieldVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const visitId = req.params.id as string;
      const visit = await fieldService.getFieldVisit(visitId);

      if (!visit) {
        return res.status(404).json({ error: "Field visit not found" });
      }

      return successResponse(res, visit);
    } catch (error) {
      next(error);
    }
  }

  async listFieldVisits(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = fieldVisitQuerySchema.parse(req.query);
      const result = await fieldService.listFieldVisits(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async uploadEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const visitId = req.params.visitId as string;
      const validatedData = uploadEvidenceSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const evidence = await fieldService.uploadEvidence(
        visitId,
        validatedData,
        userId,
      );
      return successResponse(res, evidence, "Evidence uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateChecklistItemSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const item = await fieldService.updateChecklistItem(
        validatedData,
        userId,
      );
      return successResponse(res, item, "Checklist item updated");
    } catch (error) {
      next(error);
    }
  }

  async submitFieldVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const visitId = req.params.visitId as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const visit = await fieldService.submitFieldVisit(visitId, userId);
      return successResponse(res, visit, "Field visit submitted");
    } catch (error) {
      next(error);
    }
  }

  async verifyFieldVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const visitId = req.params.visitId as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const visit = await fieldService.verifyFieldVisit(visitId, userId);
      return successResponse(res, visit, "Field visit verified");
    } catch (error) {
      next(error);
    }
  }

  async requestCorrection(req: Request, res: Response, next: NextFunction) {
    try {
      const visitId = req.params.visitId as string;
      const validatedData = requestCorrectionSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const visit = await fieldService.requestCorrection(
        visitId,
        validatedData.remarks,
        userId,
      );
      return successResponse(res, visit, "Correction requested");
    } catch (error) {
      next(error);
    }
  }
}

export default new FieldController();
