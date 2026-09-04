import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";

const router = Router();

export const healthRouter = healthRoutes;

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

export default router;
