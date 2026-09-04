import { Router } from "express";
import aiController from "../controllers/ai.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/projects/:projectId/risk",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getProjectRisk.bind(aiController),
);

router.get(
  "/projects/:projectId/anomalies",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getProjectAnomalies.bind(aiController),
);

router.get(
  "/parcels/:parcelId/verification-risk",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getParcelVerificationRisk.bind(aiController),
);

router.get(
  "/cases/:caseId/compensation-risk",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getCompensationDelayRisk.bind(aiController),
);

router.get(
  "/rr/:rrCaseId/delay-risk",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getRRDelayRisk.bind(aiController),
);

router.get(
  "/possession/:possessionId/delay-risk",
  requirePermission(Permission.AI_DECISION_SUPPORT_VIEW),
  aiController.getPossessionDelayRisk.bind(aiController),
);

export default router;
