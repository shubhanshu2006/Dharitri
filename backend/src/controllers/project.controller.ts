import { Request, Response, NextFunction } from "express";
import projectService from "../services/project.service.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  addProjectMemberSchema,
} from "../validators/project.validator.js";
import { successResponse } from "../utils/response.js";
import { logger } from "../utils/logger.js";

export class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.createProject(validatedData, userId);
      return successResponse(res, project, "Project created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = projectQuerySchema.parse(req.query);
      const result = await projectService.getProjects(validatedQuery);
      return successResponse(res, result, "Projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const project = await projectService.getProjectById(id);
      return successResponse(res, project, "Project retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateProjectSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.updateProject(
        id,
        validatedData,
        userId,
      );
      return successResponse(res, project, "Project updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async submitProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.submitProject(id, userId);
      return successResponse(res, project, "Project submitted successfully");
    } catch (error) {
      next(error);
    }
  }

  async approveProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.approveProject(id, userId);
      return successResponse(res, project, "Project approved successfully");
    } catch (error) {
      next(error);
    }
  }

  async holdProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.holdProject(id, userId);
      return successResponse(res, project, "Project put on hold successfully");
    } catch (error) {
      next(error);
    }
  }

  async completeProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const project = await projectService.completeProject(id, userId);
      return successResponse(res, project, "Project completed successfully");
    } catch (error) {
      next(error);
    }
  }

  async createMilestone(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = createMilestoneSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const milestone = await projectService.createMilestone(
        id,
        validatedData,
        userId,
      );
      return successResponse(
        res,
        milestone,
        "Milestone created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getMilestones(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const milestones = await projectService.getMilestones(id);
      return successResponse(
        res,
        milestones,
        "Milestones retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async updateMilestone(req: Request, res: Response, next: NextFunction) {
    try {
      const milestoneId = req.params.milestoneId as string;
      const validatedData = updateMilestoneSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const milestone = await projectService.updateMilestone(
        milestoneId,
        validatedData,
        userId,
      );
      return successResponse(res, milestone, "Milestone updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteMilestone(req: Request, res: Response, next: NextFunction) {
    try {
      const milestoneId = req.params.milestoneId as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await projectService.deleteMilestone(milestoneId, userId);
      return successResponse(res, null, "Milestone deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = addProjectMemberSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const member = await projectService.addMember(id, validatedData, userId);
      return successResponse(res, member, "Member added successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const members = await projectService.getMembers(id);
      return successResponse(res, members, "Members retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const memberId = req.params.memberId as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await projectService.removeMember(id, memberId, userId);
      return successResponse(res, null, "Member removed successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
