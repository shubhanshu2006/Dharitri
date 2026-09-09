import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/client.js";
import { successResponse } from "../utils/response.js";

export class LocationController {
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const states = await prisma.state.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });

      return successResponse(res, states, "States retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const { stateId } = req.query;

      const where = stateId ? { stateId: stateId as string } : {};

      const districts = await prisma.district.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          code: true,
          stateId: true,
        },
      });

      return successResponse(res, districts, "Districts retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new LocationController();
