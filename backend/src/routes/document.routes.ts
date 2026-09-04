import { Router } from "express";
import documentController from "../controllers/document.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.DOCUMENT_UPLOAD),
  upload.single("file"),
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
  requirePermission(Permission.DOCUMENT_UPLOAD),
  upload.single("file"),
  documentController.createVersion.bind(documentController),
);

router.delete(
  "/:id",
  requirePermission(Permission.DOCUMENT_DELETE),
  documentController.deleteDocument.bind(documentController),
);

export default router;
