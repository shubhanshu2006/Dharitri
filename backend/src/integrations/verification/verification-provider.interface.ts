export interface VerificationRequest {
  beneficiaryId: string;
  displayName: string;
  externalReference?: string;
  metadata?: Record<string, any>;
}

export interface VerificationResponse {
  success: boolean;
  providerReference: string;
  status: string;
  verifiedAt?: Date;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export interface VerificationProvider {
  readonly name: string;
  readonly isMock: boolean;

  verifyIdentity(request: VerificationRequest): Promise<VerificationResponse>;

  getVerificationStatus(
    providerReference: string,
  ): Promise<VerificationResponse>;
}
