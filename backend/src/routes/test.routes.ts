import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  requirePermission,
  requireRole,
  requireResourceAccess,
} from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";
import { Role } from "../constants/roles.js";
import { sendSuccess } from "../utils/response.js";

const router = Router();

router.get("/public", (req: Request, res: Response) => {
  sendSuccess(res, { message: "This is a public endpoint" });
});

router.get("/authenticated", requireAuth, (req: Request, res: Response) => {
  sendSuccess(res, { message: "You are authenticated", user: req.user });
});

router.get(
  "/permission-test",
  requireAuth,
  requirePermission(Permission.PROJECT_VIEW),
  (req: Request, res: Response) => {
    sendSuccess(res, { message: "You have PROJECT_VIEW permission" });
  },
);

router.get(
  "/role-test",
  requireAuth,
  requireRole(Role.DISTRICT_ADMIN),
  (req: Request, res: Response) => {
    sendSuccess(res, { message: "You have DISTRICT_ADMIN role" });
  },
);

router.get(
  "/project/:projectId",
  requireAuth,
  requirePermission(Permission.PROJECT_VIEW),
  requireResourceAccess((req) => ({
    projectId: req.params.projectId as string,
  })),
  (req: Request, res: Response) => {
    sendSuccess(res, {
      message: "You have access to this project",
      projectId: req.params.projectId,
    });
  },
);

export default router;
