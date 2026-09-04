import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/national",
  requirePermission(Permission.DASHBOARD_VIEW),
  dashboardController.getNationalMetrics.bind(dashboardController),
);

router.get(
  "/states/:stateId",
  requirePermission(Permission.DASHBOARD_VIEW),
  dashboardController.getStateMetrics.bind(dashboardController),
);

router.get(
  "/districts/:districtId",
  requirePermission(Permission.DASHBOARD_VIEW),
  dashboardController.getDistrictMetrics.bind(dashboardController),
);

router.get(
  "/projects/:projectId",
  requirePermission(Permission.DASHBOARD_VIEW),
  dashboardController.getProjectMetrics.bind(dashboardController),
);

export default router;
