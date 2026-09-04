import { Router } from "express";
import compensationController from "../controllers/compensation.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/assessments",
  requirePermission(Permission.COMPENSATION_CREATE),
  compensationController.createAssessment.bind(compensationController),
);

router.get(
  "/assessments",
  requirePermission(Permission.COMPENSATION_VIEW),
  compensationController.listAssessments.bind(compensationController),
);

router.get(
  "/assessments/:id",
  requirePermission(Permission.COMPENSATION_VIEW),
  compensationController.getAssessment.bind(compensationController),
);

router.patch(
  "/assessments/:id",
  requirePermission(Permission.COMPENSATION_UPDATE),
  compensationController.updateAssessment.bind(compensationController),
);

router.post(
  "/assessments/:id/submit",
  requirePermission(Permission.COMPENSATION_SUBMIT),
  compensationController.submitForReview.bind(compensationController),
);

router.post(
  "/assessments/:id/approve",
  requirePermission(Permission.COMPENSATION_APPROVE),
  compensationController.approveAssessment.bind(compensationController),
);

router.post(
  "/assessments/:id/request-correction",
  requirePermission(Permission.COMPENSATION_APPROVE),
  compensationController.requestCorrection.bind(compensationController),
);

router.post(
  "/assessments/:id/reject",
  requirePermission(Permission.COMPENSATION_REJECT),
  compensationController.rejectAssessment.bind(compensationController),
);

router.get(
  "/awards",
  requirePermission(Permission.COMPENSATION_VIEW),
  compensationController.listAwards.bind(compensationController),
);

router.get(
  "/awards/:id",
  requirePermission(Permission.COMPENSATION_VIEW),
  compensationController.getAward.bind(compensationController),
);

export default router;
