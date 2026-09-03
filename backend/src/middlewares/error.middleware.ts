import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn(
      `Operational error: ${err.message}`,
      {
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      requestId,
    );

    sendError(
      res,
      err.statusCode,
      err.code,
      err.message,
      process.env.NODE_ENV === "development" ? err.details : undefined,
      requestId,
    );
    return;
  }

  logger.error(
    `Unexpected error: ${err.message}`,
    {
      error: err.name,
      stack: err.stack,
    },
    requestId,
  );

  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message;

  sendError(
    res,
    500,
    "INTERNAL_ERROR",
    message,
    process.env.NODE_ENV === "development" ? { stack: err.stack } : undefined,
    requestId,
  );
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = req.requestId;

  logger.warn(
    `Route not found: ${req.method} ${req.url}`,
    {
      method: req.method,
      url: req.url,
    },
    requestId,
  );

  sendError(
    res,
    404,
    "NOT_FOUND",
    `Cannot ${req.method} ${req.url}`,
    undefined,
    requestId,
  );
}
