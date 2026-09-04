import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, (req, res, next) =>
  authController.getCurrentUser(req, res, next),
);

export default router;
