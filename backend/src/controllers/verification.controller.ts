import { Request, Response, NextFunction } from "express";
import verificationService from "../services/verification.service.js";
import routingService from "../services/routing.service.js";
import { successResponse } from "../utils/response.js";

export class VerificationController {
  async getVerificationCases(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, projectId, assignedUserId } =
        req.query;

      const result = await verificationService.getVerificationCases({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as any,
        projectId: projectId as string,
        assignedUserId: assignedUserId as string,
      });

      return successResponse(res, result, "Verification cases retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getVerificationCase(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const verificationCase =
        await verificationService.getVerificationCase(id);
      return successResponse(
        res,
        verificationCase,
        "Verification case retrieved",
      );
    } catch (error) {
      next(error);
    }
  }

  async createVerificationCase(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { acquisitionCaseId, assignedUserId } = req.body;
      const verificationCase = await verificationService.createVerificationCase(
        {
          acquisitionCaseId,
          assignedUserId,
        },
      );
      return successResponse(
        res,
        verificationCase,
        "Verification case created",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async runVerificationChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const verificationCase =
        await verificationService.runVerificationChecks(id);
      return successResponse(
        res,
        verificationCase,
        "Verification checks completed",
      );
    } catch (error) {
      next(error);
    }
  }

  async approveVerificationCase(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const verificationCase =
        await verificationService.approveVerificationCase(id);
      return successResponse(
        res,
        verificationCase,
        "Verification case approved",
      );
    } catch (error) {
      next(error);
    }
  }

  async requestCorrection(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;
      const verificationCase = await verificationService.requestCorrection(
        id,
        reason,
      );
      return successResponse(res, verificationCase, "Correction requested");
    } catch (error) {
      next(error);
    }
  }

  async verifyAcquisitionParcel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const acquisitionParcelId = req.params.id as string;
      const result =
        await verificationService.verifyAcquisitionParcel(acquisitionParcelId);
      return successResponse(
        res,
        result,
        "Verification completed successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async routeAcquisitionCase(req: Request, res: Response, next: NextFunction) {
    try {
      const acquisitionParcelId = req.params.id as string;
      const decision =
        await routingService.routeAcquisitionCase(acquisitionParcelId);
      return successResponse(
        res,
        decision,
        "Routing decision made successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async assignAcquisitionCase(req: Request, res: Response, next: NextFunction) {
    try {
      const acquisitionParcelId = req.params.id as string;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      await routingService.assignAcquisitionCase(acquisitionParcelId, userId);
      return successResponse(
        res,
        null,
        "Acquisition case assigned successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async unassignAcquisitionCase(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const acquisitionParcelId = req.params.id as string;
      await routingService.unassignAcquisitionCase(acquisitionParcelId);
      return successResponse(
        res,
        null,
        "Acquisition case unassigned successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new VerificationController();
