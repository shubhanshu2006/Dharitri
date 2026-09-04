import { prisma } from "../database/client.js";
import { RoutingDecision } from "../types/verification.js";
import { NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class RoutingService {
  async routeAcquisitionCase(
    acquisitionParcelId: string,
  ): Promise<RoutingDecision> {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
      include: {
        project: {
          include: {
            state: true,
            district: true,
          },
        },
        cadastralParcel: {
          include: {
            state: true,
            district: true,
          },
        },
      },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    logger.info("Determining routing for acquisition case", {
      acquisitionParcelId,
    });

    const districtId =
      acquisitionParcel.project.districtId ||
      acquisitionParcel.cadastralParcel.districtId;

    if (!districtId) {
      return {
        targetLevel: "STATE",
        targetId: acquisitionParcel.project.stateId,
        reason: "No district specified, routing to state level",
        priority: "MEDIUM",
      };
    }

    const assignee = await this.findAvailableOfficer(districtId);

    const decision: RoutingDecision = {
      targetLevel: "DISTRICT",
      targetId: districtId,
      assigneeId: assignee?.id,
      reason: assignee
        ? `Assigned to ${assignee.name}`
        : "Routing to district, no officer assigned",
      priority: this.determinePriority(acquisitionParcel),
    };

    logger.info("Routing decision made", {
      acquisitionParcelId,
      targetLevel: decision.targetLevel,
      targetId: decision.targetId,
      assigneeId: decision.assigneeId,
      priority: decision.priority,
    });

    return decision;
  }

  private async findAvailableOfficer(districtId: string) {
    const officers = await prisma.user.findMany({
      where: {
        isActive: true,
        roles: {
          some: {
            role: {
              code: "LAND_ACQUISITION_OFFICER",
            },
          },
        },
        scopes: {
          some: {
            scopeLevel: "DISTRICT",
            districtId,
          },
        },
      },
      take: 1,
    });

    return officers[0] || null;
  }

  private determinePriority(
    acquisitionParcel: any,
  ): "LOW" | "MEDIUM" | "HIGH" | "URGENT" {
    const area = parseFloat(acquisitionParcel.requiredAreaSqMeters);

    if (area > 50000) return "URGENT";
    if (area > 20000) return "HIGH";
    if (area > 5000) return "MEDIUM";
    return "LOW";
  }

  async assignAcquisitionCase(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    logger.info("Assigning acquisition case", {
      acquisitionParcelId,
      userId,
      userName: user.name,
    });

    await prisma.acquisitionParcel.update({
      where: { id: acquisitionParcelId },
      data: {
        currentAssignee: { connect: { id: userId } },
      },
    });

    logger.info("Acquisition case assigned successfully", {
      acquisitionParcelId,
      userId,
    });
  }

  async unassignAcquisitionCase(acquisitionParcelId: string): Promise<void> {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    logger.info("Unassigning acquisition case", { acquisitionParcelId });

    await prisma.acquisitionParcel.update({
      where: { id: acquisitionParcelId },
      data: {
        currentAssignee: { disconnect: true },
      },
    });

    logger.info("Acquisition case unassigned successfully", {
      acquisitionParcelId,
    });
  }
}

export default new RoutingService();
