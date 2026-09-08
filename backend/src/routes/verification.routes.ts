import { Router } from "express";
import verificationController from "../controllers/verification.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/cases",
  requirePermission(Permission.VERIFICATION_VIEW),
  verificationController.getVerificationCases,
);

router.get(
  "/cases/:id",
  requirePermission(Permission.VERIFICATION_VIEW),
  verificationController.getVerificationCase,
);

router.post(
  "/cases",
  requirePermission(Permission.VERIFICATION_CREATE),
  verificationController.createVerificationCase,
);

router.post(
  "/cases/:id/run",
  requirePermission(Permission.VERIFICATION_RUN),
  verificationController.runVerificationChecks,
);

router.post(
  "/cases/:id/approve",
  requirePermission(Permission.VERIFICATION_APPROVE),
  verificationController.approveVerificationCase,
);

router.post(
  "/cases/:id/request-correction",
  requirePermission(Permission.VERIFICATION_REQUEST_CORRECTION),
  verificationController.requestCorrection,
);

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
