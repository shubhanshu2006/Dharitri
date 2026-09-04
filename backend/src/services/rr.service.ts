import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

interface CreateRRCaseInput {
  projectId: string;
  familyId: string;
  acquisitionCaseId?: string;
  applicable: boolean;
}

interface UpdateRRCaseInput {
  applicable?: boolean;
}

interface CreateEntitlementInput {
  entitlementType: string;
  assessedValue: Record<string, any>;
}

interface UpdateEntitlementInput {
  approvedValue?: Record<string, any>;
  providedValue?: Record<string, any>;
  status?: string;
}

interface RRCaseQueryFilters {
  projectId?: string;
  familyId?: string;
  status?: string;
  applicable?: boolean;
  skip?: number;
  take?: number;
}

class RRService {
  async createRRCase(data: CreateRRCaseInput, userId: string) {
    logger.info("Creating R&R case", {
      projectId: data.projectId,
      familyId: data.familyId,
      userId,
    });

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const family = await prisma.affectedFamily.findUnique({
      where: { id: data.familyId },
    });

    if (!family) {
      throw new Error("Affected family not found");
    }

    if (data.acquisitionCaseId) {
      const acquisitionCase = await prisma.acquisitionCase.findUnique({
        where: { id: data.acquisitionCaseId },
      });

      if (!acquisitionCase) {
        throw new Error("Acquisition case not found");
      }
    }

    const rrCase = await prisma.rRCase.create({
      data: {
        projectId: data.projectId,
        familyId: data.familyId,
        acquisitionCaseId: data.acquisitionCaseId,
        applicable: data.applicable,
        status: data.applicable ? "APPLICABILITY_REVIEW" : "NOT_STARTED",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
          },
        },
        family: {
          include: {
            primaryBeneficiary: true,
            members: {
              include: {
                affectedPerson: true,
              },
            },
          },
        },
      },
    });

    logger.info("R&R case created", {
      rrCaseId: rrCase.id,
      applicable: rrCase.applicable,
    });

    return rrCase;
  }

  async getRRCase(id: string) {
    const rrCase = await prisma.rRCase.findUnique({
      where: { id },
      include: {
        project: true,
        family: {
          include: {
            primaryBeneficiary: true,
            members: {
              include: {
                affectedPerson: true,
              },
            },
          },
        },
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        entitlements: {
          orderBy: { createdAt: "desc" },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        completedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!rrCase) {
      throw new Error("R&R case not found");
    }

    return rrCase;
  }

  async listRRCases(filters: RRCaseQueryFilters) {
    const where: any = {};

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.familyId) {
      where.familyId = filters.familyId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.applicable !== undefined) {
      where.applicable = filters.applicable;
    }

    const [rrCases, total] = await Promise.all([
      prisma.rRCase.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              projectCode: true,
            },
          },
          family: {
            include: {
              primaryBeneficiary: true,
            },
          },
          entitlements: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.rRCase.count({ where }),
    ]);

    return {
      data: rrCases,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async updateRRCase(id: string, data: UpdateRRCaseInput, userId: string) {
    const existing = await prisma.rRCase.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("R&R case not found");
    }

    const updated = await prisma.rRCase.update({
      where: { id },
      data,
      include: {
        project: true,
        family: true,
        entitlements: true,
      },
    });

    logger.info("R&R case updated", {
      rrCaseId: id,
      userId,
    });

    return updated;
  }

  async transitionStatus(id: string, targetStatus: string, userId: string) {
    logger.info("Transitioning R&R case status", {
      rrCaseId: id,
      targetStatus,
      userId,
    });

    const rrCase = await prisma.rRCase.findUnique({
      where: { id },
    });

    if (!rrCase) {
      throw new Error("R&R case not found");
    }

    const validTransitions = this.getValidTransitions(rrCase.status);

    if (!validTransitions.includes(targetStatus)) {
      throw new Error(
        `Invalid transition from ${rrCase.status} to ${targetStatus}`,
      );
    }

    const updateData: any = { status: targetStatus };

    if (targetStatus === "APPROVED") {
      updateData.approvedById = userId;
      updateData.approvedAt = new Date();
    }

    if (targetStatus === "COMPLETED") {
      updateData.completedById = userId;
      updateData.completedAt = new Date();
    }

    const updated = await prisma.rRCase.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        family: true,
        entitlements: true,
      },
    });

    logger.info("R&R case status transitioned", {
      rrCaseId: id,
      fromStatus: rrCase.status,
      toStatus: targetStatus,
    });

    return updated;
  }

  private getValidTransitions(currentStatus: string): string[] {
    const transitions: Record<string, string[]> = {
      NOT_STARTED: ["APPLICABILITY_REVIEW"],
      APPLICABILITY_REVIEW: ["ASSESSMENT", "NOT_STARTED"],
      ASSESSMENT: ["APPROVAL_PENDING", "APPLICABILITY_REVIEW"],
      APPROVAL_PENDING: ["APPROVED", "ASSESSMENT", "DISPUTED"],
      APPROVED: ["PROVISION_IN_PROGRESS"],
      PROVISION_IN_PROGRESS: ["FIELD_VERIFICATION", "ON_HOLD"],
      FIELD_VERIFICATION: ["COMPLETED", "PROVISION_IN_PROGRESS"],
      COMPLETED: [],
      DISPUTED: ["APPLICABILITY_REVIEW", "ASSESSMENT"],
      ON_HOLD: ["PROVISION_IN_PROGRESS", "DISPUTED"],
    };

    return transitions[currentStatus] || [];
  }

  async createEntitlement(
    rrCaseId: string,
    data: CreateEntitlementInput,
    userId: string,
  ) {
    logger.info("Creating R&R entitlement", {
      rrCaseId,
      entitlementType: data.entitlementType,
      userId,
    });

    const rrCase = await prisma.rRCase.findUnique({
      where: { id: rrCaseId },
    });

    if (!rrCase) {
      throw new Error("R&R case not found");
    }

    if (rrCase.status === "COMPLETED") {
      throw new Error("Cannot add entitlement to completed R&R case");
    }

    const entitlement = await prisma.rREntitlement.create({
      data: {
        rrCaseId,
        entitlementType: data.entitlementType,
        assessedValue: data.assessedValue,
        status: "ASSESSED",
      },
      include: {
        rrCase: {
          include: {
            family: true,
          },
        },
      },
    });

    if (
      rrCase.status === "NOT_STARTED" ||
      rrCase.status === "APPLICABILITY_REVIEW"
    ) {
      await prisma.rRCase.update({
        where: { id: rrCaseId },
        data: {
          status: "ASSESSMENT",
          assessmentCompletedAt: new Date(),
        },
      });
    }

    logger.info("R&R entitlement created", {
      entitlementId: entitlement.id,
      rrCaseId,
    });

    return entitlement;
  }

  async updateEntitlement(
    id: string,
    data: UpdateEntitlementInput,
    userId: string,
  ) {
    const existing = await prisma.rREntitlement.findUnique({
      where: { id },
      include: {
        rrCase: true,
      },
    });

    if (!existing) {
      throw new Error("Entitlement not found");
    }

    if (existing.rrCase.status === "COMPLETED") {
      throw new Error("Cannot update entitlement for completed R&R case");
    }

    const updated = await prisma.rREntitlement.update({
      where: { id },
      data,
      include: {
        rrCase: {
          include: {
            family: true,
          },
        },
      },
    });

    logger.info("R&R entitlement updated", {
      entitlementId: id,
      userId,
    });

    return updated;
  }

  async getEntitlement(id: string) {
    const entitlement = await prisma.rREntitlement.findUnique({
      where: { id },
      include: {
        rrCase: {
          include: {
            family: {
              include: {
                primaryBeneficiary: true,
              },
            },
            project: true,
          },
        },
      },
    });

    if (!entitlement) {
      throw new Error("Entitlement not found");
    }

    return entitlement;
  }
}

export default new RRService();
