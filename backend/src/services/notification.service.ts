import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  channels?: string[];
}

class NotificationService {
  async createNotification(data: CreateNotificationInput) {
    logger.info("Creating notification", {
      userId: data.userId,
      type: data.type,
    });

    const notification = await prisma.$transaction(async (tx) => {
      const notif = await tx.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          entityType: data.entityType,
          entityId: data.entityId,
          status: "PENDING",
        },
      });

      const channels = data.channels || ["IN_APP"];
      await tx.notificationDelivery.createMany({
        data: channels.map((channel) => ({
          notificationId: notif.id,
          channel: channel as any,
          status: "PENDING",
        })),
      });

      if (channels.includes("IN_APP")) {
        await tx.notificationDelivery.updateMany({
          where: {
            notificationId: notif.id,
            channel: "IN_APP",
          },
          data: {
            status: "DELIVERED",
            sentAt: new Date(),
            deliveredAt: new Date(),
          },
        });
      }

      return tx.notification.findUnique({
        where: { id: notif.id },
        include: {
          deliveries: true,
        },
      });
    });

    logger.info("Notification created", {
      notificationId: notification?.id,
      userId: data.userId,
    });

    return notification;
  }

  async getUserNotifications(
    userId: string,
    filters: {
      unreadOnly?: boolean;
      type?: string;
      skip?: number;
      take?: number;
    },
  ) {
    const where: any = {
      userId,
    };

    if (filters.unreadOnly) {
      where.readAt = null;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          deliveries: true,
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      }),
    ]);

    return {
      data: notifications,
      total,
      unreadCount,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (notification.readAt) {
      return notification;
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        readAt: new Date(),
        status: "READ",
      },
      include: {
        deliveries: true,
      },
    });

    logger.info("Notification marked as read", {
      notificationId,
      userId,
    });

    return updated;
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
        status: "READ",
      },
    });

    logger.info("All notifications marked as read", {
      userId,
      count: result.count,
    });

    return { count: result.count };
  }

  async notifyCaseAssigned(caseId: string, userId: string, caseType: string) {
    await this.createNotification({
      userId,
      type: "CASE_ASSIGNED",
      title: "New Case Assigned",
      message: `A new ${caseType} case has been assigned to you.`,
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      channels: ["IN_APP", "EMAIL"],
    });
  }

  async notifyVerificationRequired(
    caseId: string,
    userId: string,
    parcelId: string,
  ) {
    await this.createNotification({
      userId,
      type: "VERIFICATION_REQUIRED",
      title: "Verification Required",
      message: "A parcel requires your verification.",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      channels: ["IN_APP"],
    });
  }

  async notifyApprovalPending(caseId: string, userId: string) {
    await this.createNotification({
      userId,
      type: "APPROVAL_PENDING",
      title: "Approval Pending",
      message: "A case requires your approval.",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      channels: ["IN_APP", "EMAIL"],
    });
  }

  async notifyPaymentFailed(paymentId: string, userId: string, reason: string) {
    await this.createNotification({
      userId,
      type: "PAYMENT_FAILED",
      title: "Payment Failed",
      message: `Payment failed: ${reason}`,
      entityType: "PAYMENT",
      entityId: paymentId,
      channels: ["IN_APP", "EMAIL", "SMS"],
    });
  }

  async notifyPaymentCredited(
    paymentId: string,
    userId: string,
    amount: number,
  ) {
    await this.createNotification({
      userId,
      type: "PAYMENT_CREDITED",
      title: "Payment Credited",
      message: `Payment of ₹${amount.toLocaleString("en-IN")} has been credited to your account.`,
      entityType: "PAYMENT",
      entityId: paymentId,
      channels: ["IN_APP", "EMAIL", "SMS"],
    });
  }

  async notifyRRDeadline(
    rrCaseId: string,
    userId: string,
    daysRemaining: number,
  ) {
    await this.createNotification({
      userId,
      type: "RR_DEADLINE",
      title: "R&R Deadline Approaching",
      message: `R&R case deadline is in ${daysRemaining} days.`,
      entityType: "RR_CASE",
      entityId: rrCaseId,
      channels: ["IN_APP", "EMAIL"],
    });
  }

  async notifyMilestoneOverdue(
    projectId: string,
    userId: string,
    milestoneName: string,
  ) {
    await this.createNotification({
      userId,
      type: "MILESTONE_OVERDUE",
      title: "Milestone Overdue",
      message: `Project milestone "${milestoneName}" is overdue.`,
      entityType: "PROJECT",
      entityId: projectId,
      channels: ["IN_APP", "EMAIL"],
    });
  }

  async notifyPossessionPending(caseId: string, userId: string) {
    await this.createNotification({
      userId,
      type: "POSSESSION_PENDING",
      title: "Possession Pending",
      message: "A parcel is ready for possession recording.",
      entityType: "ACQUISITION_CASE",
      entityId: caseId,
      channels: ["IN_APP"],
    });
  }

  async notifyHighRiskProject(
    projectId: string,
    userIds: string[],
    riskLevel: string,
  ) {
    const promises = userIds.map((userId) =>
      this.createNotification({
        userId,
        type: "HIGH_RISK_PROJECT",
        title: "High Risk Alert",
        message: `Project has been flagged as ${riskLevel} risk.`,
        entityType: "PROJECT",
        entityId: projectId,
        channels: ["IN_APP", "EMAIL"],
      }),
    );

    await Promise.all(promises);
  }
}

export default new NotificationService();
