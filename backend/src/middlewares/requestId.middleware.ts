import { Request, Response, NextFunction } from "express";
import { generateRequestId, extractRequestId } from "../utils/requestId.js";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = extractRequestId(req.headers) || generateRequestId();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
}
