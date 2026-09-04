import { Router } from "express";
import fieldController from "../controllers/field.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";
import { uploadLimiter, strictLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post(
  "/visits",
  requirePermission(Permission.FIELD_VISIT_CREATE),
  fieldController.createFieldVisit.bind(fieldController),
);

router.get(
  "/visits",
  requirePermission(Permission.FIELD_VISIT_VIEW),
  fieldController.listFieldVisits.bind(fieldController),
);

router.get(
  "/visits/:id",
  requirePermission(Permission.FIELD_VISIT_VIEW),
  fieldController.getFieldVisit.bind(fieldController),
);

router.post(
  "/visits/:visitId/evidence",
  uploadLimiter,
  requirePermission(Permission.FIELD_VISIT_CREATE),
  fieldController.uploadEvidence.bind(fieldController),
);

router.patch(
  "/visits/checklist",
  requirePermission(Permission.FIELD_VISIT_CREATE),
  fieldController.updateChecklistItem.bind(fieldController),
);

router.post(
  "/visits/:visitId/submit",
  requirePermission(Permission.FIELD_VISIT_SUBMIT),
  fieldController.submitFieldVisit.bind(fieldController),
);

router.post(
  "/visits/:visitId/verify",
  strictLimiter,
  requirePermission(Permission.FIELD_VISIT_VIEW),
  fieldController.verifyFieldVisit.bind(fieldController),
);

router.post(
  "/visits/:visitId/request-correction",
  requirePermission(Permission.FIELD_VISIT_VIEW),
  fieldController.requestCorrection.bind(fieldController),
);

export default router;
