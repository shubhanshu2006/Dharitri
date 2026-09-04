import { Request, Response, NextFunction } from "express";
import landRecordService from "../services/land-record.service.js";
import cadastralService from "../services/cadastral.service.js";
import { successResponse } from "../utils/response.js";

export class LandRecordController {
  async syncLandRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.parcelId as string;
      await landRecordService.syncLandRecord(parcelId);
      return successResponse(
        res,
        null,
        "Land record synchronized successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getLandRecordHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.parcelId as string;
      const history = await landRecordService.getLandRecordHistory(parcelId);
      return successResponse(
        res,
        history,
        "Land record history retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async getLatestLandRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.parcelId as string;
      const record = await landRecordService.getLatestLandRecord(parcelId);
      return successResponse(
        res,
        record,
        "Latest land record retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async syncCadastralGeometry(req: Request, res: Response, next: NextFunction) {
    try {
      const parcelId = req.params.parcelId as string;
      await cadastralService.syncGeometry(parcelId);
      return successResponse(
        res,
        null,
        "Cadastral geometry synchronized successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new LandRecordController();
