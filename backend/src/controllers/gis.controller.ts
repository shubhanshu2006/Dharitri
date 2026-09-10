import { Request, Response, NextFunction } from "express";
import gisService from "../services/gis.service.js";
import {
  projectBoundarySchema,
  cadastralParcelGeometrySchema,
} from "../validators/gis.validator.js";
import { successResponse } from "../utils/response.js";
import { AcquisitionStatus } from "../../generated/prisma/enums.js";

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
      const parcelsGeoJSON = await gisService.findIntersectingParcelsGeoJSON(projectId);
      return successResponse(
        res,
        parcelsGeoJSON,
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

  async generateBoundaryFromCoordinates(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const projectId = req.params.id as string;
      const { coordinates } = req.body; // Array of {lat, lng} objects
      
      if (!Array.isArray(coordinates) || coordinates.length < 3) {
        return res.status(400).json({
          success: false,
          error: { message: "At least 3 coordinates required" }
        });
      }

      const boundary = await gisService.createBoundaryFromCoordinates(
        projectId,
        coordinates
      );
      
      return successResponse(
        res,
        boundary,
        "Boundary generated from coordinates successfully",
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

  async getParcelDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.id as string;
      const parcel = await gisService.getParcelWithOwnerInfo(parcelId);
      return successResponse(
        res,
        parcel,
        "Parcel details retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async updateParcelStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.id as string;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { message: "Status is required" }
        });
      }

      if (!Object.values(AcquisitionStatus).includes(status as AcquisitionStatus)) {
        return res.status(400).json({
          success: false,
          error: { message: "Invalid acquisition status" },
        });
      }

      const result = await gisService.updateParcelStatus(
        parcelId,
        status as AcquisitionStatus,
      );
      return successResponse(
        res,
        result,
        "Parcel status updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new GISController();
