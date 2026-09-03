import { Router } from "express";
import healthRoutes from "./health.routes.js";

const router = Router();

export const healthRouter = healthRoutes;

export default router;
