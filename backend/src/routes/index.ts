import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import gisRoutes from "./gis.routes.js";
import landRecordRoutes from "./land-record.routes.js";
import parcelRoutes from "./parcel.routes.js";
import verificationRoutes from "./verification.routes.js";
import acquisitionRoutes from "./acquisition.routes.js";
import compensationRoutes from "./compensation.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

export const healthRouter = healthRoutes;

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/gis", gisRoutes);
router.use("/land-records", landRecordRoutes);
router.use("/parcels", parcelRoutes);
router.use("/verification", verificationRoutes);
router.use("/acquisitions", acquisitionRoutes);
router.use("/compensation", compensationRoutes);
router.use("/payments", paymentRoutes);

export default router;
