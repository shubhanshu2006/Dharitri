import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../utils/errors.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);

  if (!auth.userId) {
    throw new UnauthorizedError("Authentication required");
  }

  next();
}
