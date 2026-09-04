import { Request, Response, NextFunction } from "express";
import parcelService from "../services/parcel.service.js";
import {
  createParcelSchema,
  updateParcelSchema,
  parcelQuerySchema,
} from "../validators/parcel.validator.js";
import { successResponse } from "../utils/response.js";

export class ParcelController {
  async createParcel(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createParcelSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const parcel = await parcelService.createParcel(validatedData, userId);
      return successResponse(
        res,
        parcel,
        "Cadastral parcel created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getParcels(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = parcelQuerySchema.parse(req.query);
      const result = await parcelService.getParcels(validatedQuery);
      return successResponse(res, result, "Parcels retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getParcelById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const parcel = await parcelService.getParcelById(id);
      return successResponse(res, parcel, "Parcel retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateParcel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateParcelSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const parcel = await parcelService.updateParcel(
        id,
        validatedData,
        userId,
      );
      return successResponse(res, parcel, "Parcel updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getParcelTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const timeline = await parcelService.getParcelTimeline(id);
      return successResponse(
        res,
        timeline,
        "Parcel timeline retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getParcelLandRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const record = await parcelService.getLatestLandRecord(id);
      return successResponse(res, record, "Land record retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async syncParcelData(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await parcelService.syncParcelData(id);
      return successResponse(
        res,
        result,
        "Parcel data synchronized successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getParcelDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const documents = await parcelService.getParcelDocuments(id);
      return successResponse(
        res,
        documents,
        "Parcel documents retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getParcelAcquisitions(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const acquisitions = await parcelService.getParcelAcquisitions(id);
      return successResponse(
        res,
        acquisitions,
        "Parcel acquisitions retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ParcelController();
