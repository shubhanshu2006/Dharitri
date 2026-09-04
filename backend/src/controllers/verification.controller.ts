import { Request, Response, NextFunction } from "express";
import verificationService from "../services/verification.service.js";
import routingService from "../services/routing.service.js";
import { successResponse } from "../utils/response.js";

export class VerificationController {
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
