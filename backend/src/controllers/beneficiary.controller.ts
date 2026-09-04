import { Request, Response, NextFunction } from "express";
import beneficiaryService from "../services/beneficiary.service.js";
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
  beneficiaryQuerySchema,
} from "../validators/beneficiary.validator.js";
import { successResponse } from "../utils/response.js";

export class BeneficiaryController {
  async createBeneficiary(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createBeneficiarySchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const beneficiary = await beneficiaryService.createBeneficiary(
        validatedData,
        userId,
      );
      return successResponse(
        res,
        beneficiary,
        "Beneficiary created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getBeneficiary(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const beneficiary = await beneficiaryService.getBeneficiary(id);
      return successResponse(res, beneficiary);
    } catch (error) {
      next(error);
    }
  }

  async listBeneficiaries(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = beneficiaryQuerySchema.parse(req.query);
      const result = await beneficiaryService.listBeneficiaries(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateBeneficiary(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateBeneficiarySchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const beneficiary = await beneficiaryService.updateBeneficiary(
        id,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        beneficiary,
        "Beneficiary updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyBeneficiary(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const verification = await beneficiaryService.verifyBeneficiary(
        id,
        userId,
      );
      return successResponse(
        res,
        verification,
        "Verification initiated successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getVerificationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const status = await beneficiaryService.getVerificationStatus(id);
      return successResponse(res, status);
    } catch (error) {
      next(error);
    }
  }
}

export default new BeneficiaryController();
