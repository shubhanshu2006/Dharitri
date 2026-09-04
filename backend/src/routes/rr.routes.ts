import { Router } from "express";
import rrController from "../controllers/rr.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/cases",
  requirePermission(Permission.RR_CREATE),
  rrController.createRRCase.bind(rrController),
);

router.get(
  "/cases",
  requirePermission(Permission.RR_VIEW),
  rrController.listRRCases.bind(rrController),
);

router.get(
  "/cases/:id",
  requirePermission(Permission.RR_VIEW),
  rrController.getRRCase.bind(rrController),
);

router.patch(
  "/cases/:id",
  requirePermission(Permission.RR_UPDATE),
  rrController.updateRRCase.bind(rrController),
);

router.post(
  "/cases/:id/transition",
  requirePermission(Permission.RR_APPROVE),
  rrController.transitionStatus.bind(rrController),
);

router.post(
  "/cases/:id/entitlements",
  requirePermission(Permission.RR_CREATE),
  rrController.createEntitlement.bind(rrController),
);

router.patch(
  "/cases/:id/entitlements/:entitlementId",
  requirePermission(Permission.RR_UPDATE),
  rrController.updateEntitlement.bind(rrController),
);

router.get(
  "/cases/:id/entitlements/:entitlementId",
  requirePermission(Permission.RR_VIEW),
  rrController.getEntitlement.bind(rrController),
);

export default router;
