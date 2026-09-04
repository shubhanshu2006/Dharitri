import { Router } from "express";
import verificationController from "../controllers/verification.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/acquisition-parcels/:id/verify",
  requirePermission(Permission.VERIFICATION_CREATE),
  verificationController.verifyAcquisitionParcel,
);

router.post(
  "/acquisition-parcels/:id/route",
  requirePermission(Permission.VERIFICATION_CREATE),
  verificationController.routeAcquisitionCase,
);

router.post(
  "/acquisition-parcels/:id/assign",
  requirePermission(Permission.ACQUISITION_UPDATE),
  verificationController.assignAcquisitionCase,
);

router.post(
  "/acquisition-parcels/:id/unassign",
  requirePermission(Permission.ACQUISITION_UPDATE),
  verificationController.unassignAcquisitionCase,
);

export default router;
