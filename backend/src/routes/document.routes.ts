import { Router } from "express";
import documentController from "../controllers/document.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadLimiter } from "../middlewares/rateLimit.middleware.js";
import { validateFileUpload } from "../middlewares/fileValidation.middleware.js";

const router = Router();

router.post(
  "/",
  uploadLimiter,
  requirePermission(Permission.DOCUMENT_UPLOAD),
  upload.single("file"),
  validateFileUpload,
  documentController.uploadDocument.bind(documentController),
);

router.get(
  "/",
  requirePermission(Permission.DOCUMENT_VIEW),
  documentController.listDocuments.bind(documentController),
);

router.get(
  "/:id",
  requirePermission(Permission.DOCUMENT_VIEW),
  documentController.getDocument.bind(documentController),
);

router.get(
  "/:id/download",
  requirePermission(Permission.DOCUMENT_VIEW),
  documentController.getDownloadUrl.bind(documentController),
);

router.post(
  "/:id/versions",
  uploadLimiter,
  requirePermission(Permission.DOCUMENT_UPLOAD),
  upload.single("file"),
  validateFileUpload,
  documentController.createVersion.bind(documentController),
);

router.delete(
  "/:id",
  requirePermission(Permission.DOCUMENT_DELETE),
  documentController.deleteDocument.bind(documentController),
);

export default router;
