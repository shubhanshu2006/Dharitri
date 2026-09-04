import { Router } from "express";
import analyticsController from "../controllers/analytics.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/acquisition",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getAcquisitionTrends.bind(analyticsController),
);

router.get(
  "/compensation",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getCompensationTrends.bind(analyticsController),
);

router.get(
  "/payments",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getPaymentAnalytics.bind(analyticsController),
);

router.get(
  "/rr",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getRRTrends.bind(analyticsController),
);

router.get(
  "/possession",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getPossessionTrends.bind(analyticsController),
);

router.get(
  "/bottlenecks",
  requirePermission(Permission.ANALYTICS_VIEW),
  analyticsController.getBottlenecks.bind(analyticsController),
);

export default router;
