import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.get("/me", authLimiter, requireAuth, (req, res, next) =>
  authController.getCurrentUser(req, res, next),
);

export default router;
