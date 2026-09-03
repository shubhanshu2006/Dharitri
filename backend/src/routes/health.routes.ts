import { Router, Request, Response } from "express";
import { sendSuccess } from "../utils/response.js";
import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" });
});

router.get("/ready", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    sendSuccess(res, {
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(
      "Readiness check failed",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      req.requestId,
    );

    res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Service not ready",
        database: "disconnected",
      },
    });
  }
});

router.get("/live", (req: Request, res: Response) => {
  sendSuccess(res, {
    status: "alive",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
