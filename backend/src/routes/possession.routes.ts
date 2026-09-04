import { Router } from "express";
import possessionController from "../controllers/possession.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.get(
  "/records",
  requirePermission(Permission.POSSESSION_VIEW),
  possessionController.listPossessionRecords.bind(possessionController),
);

router.get(
  "/cases/:caseId",
  requirePermission(Permission.POSSESSION_VIEW),
  possessionController.getPossessionRecord.bind(possessionController),
);

router.post(
  "/cases/:caseId/record",
  requirePermission(Permission.POSSESSION_RECORD),
  possessionController.recordPossession.bind(possessionController),
);

router.post(
  "/cases/:caseId/notice",
  requirePermission(Permission.POSSESSION_UPDATE),
  possessionController.issueNotice.bind(possessionController),
);

router.post(
  "/records/:id/ready",
  requirePermission(Permission.POSSESSION_UPDATE),
  possessionController.markReady.bind(possessionController),
);

router.patch(
  "/checklist/:itemId",
  requirePermission(Permission.POSSESSION_UPDATE),
  possessionController.updateChecklistItem.bind(possessionController),
);

export default router;
