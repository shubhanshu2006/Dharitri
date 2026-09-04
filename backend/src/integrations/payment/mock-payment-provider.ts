import {
  PaymentProvider,
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  PaymentStatusResponse,
} from "./payment-provider.interface.js";
import { logger } from "../../utils/logger.js";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "MockPaymentProvider";
  readonly isMock = true;

  private payments: Map<string, PaymentStatusResponse> = new Map();

  async initiatePayment(
    request: PaymentInitiationRequest,
  ): Promise<PaymentInitiationResponse> {
    logger.info("[MockPaymentProvider] Initiating payment", {
      transactionId: request.transactionId,
      amount: request.amount,
    });

    const externalReference = `MOCK-PAY-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const mockStatus: PaymentStatusResponse = {
      externalReference,
      status: "PROCESSING",
      amount: request.amount,
      currency: request.currency,
    };

    this.payments.set(externalReference, mockStatus);

    setTimeout(() => {
      this.simulatePaymentCompletion(externalReference);
    }, 5000);

    return {
      success: true,
      externalReference,
      status: "PROCESSING",
      message: "Mock payment initiated successfully",
      estimatedCompletionTime: new Date(Date.now() + 5000),
    };
  }

  async getPaymentStatus(
    externalReference: string,
  ): Promise<PaymentStatusResponse> {
    logger.info("[MockPaymentProvider] Getting payment status", {
      externalReference,
    });

    const payment = this.payments.get(externalReference);

    if (!payment) {
      throw new Error(`Payment not found: ${externalReference}`);
    }

    return payment;
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = `mock-signature-${payload.length}`;
    return signature === expectedSignature;
  }

  private simulatePaymentCompletion(externalReference: string): void {
    const payment = this.payments.get(externalReference);

    if (!payment) {
      return;
    }

    const random = Math.random();

    if (random > 0.9) {
      payment.status = "FAILED";
      payment.failureReason = "Mock failure: Insufficient balance simulation";
    } else {
      payment.status = "CREDITED";
      payment.completedAt = new Date();
    }

    this.payments.set(externalReference, payment);

    logger.info("[MockPaymentProvider] Payment status updated", {
      externalReference,
      status: payment.status,
    });
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
