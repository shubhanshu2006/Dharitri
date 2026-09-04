import { AcquisitionStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../database/client.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class AcquisitionWorkflowService {
  private readonly validTransitions: Record<
    AcquisitionStatus,
    AcquisitionStatus[]
  > = {
    DRAFT: [AcquisitionStatus.SUBMITTED, AcquisitionStatus.CANCELLED],
    SUBMITTED: [AcquisitionStatus.UNDER_REVIEW, AcquisitionStatus.DRAFT],
    UNDER_REVIEW: [
      AcquisitionStatus.VERIFICATION_PENDING,
      AcquisitionStatus.ON_HOLD,
      AcquisitionStatus.DRAFT,
    ],
    VERIFICATION_PENDING: [
      AcquisitionStatus.VERIFIED,
      AcquisitionStatus.UNDER_REVIEW,
      AcquisitionStatus.ON_HOLD,
    ],
    VERIFIED: [
      AcquisitionStatus.ACQUISITION_INITIATED,
      AcquisitionStatus.ON_HOLD,
    ],
    ACQUISITION_INITIATED: [
      AcquisitionStatus.NOTIFICATION_STAGE,
      AcquisitionStatus.ON_HOLD,
    ],
    NOTIFICATION_STAGE: [
      AcquisitionStatus.AWARD_STAGE,
      AcquisitionStatus.ON_HOLD,
    ],
    AWARD_STAGE: [
      AcquisitionStatus.ACQUISITION_COMPLETED,
      AcquisitionStatus.ON_HOLD,
    ],
    ACQUISITION_COMPLETED: [],
    ON_HOLD: [
      AcquisitionStatus.UNDER_REVIEW,
      AcquisitionStatus.VERIFICATION_PENDING,
      AcquisitionStatus.VERIFIED,
      AcquisitionStatus.ACQUISITION_INITIATED,
      AcquisitionStatus.NOTIFICATION_STAGE,
      AcquisitionStatus.AWARD_STAGE,
    ],
    CANCELLED: [],
  };

  canTransition(
    currentStatus: AcquisitionStatus,
    newStatus: AcquisitionStatus,
  ): boolean {
    const allowedTransitions = this.validTransitions[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  async transition(
    acquisitionParcelId: string,
    newStatus: AcquisitionStatus,
    userId: string,
    reason?: string,
  ): Promise<void> {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    const currentStatus = acquisitionParcel.status;

    if (!this.canTransition(currentStatus, newStatus)) {
      throw new BadRequestError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    logger.info("Transitioning acquisition status", {
      acquisitionParcelId,
      currentStatus,
      newStatus,
      userId,
      reason,
    });

    await prisma.$transaction(async (tx) => {
      await tx.acquisitionParcel.update({
        where: { id: acquisitionParcelId },
        data: { status: newStatus },
      });

      await this.recordTransition(
        tx,
        acquisitionParcelId,
        currentStatus,
        newStatus,
        userId,
        reason,
      );
    });

    logger.info("Status transition completed", {
      acquisitionParcelId,
      newStatus,
    });
  }

  private async recordTransition(
    tx: any,
    acquisitionParcelId: string,
    fromStatus: AcquisitionStatus,
    toStatus: AcquisitionStatus,
    userId: string,
    reason?: string,
  ): Promise<void> {
    await tx.auditEvent.create({
      data: {
        actor: { connect: { id: userId } },
        action: "STATUS_TRANSITION",
        entityType: "ACQUISITION_PARCEL",
        entityId: acquisitionParcelId,
        oldValue: fromStatus,
        newValue: toStatus,
        reason: reason || `Status changed from ${fromStatus} to ${toStatus}`,
        source: "WORKFLOW_SERVICE",
      },
    });
  }

  async submitForReview(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.SUBMITTED,
      userId,
      "Submitted for review",
    );
  }

  async startReview(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.UNDER_REVIEW,
      userId,
      "Review started",
    );
  }

  async requestVerification(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.VERIFICATION_PENDING,
      userId,
      "Verification requested",
    );
  }

  async markVerified(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.VERIFIED,
      userId,
      "Verification completed",
    );
  }

  async initiateAcquisition(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.ACQUISITION_INITIATED,
      userId,
      "Acquisition process initiated",
    );
  }

  async moveToNotificationStage(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.NOTIFICATION_STAGE,
      userId,
      "Moved to notification stage",
    );
  }

  async moveToAwardStage(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.AWARD_STAGE,
      userId,
      "Moved to award stage",
    );
  }

  async markCompleted(
    acquisitionParcelId: string,
    userId: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.ACQUISITION_COMPLETED,
      userId,
      "Acquisition completed",
    );
  }

  async putOnHold(
    acquisitionParcelId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.ON_HOLD,
      userId,
      reason,
    );
  }

  async cancel(
    acquisitionParcelId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    await this.transition(
      acquisitionParcelId,
      AcquisitionStatus.CANCELLED,
      userId,
      reason,
    );
  }

  async getWorkflowHistory(acquisitionParcelId: string) {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    return prisma.auditEvent.findMany({
      where: {
        entityType: "ACQUISITION_PARCEL",
        entityId: acquisitionParcelId,
        action: "STATUS_TRANSITION",
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });
  }
}

export default new AcquisitionWorkflowService();
