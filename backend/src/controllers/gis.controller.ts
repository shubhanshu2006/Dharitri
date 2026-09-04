import { Request, Response, NextFunction } from "express";
import gisService from "../services/gis.service.js";
import {
  projectBoundarySchema,
  cadastralParcelGeometrySchema,
} from "../validators/gis.validator.js";
import { successResponse } from "../utils/response.js";

export class GISController {
  async setProjectBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.id as string;
      const validatedData = projectBoundarySchema.parse(req.body);

      const boundary = await gisService.setProjectBoundary(
        projectId,
        validatedData,
      );
      return successResponse(
        res,
        boundary,
        "Project boundary set successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getProjectBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.id as string;
      const boundary = await gisService.getProjectBoundary(projectId);
      return successResponse(
        res,
        boundary,
        "Project boundary retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteProjectBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.id as string;
      await gisService.deleteProjectBoundary(projectId);
      return successResponse(
        res,
        null,
        "Project boundary deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getIntersectingParcels(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const projectId = req.params.id as string;
      const parcels = await gisService.findIntersectingParcels(projectId);
      return successResponse(
        res,
        parcels,
        "Intersecting parcels retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getCadastralParcelGeometry(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const parcelId = req.params.id as string;
      const geometry = await gisService.getCadastralParcelGeometry(parcelId);
      return successResponse(
        res,
        geometry,
        "Parcel geometry retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async setCadastralParcelGeometry(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const parcelId = req.params.id as string;
      const validatedData = cadastralParcelGeometrySchema.parse(req.body);

      const result = await gisService.setCadastralParcelGeometry(
        parcelId,
        validatedData.geometry,
        validatedData.sourceSystem,
        validatedData.sourceRecordId,
      );
      return successResponse(res, result, "Parcel geometry set successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new GISController();
