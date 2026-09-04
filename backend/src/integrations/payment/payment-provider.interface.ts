export interface PaymentInitiationRequest {
  transactionId: string;
  amount: number;
  currency: string;
  beneficiaryReference: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitiationResponse {
  success: boolean;
  externalReference?: string;
  status: string;
  message?: string;
  estimatedCompletionTime?: Date;
}

export interface PaymentStatusResponse {
  externalReference: string;
  status: string;
  amount: number;
  currency: string;
  completedAt?: Date;
  failureReason?: string;
}

export interface PaymentProvider {
  readonly name: string;
  readonly isMock: boolean;

  initiatePayment(
    request: PaymentInitiationRequest,
  ): Promise<PaymentInitiationResponse>;

  getPaymentStatus(externalReference: string): Promise<PaymentStatusResponse>;

  validateWebhookSignature(payload: string, signature: string): boolean;
}
