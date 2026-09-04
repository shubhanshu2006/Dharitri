import { Router } from "express";
import landRecordController from "../controllers/land-record.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/parcels/:parcelId/sync",
  requirePermission(Permission.PARCEL_UPDATE),
  landRecordController.syncLandRecord,
);

router.get(
  "/parcels/:parcelId/history",
  requirePermission(Permission.PARCEL_VIEW),
  landRecordController.getLandRecordHistory,
);

router.get(
  "/parcels/:parcelId/latest",
  requirePermission(Permission.PARCEL_VIEW),
  landRecordController.getLatestLandRecord,
);

router.post(
  "/parcels/:parcelId/sync-geometry",
  requirePermission(Permission.PARCEL_UPDATE),
  landRecordController.syncCadastralGeometry,
);

export default router;
