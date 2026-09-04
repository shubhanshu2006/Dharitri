import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";
import { mockPaymentProvider } from "../integrations/payment/mock-payment-provider.js";
import { PaymentProvider } from "../integrations/payment/payment-provider.interface.js";

interface InitiatePaymentInput {
  awardId: string;
  beneficiaryId: string;
  amount: number;
  idempotencyKey: string;
}

interface WebhookPayload {
  externalReference: string;
  status: string;
  completedAt?: string;
  failureReason?: string;
}

class PaymentService {
  private provider: PaymentProvider = mockPaymentProvider;

  async initiatePayment(data: InitiatePaymentInput, userId: string) {
    logger.info("Initiating payment", {
      awardId: data.awardId,
      beneficiaryId: data.beneficiaryId,
      userId,
    });

    const existingPayment = await prisma.paymentTransaction.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
    });

    if (existingPayment) {
      logger.info("Payment already exists (idempotency)", {
        paymentId: existingPayment.id,
        idempotencyKey: data.idempotencyKey,
      });
      return existingPayment;
    }

    const award = await prisma.compensationAward.findUnique({
      where: { id: data.awardId },
      include: {
        assessment: {
          include: {
            acquisitionCase: true,
          },
        },
      },
    });

    if (!award) {
      throw new Error("Award not found");
    }

    if (award.status !== "APPROVED") {
      throw new Error(
        `Award must be approved. Current status: ${award.status}`,
      );
    }

    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id: data.beneficiaryId },
    });

    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }

    if (Number(award.awardedAmount) !== data.amount) {
      throw new Error(
        `Amount mismatch. Award amount: ${award.awardedAmount}, Requested: ${data.amount}`,
      );
    }

    const providerResponse = await this.provider.initiatePayment({
      transactionId: data.idempotencyKey,
      amount: data.amount,
      currency: "INR",
      beneficiaryReference: beneficiary.externalReference || beneficiary.id,
      metadata: {
        awardId: data.awardId,
        beneficiaryId: data.beneficiaryId,
      },
    });

    if (!providerResponse.success) {
      throw new Error(`Payment initiation failed: ${providerResponse.message}`);
    }

    const payment = await prisma.paymentTransaction.create({
      data: {
        awardId: data.awardId,
        beneficiaryId: data.beneficiaryId,
        acquisitionCaseId: award.assessment.acquisitionCaseId,
        amount: data.amount,
        currency: "INR",
        status: "INITIATED",
        externalReference: providerResponse.externalReference,
        provider: this.provider.name,
        idempotencyKey: data.idempotencyKey,
        initiatedAt: new Date(),
      },
      include: {
        award: true,
        beneficiary: true,
      },
    });

    logger.info("Payment initiated successfully", {
      paymentId: payment.id,
      externalReference: payment.externalReference,
    });

    return payment;
  }

  async getPayment(id: string) {
    const payment = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        award: {
          include: {
            assessment: {
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
              },
            },
          },
        },
        beneficiary: true,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async listPayments(filters: {
    awardId?: string;
    beneficiaryId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.awardId) {
      where.awardId = filters.awardId;
    }

    if (filters.beneficiaryId) {
      where.beneficiaryId = filters.beneficiaryId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [payments, total] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          award: {
            include: {
              assessment: true,
            },
          },
          beneficiary: true,
        },
      }),
      prisma.paymentTransaction.count({ where }),
    ]);

    return {
      data: payments,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async syncPaymentStatus(id: string, userId: string) {
    logger.info("Syncing payment status", { paymentId: id, userId });

    const payment = await prisma.paymentTransaction.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.externalReference) {
      throw new Error("Payment has no external reference");
    }

    if (payment.status === "CREDITED") {
      logger.info("Payment already credited, skipping sync", { paymentId: id });
      return payment;
    }

    const providerStatus = await this.provider.getPaymentStatus(
      payment.externalReference,
    );

    const updated = await prisma.paymentTransaction.update({
      where: { id },
      data: {
        status: providerStatus.status as any,
        failureReason: providerStatus.failureReason,
        creditedAt: providerStatus.completedAt,
        lastProviderSyncAt: new Date(),
      },
      include: {
        award: true,
        beneficiary: true,
      },
    });

    logger.info("Payment status synced", {
      paymentId: id,
      oldStatus: payment.status,
      newStatus: updated.status,
    });

    return updated;
  }

  async processWebhook(payload: WebhookPayload, signature: string) {
    logger.info("Processing payment webhook", {
      externalReference: payload.externalReference,
    });

    if (
      !this.provider.validateWebhookSignature(
        JSON.stringify(payload),
        signature,
      )
    ) {
      throw new Error("Invalid webhook signature");
    }

    const payment = await prisma.paymentTransaction.findFirst({
      where: { externalReference: payload.externalReference },
    });

    if (!payment) {
      throw new Error(`Payment not found: ${payload.externalReference}`);
    }

    if (payment.status === "CREDITED" && payload.status !== "CREDITED") {
      logger.warn("Attempt to change CREDITED status rejected", {
        paymentId: payment.id,
        currentStatus: payment.status,
        attemptedStatus: payload.status,
      });
      throw new Error("Cannot change status of credited payment");
    }

    const updated = await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: payload.status as any,
        failureReason: payload.failureReason,
        creditedAt: payload.completedAt ? new Date(payload.completedAt) : null,
        lastProviderSyncAt: new Date(),
      },
      include: {
        award: true,
        beneficiary: true,
      },
    });

    logger.info("Webhook processed successfully", {
      paymentId: updated.id,
      oldStatus: payment.status,
      newStatus: updated.status,
    });

    return updated;
  }
}

export default new PaymentService();
