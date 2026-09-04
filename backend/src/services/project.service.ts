import { ProjectStatus } from "../../generated/prisma/enums.js";
import projectRepository from "../repositories/project.repository.js";
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryParams,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  AddProjectMemberDto,
} from "../types/project.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class ProjectService {
  private readonly validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
    DRAFT: [ProjectStatus.SUBMITTED, ProjectStatus.CANCELLED],
    SUBMITTED: [ProjectStatus.UNDER_REVIEW, ProjectStatus.DRAFT],
    UNDER_REVIEW: [
      ProjectStatus.APPROVED,
      ProjectStatus.ON_HOLD,
      ProjectStatus.DRAFT,
    ],
    APPROVED: [ProjectStatus.COMPLETED, ProjectStatus.ON_HOLD],
    ON_HOLD: [ProjectStatus.UNDER_REVIEW, ProjectStatus.APPROVED],
    COMPLETED: [],
    CANCELLED: [],
  };

  async createProject(data: CreateProjectDto, createdById: string) {
    const existingProject = await projectRepository.findByCode(
      data.projectCode,
    );
    if (existingProject) {
      throw new BadRequestError("Project code already exists");
    }

    logger.info(`Creating project with code: ${data.projectCode}`, {
      createdById,
    });

    const project = await projectRepository.create({
      projectCode: data.projectCode,
      name: data.name,
      projectType: data.projectType,
      description: data.description,
      implementingAgency: data.implementingAgencyId
        ? { connect: { id: data.implementingAgencyId } }
        : undefined,
      ministry: data.ministryId
        ? { connect: { id: data.ministryId } }
        : undefined,
      state: { connect: { id: data.stateId } },
      district: data.districtId
        ? { connect: { id: data.districtId } }
        : undefined,
      createdBy: { connect: { id: createdById } },
    });

    logger.info(`Project created successfully: ${project.id}`);
    return project;
  }

  async getProjects(params: ProjectQueryParams) {
    return projectRepository.findMany(params);
  }

  async getProjectById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    return project;
  }

  async updateProject(id: string, data: UpdateProjectDto, userId: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (
      project.status !== ProjectStatus.DRAFT &&
      project.status !== ProjectStatus.UNDER_REVIEW
    ) {
      throw new ForbiddenError("Cannot update project in current status");
    }

    logger.info(`Updating project: ${id}`, { userId });

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.implementingAgencyId !== undefined) {
      updateData.implementingAgency = data.implementingAgencyId
        ? { connect: { id: data.implementingAgencyId } }
        : { disconnect: true };
    }

    if (data.ministryId !== undefined) {
      updateData.ministry = data.ministryId
        ? { connect: { id: data.ministryId } }
        : { disconnect: true };
    }

    if (data.districtId !== undefined) {
      updateData.district = data.districtId
        ? { connect: { id: data.districtId } }
        : { disconnect: true };
    }

    const updatedProject = await projectRepository.update(id, updateData);
    logger.info(`Project updated successfully: ${id}`);
    return updatedProject;
  }

  async submitProject(id: string, userId: string) {
    return this.transitionProjectStatus(id, ProjectStatus.SUBMITTED, userId);
  }

  async approveProject(id: string, userId: string) {
    return this.transitionProjectStatus(id, ProjectStatus.APPROVED, userId);
  }

  async holdProject(id: string, userId: string) {
    return this.transitionProjectStatus(id, ProjectStatus.ON_HOLD, userId);
  }

  async completeProject(id: string, userId: string) {
    return this.transitionProjectStatus(id, ProjectStatus.COMPLETED, userId);
  }

  private async transitionProjectStatus(
    id: string,
    newStatus: ProjectStatus,
    userId: string,
  ) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const currentStatus = project.status;
    const allowedTransitions = this.validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestError(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }

    logger.info(
      `Transitioning project ${id} from ${currentStatus} to ${newStatus}`,
      { userId },
    );

    const updatedProject = await projectRepository.updateStatus(id, newStatus);
    logger.info(`Project status updated successfully: ${id}`);
    return updatedProject;
  }

  async createMilestone(
    projectId: string,
    data: CreateMilestoneDto,
    userId: string,
  ) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    logger.info(`Creating milestone for project: ${projectId}`, { userId });

    const milestone = await projectRepository.createMilestone({
      project: { connect: { id: projectId } },
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
      sequence: data.sequence,
      status: "PENDING",
    });

    logger.info(`Milestone created successfully: ${milestone.id}`);
    return milestone;
  }

  async getMilestones(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return projectRepository.findMilestonesByProjectId(projectId);
  }

  async updateMilestone(
    milestoneId: string,
    data: UpdateMilestoneDto,
    userId: string,
  ) {
    const milestone = await projectRepository.findMilestoneById(milestoneId);
    if (!milestone) {
      throw new NotFoundError("Milestone not found");
    }

    logger.info(`Updating milestone: ${milestoneId}`, { userId });

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate;
    }

    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.sequence !== undefined) {
      updateData.sequence = data.sequence;
    }

    const updatedMilestone = await projectRepository.updateMilestone(
      milestoneId,
      updateData,
    );
    logger.info(`Milestone updated successfully: ${milestoneId}`);
    return updatedMilestone;
  }

  async deleteMilestone(milestoneId: string, userId: string) {
    const milestone = await projectRepository.findMilestoneById(milestoneId);
    if (!milestone) {
      throw new NotFoundError("Milestone not found");
    }

    logger.info(`Deleting milestone: ${milestoneId}`, { userId });
    await projectRepository.deleteMilestone(milestoneId);
    logger.info(`Milestone deleted successfully: ${milestoneId}`);
  }

  async addMember(
    projectId: string,
    data: AddProjectMemberDto,
    userId: string,
  ) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const existingMember = await projectRepository.findMember(
      projectId,
      data.userId,
    );
    if (existingMember) {
      throw new BadRequestError("User is already a member of this project");
    }

    logger.info(`Adding member to project: ${projectId}`, {
      userId,
      newMemberId: data.userId,
    });

    const member = await projectRepository.addMember(
      projectId,
      data.userId,
      data.role,
    );
    logger.info(`Member added successfully to project: ${projectId}`);
    return member;
  }

  async getMembers(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return projectRepository.findMembersByProjectId(projectId);
  }

  async removeMember(projectId: string, memberId: string, userId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const member = await projectRepository.findMember(projectId, memberId);
    if (!member) {
      throw new NotFoundError("Member not found in this project");
    }

    logger.info(`Removing member from project: ${projectId}`, {
      userId,
      removedMemberId: memberId,
    });

    await projectRepository.removeMember(projectId, memberId);
    logger.info(`Member removed successfully from project: ${projectId}`);
  }

  async createLandRequirement(projectId: string, data: any, userId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    logger.info(`Creating land requirement for project: ${projectId}`, {
      userId,
    });

    const requirement = await projectRepository.createLandRequirement({
      project: { connect: { id: projectId } },
      requiredAreaSqMeters: data.requiredAreaSqMeters,
      landCategory: data.landCategory,
      description: data.description,
    });

    logger.info(`Land requirement created: ${requirement.id}`);
    return requirement;
  }

  async getLandRequirements(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return projectRepository.findLandRequirementsByProjectId(projectId);
  }
}

export default new ProjectService();
