import { Request, Response, NextFunction } from "express";
import compensationService from "../services/compensation.service.js";
import {
  createCompensationAssessmentSchema,
  updateCompensationAssessmentSchema,
  approveAssessmentSchema,
  requestCorrectionSchema,
  rejectAssessmentSchema,
  compensationQuerySchema,
} from "../validators/compensation.validator.js";
import { successResponse } from "../utils/response.js";

export class CompensationController {
  async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCompensationAssessmentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.createAssessment(
        validatedData,
        userId,
      );
      return successResponse(
        res,
        assessment,
        "Compensation assessment created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const assessment = await compensationService.getAssessment(id);
      return successResponse(res, assessment);
    } catch (error) {
      next(error);
    }
  }

  async listAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = compensationQuerySchema.parse(req.query);
      const result = await compensationService.listAssessments(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateCompensationAssessmentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.updateAssessment(
        id,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        assessment,
        "Compensation assessment updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async submitForReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.submitForReview(id, userId);
      return successResponse(
        res,
        assessment,
        "Assessment submitted for review",
      );
    } catch (error) {
      next(error);
    }
  }

  async approveAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { notes } = approveAssessmentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.approveAssessment(
        id,
        userId,
        notes,
      );
      return successResponse(res, assessment, "Assessment approved");
    } catch (error) {
      next(error);
    }
  }

  async requestCorrection(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { correctionNotes } = requestCorrectionSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.requestCorrection(
        id,
        userId,
        correctionNotes,
      );
      return successResponse(res, assessment, "Correction requested");
    } catch (error) {
      next(error);
    }
  }

  async rejectAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { rejectionReason } = rejectAssessmentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const assessment = await compensationService.rejectAssessment(
        id,
        userId,
        rejectionReason,
      );
      return successResponse(res, assessment, "Assessment rejected");
    } catch (error) {
      next(error);
    }
  }

  async getAward(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const award = await compensationService.getAward(id);
      return successResponse(res, award);
    } catch (error) {
      next(error);
    }
  }

  async listAwards(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };
      const result = await compensationService.listAwards(filters);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CompensationController();
