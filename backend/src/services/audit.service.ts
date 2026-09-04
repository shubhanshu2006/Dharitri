import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";
import crypto from "crypto";

interface CreateAuditEventInput {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  requestId?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

class AuditService {
  async logEvent(data: CreateAuditEventInput) {
    try {
      const event = await prisma.auditEvent.create({
        data: {
          actorId: data.actorId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          timestamp: new Date(),
          oldValue: data.oldValue || null,
          newValue: data.newValue || null,
          reason: data.reason,
          requestId: data.requestId || crypto.randomUUID(),
          source: data.source || "API",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      logger.info("Audit event logged", {
        eventId: event.id,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        actorId: data.actorId,
      });

      return event;
    } catch (error) {
      logger.error("Failed to log audit event", {
        error,
        data,
      });
    }
  }

  async getEntityTimeline(entityType: string, entityId: string) {
    const events = await prisma.auditEvent.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { timestamp: "asc" },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return events;
  }

  async getActivityLog(filters: {
    actorId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    dateFrom?: Date;
    dateTo?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.actorId) {
      where.actorId = filters.actorId;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.timestamp = {};
      if (filters.dateFrom) {
        where.timestamp.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.timestamp.lte = filters.dateTo;
      }
    }

    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 50,
        orderBy: { timestamp: "desc" },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditEvent.count({ where }),
    ]);

    return {
      data: events,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 50)) + 1,
      pageSize: filters.take || 50,
    };
  }

  async logProjectCreated(
    projectId: string,
    projectData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "PROJECT_CREATED",
      entityType: "PROJECT",
      entityId: projectId,
      newValue: projectData,
    });
  }

  async logProjectUpdated(
    projectId: string,
    oldData: any,
    newData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "PROJECT_UPDATED",
      entityType: "PROJECT",
      entityId: projectId,
      oldValue: oldData,
      newValue: newData,
    });
  }

  async logProjectStatusChanged(
    projectId: string,
    oldStatus: string,
    newStatus: string,
    actorId: string,
    reason?: string,
  ) {
    await this.logEvent({
      actorId,
      action: "PROJECT_STATUS_CHANGED",
      entityType: "PROJECT",
      entityId: projectId,
      oldValue: { status: oldStatus },
      newValue: { status: newStatus },
      reason,
    });
  }

  async logParcelImported(parcelId: string, parcelData: any, actorId?: string) {
    await this.logEvent({
      actorId,
      action: "PARCEL_IMPORTED",
      entityType: "PARCEL",
      entityId: parcelId,
      newValue: parcelData,
      source: "INTEGRATION",
    });
  }

  async logVerificationStarted(caseId: string, actorId: string) {
    await this.logEvent({
      actorId,
      action: "VERIFICATION_STARTED",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
    });
  }

  async logVerificationCompleted(
    caseId: string,
    result: string,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "VERIFICATION_COMPLETED",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      newValue: { result },
    });
  }

  async logCaseStatusChanged(
    caseId: string,
    oldStatus: string,
    newStatus: string,
    actorId: string,
    reason?: string,
  ) {
    await this.logEvent({
      actorId,
      action: "CASE_STATUS_CHANGED",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      oldValue: { status: oldStatus },
      newValue: { status: newStatus },
      reason,
    });
  }

  async logCompensationAssessed(
    assessmentId: string,
    assessmentData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "COMPENSATION_ASSESSED",
      entityType: "COMPENSATION_ASSESSMENT",
      entityId: assessmentId,
      newValue: assessmentData,
    });
  }

  async logCompensationApproved(
    awardId: string,
    approvedAmount: number,
    actorId: string,
    reason?: string,
  ) {
    await this.logEvent({
      actorId,
      action: "COMPENSATION_APPROVED",
      entityType: "COMPENSATION_AWARD",
      entityId: awardId,
      newValue: { approvedAmount },
      reason,
    });
  }

  async logPaymentInitiated(
    paymentId: string,
    paymentData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "PAYMENT_INITIATED",
      entityType: "PAYMENT",
      entityId: paymentId,
      newValue: paymentData,
    });
  }

  async logPaymentStatusChanged(
    paymentId: string,
    oldStatus: string,
    newStatus: string,
    actorId?: string,
  ) {
    await this.logEvent({
      actorId,
      action: "PAYMENT_STATUS_CHANGED",
      entityType: "PAYMENT",
      entityId: paymentId,
      oldValue: { status: oldStatus },
      newValue: { status: newStatus },
      source: actorId ? "API" : "WEBHOOK",
    });
  }

  async logRRCompleted(rrCaseId: string, actorId: string) {
    await this.logEvent({
      actorId,
      action: "RR_COMPLETED",
      entityType: "RR_CASE",
      entityId: rrCaseId,
    });
  }

  async logPossessionRecorded(
    possessionId: string,
    possessionData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "POSSESSION_RECORDED",
      entityType: "POSSESSION_RECORD",
      entityId: possessionId,
      newValue: possessionData,
    });
  }

  async logDocumentUploaded(
    documentId: string,
    documentData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "DOCUMENT_UPLOADED",
      entityType: "DOCUMENT",
      entityId: documentId,
      newValue: documentData,
    });
  }

  async logFieldVisitSubmitted(
    visitId: string,
    visitData: any,
    actorId: string,
  ) {
    await this.logEvent({
      actorId,
      action: "FIELD_VISIT_SUBMITTED",
      entityType: "FIELD_VISIT",
      entityId: visitId,
      newValue: visitData,
    });
  }

  async logCaseAssigned(
    caseId: string,
    assignedToId: string,
    actorId: string,
    reason?: string,
  ) {
    await this.logEvent({
      actorId,
      action: "CASE_ASSIGNED",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      newValue: { assignedToId },
      reason,
    });
  }
}

export default new AuditService();
