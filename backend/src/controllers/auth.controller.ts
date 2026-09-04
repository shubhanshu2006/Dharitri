import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { userService } from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";

export class AuthController {
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);

      if (!auth.userId) {
        throw new UnauthorizedError("Not authenticated");
      }

      const user = await userService.getUserWithPermissions(auth.userId);

      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
