import { Router } from "express";
import gisController from "../controllers/gis.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/projects/:id/boundary",
  requirePermission(Permission.PROJECT_UPDATE),
  gisController.setProjectBoundary,
);

router.get(
  "/projects/:id/boundary",
  requirePermission(Permission.PROJECT_VIEW),
  gisController.getProjectBoundary,
);

router.delete(
  "/projects/:id/boundary",
  requirePermission(Permission.PROJECT_UPDATE),
  gisController.deleteProjectBoundary,
);

router.get(
  "/projects/:id/parcels",
  requirePermission(Permission.PROJECT_VIEW),
  gisController.getIntersectingParcels,
);

router.get(
  "/parcels/:id/geometry",
  requirePermission(Permission.PARCEL_VIEW),
  gisController.getCadastralParcelGeometry,
);

router.post(
  "/parcels/:id/geometry",
  requirePermission(Permission.PARCEL_UPDATE),
  gisController.setCadastralParcelGeometry,
);

export default router;
