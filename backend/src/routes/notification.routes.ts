import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  notificationController.getUserNotifications.bind(notificationController),
);

router.post(
  "/:id/read",
  requireAuth,
  notificationController.markAsRead.bind(notificationController),
);

router.post(
  "/read-all",
  requireAuth,
  notificationController.markAllAsRead.bind(notificationController),
);

router.post(
  "/",
  requireAuth,
  notificationController.createNotification.bind(notificationController),
);

export default router;
