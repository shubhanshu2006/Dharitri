import { Prisma } from "../../generated/prisma/client.js";
import { ProjectStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../database/client.js";
import { ProjectQueryParams } from "../types/project.js";

export class ProjectRepository {
  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: {
        state: true,
        district: true,
        implementingAgency: true,
        ministry: true,
        createdBy: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        state: true,
        district: true,
        implementingAgency: true,
        ministry: true,
        createdBy: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        milestones: {
          orderBy: { sequence: "asc" },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                clerkUserId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async findByCode(projectCode: string) {
    return prisma.project.findUnique({
      where: { projectCode },
    });
  }

  async findMany(params: ProjectQueryParams) {
    const {
      status,
      projectType,
      stateId,
      districtId,
      search,
      page = 1,
      limit = 20,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (stateId) {
      where.stateId = stateId;
    }

    if (districtId) {
      where.districtId = districtId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { projectCode: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          state: true,
          district: true,
          implementingAgency: true,
          ministry: true,
          createdBy: {
            select: {
              id: true,
              clerkUserId: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        state: true,
        district: true,
        implementingAgency: true,
        ministry: true,
        createdBy: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id },
      data: { status },
    });
  }

  async createMilestone(data: Prisma.ProjectMilestoneCreateInput) {
    return prisma.projectMilestone.create({
      data,
    });
  }

  async findMilestoneById(id: string) {
    return prisma.projectMilestone.findUnique({
      where: { id },
    });
  }

  async findMilestonesByProjectId(projectId: string) {
    return prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { sequence: "asc" },
    });
  }

  async updateMilestone(id: string, data: Prisma.ProjectMilestoneUpdateInput) {
    return prisma.projectMilestone.update({
      where: { id },
      data,
    });
  }

  async deleteMilestone(id: string) {
    return prisma.projectMilestone.delete({
      where: { id },
    });
  }

  async addMember(projectId: string, userId: string, role: string) {
    return prisma.projectMember.create({
      data: {
        project: { connect: { id: projectId } },
        user: { connect: { id: userId } },
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findMember(projectId: string, userId: string) {
    return prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async findMembersByProjectId(projectId: string) {
    return prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async removeMember(projectId: string, userId: string) {
    return prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async createLandRequirement(data: Prisma.LandRequirementCreateInput) {
    return prisma.landRequirement.create({
      data,
    });
  }

  async findLandRequirementsByProjectId(projectId: string) {
    return prisma.landRequirement.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new ProjectRepository();
