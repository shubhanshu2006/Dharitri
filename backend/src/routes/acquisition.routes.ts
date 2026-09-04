import { Router } from "express";
import acquisitionController from "../controllers/acquisition.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.ACQUISITION_CREATE),
  acquisitionController.createAcquisitionParcel,
);

router.get(
  "/:id",
  requirePermission(Permission.ACQUISITION_VIEW),
  acquisitionController.getAcquisitionParcel,
);

router.get(
  "/project/:projectId",
  requirePermission(Permission.ACQUISITION_VIEW),
  acquisitionController.getAcquisitionsByProject,
);

router.patch(
  "/:id",
  requirePermission(Permission.ACQUISITION_UPDATE),
  acquisitionController.updateAcquisitionParcel,
);

router.delete(
  "/:id",
  requirePermission(Permission.ACQUISITION_DELETE),
  acquisitionController.deleteAcquisitionParcel,
);

router.post(
  "/:id/submit",
  requirePermission(Permission.ACQUISITION_UPDATE),
  acquisitionController.submitForReview,
);

router.post(
  "/:id/start-review",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.startReview,
);

router.post(
  "/:id/request-verification",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.requestVerification,
);

router.post(
  "/:id/verify",
  requirePermission(Permission.VERIFICATION_APPROVE),
  acquisitionController.markVerified,
);

router.post(
  "/:id/initiate",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.initiateAcquisition,
);

router.post(
  "/:id/notification-stage",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.moveToNotificationStage,
);

router.post(
  "/:id/award-stage",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.moveToAwardStage,
);

router.post(
  "/:id/complete",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.markCompleted,
);

router.post(
  "/:id/hold",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.putOnHold,
);

router.post(
  "/:id/cancel",
  requirePermission(Permission.ACQUISITION_APPROVE),
  acquisitionController.cancel,
);

router.get(
  "/:id/workflow-history",
  requirePermission(Permission.ACQUISITION_VIEW),
  acquisitionController.getWorkflowHistory,
);

export default router;
