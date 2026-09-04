import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

interface CreateFieldVisitInput {
  projectId: string;
  acquisitionCaseId?: string;
  startedAt: Date;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
  remarks?: string;
  clientOperationId?: string;
}

interface UploadEvidenceInput {
  evidenceType: string;
  documentId: string;
  capturedAt?: Date;
  latitude?: number;
  longitude?: number;
}

interface UpdateChecklistItemInput {
  checklistItemId: string;
  status: string;
  remarks?: string;
}

class FieldService {
  async createFieldVisit(data: CreateFieldVisitInput, userId: string) {
    logger.info("Creating field visit", {
      projectId: data.projectId,
      userId,
      clientOperationId: data.clientOperationId,
    });

    if (data.clientOperationId) {
      const existing = await prisma.fieldVisit.findUnique({
        where: { clientOperationId: data.clientOperationId },
      });

      if (existing) {
        logger.info("Field visit already exists (idempotent)", {
          clientOperationId: data.clientOperationId,
          visitId: existing.id,
        });
        return this.getFieldVisit(existing.id);
      }
    }

    const visit = await prisma.fieldVisit.create({
      data: {
        projectId: data.projectId,
        acquisitionCaseId: data.acquisitionCaseId,
        officerId: userId,
        status: "DRAFT",
        startedAt: data.startedAt,
        latitude: data.latitude,
        longitude: data.longitude,
        gpsAccuracyMeters: data.gpsAccuracyMeters,
        remarks: data.remarks,
        clientOperationId: data.clientOperationId,
      },
      include: {
        project: true,
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidence: {
          include: {
            document: {
              include: {
                currentVersion: true,
              },
            },
          },
        },
        checklistItems: true,
      },
    });

    await this.initializeChecklist(visit.id);

    logger.info("Field visit created", {
      visitId: visit.id,
      projectId: data.projectId,
    });

    return this.getFieldVisit(visit.id);
  }

