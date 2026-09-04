import { Request, Response, NextFunction } from "express";
import notificationService from "../services/notification.service.js";
import {
  notificationQuerySchema,
  createNotificationSchema,
} from "../validators/notification.validator.js";
import { successResponse } from "../utils/response.js";

export class NotificationController {
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedQuery = notificationQuerySchema.parse(req.query);
      const result = await notificationService.getUserNotifications(
        userId,
        validatedQuery,
      );
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const notification = await notificationService.markAsRead(
        notificationId,
        userId,
      );
      return successResponse(res, notification, "Notification marked as read");
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await notificationService.markAllAsRead(userId);
      return successResponse(res, result, "All notifications marked as read");
    } catch (error) {
      next(error);
    }
  }

  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createNotificationSchema.parse(req.body);
      const notification =
        await notificationService.createNotification(validatedData);
      return successResponse(
        res,
        notification,
        "Notification created successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
