import { Router } from "express";
import parcelController from "../controllers/parcel.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.PARCEL_CREATE),
  parcelController.createParcel,
);

router.get(
  "/",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcels,
);

router.get(
  "/:id",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcelById,
);

router.patch(
  "/:id",
  requirePermission(Permission.PARCEL_UPDATE),
  parcelController.updateParcel,
);

router.get(
  "/:id/timeline",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcelTimeline,
);

router.get(
  "/:id/land-record",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcelLandRecord,
);

router.post(
  "/:id/sync",
  requirePermission(Permission.PARCEL_UPDATE),
  parcelController.syncParcelData,
);

router.get(
  "/:id/documents",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcelDocuments,
);

router.get(
  "/:id/acquisitions",
  requirePermission(Permission.PARCEL_VIEW),
  parcelController.getParcelAcquisitions,
);

export default router;
