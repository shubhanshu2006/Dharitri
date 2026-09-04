import { Request, Response, NextFunction } from "express";
import acquisitionService from "../services/acquisition.service.js";
import acquisitionWorkflowService from "../services/acquisition-workflow.service.js";
import {
  createAcquisitionParcelSchema,
  updateAcquisitionParcelSchema,
  transitionReasonSchema,
} from "../validators/acquisition.validator.js";
import { successResponse } from "../utils/response.js";

export class AcquisitionController {
  async createAcquisitionParcel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData = createAcquisitionParcelSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const acquisition = await acquisitionService.createAcquisitionParcel(
        validatedData,
        userId,
      );
      return successResponse(
        res,
        acquisition,
        "Acquisition parcel created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getAcquisitionParcel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const acquisition = await acquisitionService.getAcquisitionParcel(id);
      return successResponse(
        res,
        acquisition,
        "Acquisition parcel retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getAcquisitionsByProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const projectId = req.params.projectId as string;
      const acquisitions =
        await acquisitionService.getAcquisitionsByProject(projectId);
      return successResponse(
        res,
        acquisitions,
        "Acquisitions retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async updateAcquisitionParcel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const validatedData = updateAcquisitionParcelSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const acquisition = await acquisitionService.updateAcquisitionParcel(
        id,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        acquisition,
        "Acquisition parcel updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteAcquisitionParcel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionService.deleteAcquisitionParcel(id, userId);
      return successResponse(
        res,
        null,
        "Acquisition parcel deleted successfully",
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

      await acquisitionWorkflowService.submitForReview(id, userId);
      return successResponse(res, null, "Submitted for review successfully");
    } catch (error) {
      next(error);
    }
  }

  async startReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.startReview(id, userId);
      return successResponse(res, null, "Review started successfully");
    } catch (error) {
      next(error);
    }
  }

  async requestVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.requestVerification(id, userId);
      return successResponse(res, null, "Verification requested successfully");
    } catch (error) {
      next(error);
    }
  }

  async markVerified(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.markVerified(id, userId);
      return successResponse(res, null, "Marked as verified successfully");
    } catch (error) {
      next(error);
    }
  }

  async initiateAcquisition(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.initiateAcquisition(id, userId);
      return successResponse(res, null, "Acquisition initiated successfully");
    } catch (error) {
      next(error);
    }
  }

  async moveToNotificationStage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.moveToNotificationStage(id, userId);
      return successResponse(
        res,
        null,
        "Moved to notification stage successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async moveToAwardStage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.moveToAwardStage(id, userId);
      return successResponse(res, null, "Moved to award stage successfully");
    } catch (error) {
      next(error);
    }
  }

  async markCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.markCompleted(id, userId);
      return successResponse(
        res,
        null,
        "Acquisition marked as completed successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async putOnHold(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason } = transitionReasonSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.putOnHold(id, userId, reason);
      return successResponse(res, null, "Acquisition put on hold successfully");
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason } = transitionReasonSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await acquisitionWorkflowService.cancel(id, userId, reason);
      return successResponse(res, null, "Acquisition cancelled successfully");
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const history = await acquisitionWorkflowService.getWorkflowHistory(id);
      return successResponse(
        res,
        history,
        "Workflow history retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AcquisitionController();
