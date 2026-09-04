import { Request, Response, NextFunction } from "express";
import rrService from "../services/rr.service.js";
import {
  createRRCaseSchema,
  updateRRCaseSchema,
  transitionStatusSchema,
  createEntitlementSchema,
  updateEntitlementSchema,
  rrCaseQuerySchema,
} from "../validators/rr.validator.js";
import { successResponse } from "../utils/response.js";

export class RRController {
  async createRRCase(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createRRCaseSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const rrCase = await rrService.createRRCase(validatedData, userId);
      return successResponse(res, rrCase, "R&R case created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getRRCase(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const rrCase = await rrService.getRRCase(id);
      return successResponse(res, rrCase);
    } catch (error) {
      next(error);
    }
  }

  async listRRCases(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = rrCaseQuerySchema.parse(req.query);
      const result = await rrService.listRRCases(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateRRCase(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateRRCaseSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const rrCase = await rrService.updateRRCase(id, validatedData, userId);
      return successResponse(res, rrCase, "R&R case updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async transitionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { targetStatus } = transitionStatusSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const rrCase = await rrService.transitionStatus(id, targetStatus, userId);
      return successResponse(res, rrCase, "Status transitioned successfully");
    } catch (error) {
      next(error);
    }
  }

  async createEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const rrCaseId = req.params.id as string;
      const validatedData = createEntitlementSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const entitlement = await rrService.createEntitlement(
        rrCaseId,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        entitlement,
        "Entitlement created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async updateEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.entitlementId as string;
      const validatedData = updateEntitlementSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const entitlement = await rrService.updateEntitlement(
        id,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        entitlement,
        "Entitlement updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.entitlementId as string;
      const entitlement = await rrService.getEntitlement(id);
      return successResponse(res, entitlement);
    } catch (error) {
      next(error);
    }
  }
}

export default new RRController();
