import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const requestId = req.requestId;

  logger.info(
    `Incoming request: ${method} ${url}`,
    {
      method,
      url,
      ip: ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    },
    requestId,
  );

  const originalEnd = res.end;

  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;

    logger.info(
      `Response sent: ${method} ${url} - ${statusCode}`,
      {
        method,
        url,
        statusCode,
        responseTime: `${responseTime}ms`,
      },
      requestId,
    );

    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
}
