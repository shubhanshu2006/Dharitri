import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

interface RecordPossessionInput {
  possessionDate: Date;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

interface UpdateChecklistItemInput {
  status: string;
  remarks?: string;
}

class PossessionService {
  async getPossessionRecord(acquisitionCaseId: string) {
    const possession = await prisma.possessionRecord.findFirst({
      where: { acquisitionCaseId },
      include: {
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        recordedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: {
          include: {
            completedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return possession;
  }

  async listPossessionRecords(filters: {
    status?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    const [possessions, total] = await Promise.all([
      prisma.possessionRecord.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          acquisitionCase: {
            include: {
              acquisitionParcel: {
                include: {
                  cadastralParcel: true,
                },
              },
            },
          },
          recordedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          checklistItems: {
            where: { status: { notIn: ["PASS", "NOT_APPLICABLE"] } },
          },
        },
      }),
      prisma.possessionRecord.count({ where }),
    ]);

    return {
      data: possessions,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async recordPossession(
    acquisitionCaseId: string,
    data: RecordPossessionInput,
    userId: string,
  ) {
    logger.info("Recording possession", {
      acquisitionCaseId,
      userId,
    });

    const acquisitionCase = await prisma.acquisitionCase.findUnique({
      where: { id: acquisitionCaseId },
    });

    if (!acquisitionCase) {
      throw new Error("Acquisition case not found");
    }

    let possession = await prisma.possessionRecord.findFirst({
      where: { acquisitionCaseId },
      include: {
        checklistItems: true,
      },
    });

    if (!possession) {
      possession = await prisma.possessionRecord.create({
        data: {
          acquisitionCaseId,
          status: "PENDING",
        },
        include: {
          checklistItems: true,
        },
      });

      await this.initializeChecklist(possession.id);

      possession = (await prisma.possessionRecord.findUnique({
        where: { id: possession.id },
        include: {
          checklistItems: true,
        },
      }))!;
    }

    if (possession.status === "RECORDED") {
      throw new Error("Possession already recorded");
    }

    const incompleteItems = possession.checklistItems.filter(
      (item) => item.status === "PENDING" || item.status === "FAIL",
    );

    if (incompleteItems.length > 0) {
      throw new Error(
        `Cannot record possession: ${incompleteItems.length} checklist items incomplete`,
      );
    }

    const updated = await prisma.possessionRecord.update({
      where: { id: possession.id },
      data: {
        status: "RECORDED",
        possessionDate: data.possessionDate,
        latitude: data.latitude,
        longitude: data.longitude,
        remarks: data.remarks,
        recordedById: userId,
      },
      include: {
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        recordedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: {
          include: {
            completedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    logger.info("Possession recorded successfully", {
      possessionId: updated.id,
      acquisitionCaseId,
    });

    return updated;
  }

  private async initializeChecklist(possessionRecordId: string) {
    const defaultChecklist: Array<{
      checkName: string;
      status: "PENDING";
    }> = [
      { checkName: "Physical boundary verification", status: "PENDING" },
      { checkName: "Clear encumbrance check", status: "PENDING" },
      { checkName: "No unauthorized occupation", status: "PENDING" },
      { checkName: "Documentation verification", status: "PENDING" },
      { checkName: "Photographic evidence captured", status: "PENDING" },
    ];

    await prisma.possessionChecklistItem.createMany({
      data: defaultChecklist.map((item) => ({
        possessionRecordId,
        ...item,
      })),
    });
  }

  async updateChecklistItem(
    itemId: string,
    data: UpdateChecklistItemInput,
    userId: string,
  ) {
    const item = await prisma.possessionChecklistItem.findUnique({
      where: { id: itemId },
      include: {
        possessionRecord: true,
      },
    });

    if (!item) {
      throw new Error("Checklist item not found");
    }

    if (item.possessionRecord.status === "RECORDED") {
      throw new Error("Cannot update checklist for recorded possession");
    }

    const updated = await prisma.possessionChecklistItem.update({
      where: { id: itemId },
      data: {
        status: data.status as any,
        remarks: data.remarks,
        completedAt: new Date(),
        completedById: userId,
      },
      include: {
        possessionRecord: true,
        completedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Checklist item updated", {
      itemId,
      status: updated.status,
      userId,
    });

    return updated;
  }

  async issueNotice(acquisitionCaseId: string, userId: string) {
    logger.info("Issuing possession notice", {
      acquisitionCaseId,
      userId,
    });

    let possession = await prisma.possessionRecord.findFirst({
      where: { acquisitionCaseId },
    });

    if (!possession) {
      possession = await prisma.possessionRecord.create({
        data: {
          acquisitionCaseId,
          status: "NOTICE_ISSUED",
        },
      });

      await this.initializeChecklist(possession.id);
    } else {
      if (possession.status !== "PENDING") {
        throw new Error(`Cannot issue notice in status: ${possession.status}`);
      }

      possession = await prisma.possessionRecord.update({
        where: { id: possession.id },
        data: {
          status: "NOTICE_ISSUED",
        },
      });
    }

    logger.info("Possession notice issued", {
      possessionId: possession.id,
      acquisitionCaseId,
    });

    return possession;
  }

  async markReady(possessionRecordId: string, userId: string) {
    const possession = await prisma.possessionRecord.findUnique({
      where: { id: possessionRecordId },
      include: {
        checklistItems: true,
      },
    });

    if (!possession) {
      throw new Error("Possession record not found");
    }

    if (possession.status !== "NOTICE_ISSUED") {
      throw new Error(`Cannot mark ready from status: ${possession.status}`);
    }

    const updated = await prisma.possessionRecord.update({
      where: { id: possessionRecordId },
      data: {
        status: "READY",
      },
      include: {
        acquisitionCase: true,
        checklistItems: true,
      },
    });

    logger.info("Possession marked ready", {
      possessionId: possessionRecordId,
      userId,
    });

    return updated;
  }
}

export default new PossessionService();