  async getFieldVisit(visitId: string) {
    const visit = await prisma.fieldVisit.findUnique({
      where: { id: visitId },
      include: {
        project: true,
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidence: {
          include: {
            document: {
              include: {
                currentVersion: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        checklistItems: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return visit;
  }

  async listFieldVisits(filters: {
    projectId?: string;
    acquisitionCaseId?: string;
    officerId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.acquisitionCaseId) {
      where.acquisitionCaseId = filters.acquisitionCaseId;
    }

    if (filters.officerId) {
      where.officerId = filters.officerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.startedAt = {};
      if (filters.dateFrom) {
        where.startedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.startedAt.lte = filters.dateTo;
      }
    }

    const [visits, total] = await Promise.all([
      prisma.fieldVisit.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { startedAt: "desc" },
        include: {
          project: true,
          acquisitionCase: {
            include: {
              acquisitionParcel: {
                include: {
                  cadastralParcel: true,
                },
              },
            },
          },
          officer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          evidence: true,
          checklistItems: {
            where: { status: "PENDING" },
          },
        },
      }),
      prisma.fieldVisit.count({ where }),
    ]);

    return {
      data: visits,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async uploadEvidence(
    visitId: string,
    data: UploadEvidenceInput,
    userId: string,
  ) {
    logger.info("Uploading field evidence", {
      visitId,
      evidenceType: data.evidenceType,
      userId,
    });

    const visit = await prisma.fieldVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new Error("Field visit not found");
    }

    if (visit.status === "SUBMITTED" || visit.status === "VERIFIED") {
      throw new Error(
        `Cannot upload evidence for visit in ${visit.status} status`,
      );
    }

    const evidence = await prisma.fieldEvidence.create({
      data: {
        fieldVisitId: visitId,
        documentId: data.documentId,
        evidenceType: data.evidenceType,
        capturedAt: data.capturedAt || new Date(),
        latitude: data.latitude,
        longitude: data.longitude,
      },
      include: {
        document: {
          include: {
            currentVersion: true,
          },
        },
      },
    });

    if (visit.status === "DRAFT") {
      await prisma.fieldVisit.update({
        where: { id: visitId },
        data: { status: "IN_PROGRESS" },
      });
    }

    logger.info("Field evidence uploaded", {
      evidenceId: evidence.id,
      visitId,
    });

    return evidence;
  }

  async updateChecklistItem(data: UpdateChecklistItemInput, userId: string) {
    const item = await prisma.fieldChecklistItem.findUnique({
      where: { id: data.checklistItemId },
      include: {
        fieldVisit: true,
      },
    });

    if (!item) {
      throw new Error("Checklist item not found");
    }

    if (
      item.fieldVisit.status === "SUBMITTED" ||
      item.fieldVisit.status === "VERIFIED"
    ) {
      throw new Error(
        `Cannot update checklist for visit in ${item.fieldVisit.status} status`,
      );
    }

    const updated = await prisma.fieldChecklistItem.update({
      where: { id: data.checklistItemId },
      data: {
        status: data.status as any,
        remarks: data.remarks,
      },
    });

    logger.info("Checklist item updated", {
      itemId: data.checklistItemId,
      status: updated.status,
      userId,
    });

    return updated;
  }

  async submitFieldVisit(visitId: string, userId: string) {
    logger.info("Submitting field visit", {
      visitId,
      userId,
    });

    const visit = await prisma.fieldVisit.findUnique({
      where: { id: visitId },
      include: {
        checklistItems: true,
        evidence: true,
      },
    });

    if (!visit) {
      throw new Error("Field visit not found");
    }

    if (visit.officerId !== userId) {
      throw new Error("Only the assigned officer can submit the visit");
    }

    if (visit.status === "SUBMITTED" || visit.status === "VERIFIED") {
      throw new Error(`Visit already in ${visit.status} status`);
    }

    const pendingItems = visit.checklistItems.filter(
      (item) => item.status === "PENDING" || item.status === "FAIL",
    );

    if (pendingItems.length > 0) {
      throw new Error(
        `Cannot submit: ${pendingItems.length} checklist items incomplete`,
      );
    }

    if (visit.evidence.length === 0) {
      throw new Error("Cannot submit: no evidence uploaded");
    }

    const updated = await prisma.fieldVisit.update({
      where: { id: visitId },
      data: {
        status: "SUBMITTED",
        completedAt: new Date(),
      },
      include: {
        project: true,
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidence: {
          include: {
            document: {
              include: {
                currentVersion: true,
              },
            },
          },
        },
        checklistItems: true,
      },
    });

    logger.info("Field visit submitted", {
      visitId,
      completedAt: updated.completedAt,
    });

    return updated;
  }

  async verifyFieldVisit(visitId: string, userId: string) {
    logger.info("Verifying field visit", {
      visitId,
      userId,
    });

    const visit = await prisma.fieldVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new Error("Field visit not found");
    }

    if (visit.status !== "SUBMITTED") {
      throw new Error(`Cannot verify visit in ${visit.status} status`);
    }

    const updated = await prisma.fieldVisit.update({
      where: { id: visitId },
      data: {
        status: "VERIFIED",
      },
      include: {
        project: true,
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: true,
              },
            },
          },
        },
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidence: {
          include: {
            document: {
              include: {
                currentVersion: true,
              },
            },
          },
        },
        checklistItems: true,
      },
    });

    logger.info("Field visit verified", {
      visitId,
      userId,
    });

    return updated;
  }

  async requestCorrection(visitId: string, remarks: string, userId: string) {
    logger.info("Requesting correction for field visit", {
      visitId,
      userId,
    });

    const visit = await prisma.fieldVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new Error("Field visit not found");
    }

    if (visit.status !== "SUBMITTED") {
      throw new Error(
        `Cannot request correction for visit in ${visit.status} status`,
      );
    }

    const updated = await prisma.fieldVisit.update({
      where: { id: visitId },
      data: {
        status: "REQUIRES_CORRECTION",
        remarks: remarks,
      },
      include: {
        project: true,
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Correction requested", {
      visitId,
      userId,
    });

    return updated;
  }

  private async initializeChecklist(visitId: string) {
    const defaultChecklist: Array<{
      checkName: string;
      status: "PENDING";
    }> = [
      { checkName: "Parcel boundary verified", status: "PENDING" },
      { checkName: "Land use confirmed", status: "PENDING" },
      { checkName: "Occupancy status verified", status: "PENDING" },
      { checkName: "Structures documented", status: "PENDING" },
      { checkName: "Affected persons identified", status: "PENDING" },
      { checkName: "Photographic evidence captured", status: "PENDING" },
    ];

    await prisma.fieldChecklistItem.createMany({
      data: defaultChecklist.map((item) => ({
        fieldVisitId: visitId,
        ...item,
      })),
    });
  }
}

export default new FieldService();
