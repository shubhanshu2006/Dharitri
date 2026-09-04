import { Router } from "express";
import auditController from "../controllers/audit.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/timeline/:entityType/:entityId",
  requirePermission(Permission.PROJECT_VIEW),
  auditController.getEntityTimeline.bind(auditController),
);

router.get(
  "/activity",
  requirePermission(Permission.PROJECT_VIEW),
  auditController.getActivityLog.bind(auditController),
);

export default router;
