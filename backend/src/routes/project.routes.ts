import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.PROJECT_CREATE),
  projectController.createProject,
);

router.get(
  "/",
  requirePermission(Permission.PROJECT_VIEW),
  projectController.getProjects,
);

router.get(
  "/:id",
  requirePermission(Permission.PROJECT_VIEW),
  projectController.getProjectById,
);

router.patch(
  "/:id",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.updateProject,
);

router.post(
  "/:id/submit",
  requirePermission(Permission.PROJECT_SUBMIT),
  projectController.submitProject,
);

router.post(
  "/:id/approve",
  requirePermission(Permission.PROJECT_APPROVE),
  projectController.approveProject,
);

router.post(
  "/:id/hold",
  requirePermission(Permission.PROJECT_APPROVE),
  projectController.holdProject,
);

router.post(
  "/:id/complete",
  requirePermission(Permission.PROJECT_APPROVE),
  projectController.completeProject,
);

router.post(
  "/:id/milestones",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.createMilestone,
);

router.get(
  "/:id/milestones",
  requirePermission(Permission.PROJECT_VIEW),
  projectController.getMilestones,
);

router.patch(
  "/milestones/:milestoneId",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.updateMilestone,
);

router.delete(
  "/milestones/:milestoneId",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.deleteMilestone,
);

router.post(
  "/:id/members",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.addMember,
);

router.get(
  "/:id/members",
  requirePermission(Permission.PROJECT_VIEW),
  projectController.getMembers,
);

router.delete(
  "/:id/members/:memberId",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.removeMember,
);

export default router;

router.post(
  "/:id/land-requirements",
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.createLandRequirement,
);

router.get(
  "/:id/land-requirements",
  requirePermission(Permission.PROJECT_VIEW),
  projectController.getLandRequirements,
);
