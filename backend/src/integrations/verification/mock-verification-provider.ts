import {
  VerificationProvider,
  VerificationRequest,
  VerificationResponse,
} from "./verification-provider.interface.js";
import { logger } from "../../utils/logger.js";

export class MockVerificationProvider implements VerificationProvider {
  readonly name = "MockVerificationProvider";
  readonly isMock = true;

  private verifications: Map<string, VerificationResponse> = new Map();

  async verifyIdentity(
    request: VerificationRequest,
  ): Promise<VerificationResponse> {
    logger.info("[MockVerificationProvider] Verifying identity", {
      beneficiaryId: request.beneficiaryId,
      displayName: request.displayName,
    });

    const providerReference = `MOCK-VER-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const random = Math.random();
    let status: string;
    let failureReason: string | undefined;
    let verifiedAt: Date | undefined;

    if (random > 0.85) {
      status = "FAILED";
      failureReason = "Mock failure: Identity document mismatch";
    } else if (random > 0.8) {
      status = "REQUIRES_CORRECTION";
      failureReason = "Mock correction required: Incomplete information";
    } else {
      status = "VERIFIED";
      verifiedAt = new Date();
    }

    const response: VerificationResponse = {
      success: status === "VERIFIED",
      providerReference,
      status,
      verifiedAt,
      failureReason,
      metadata: {
        verificationMethod: "MOCK_AADHAAR",
        mockSimulation: true,
        timestamp: new Date().toISOString(),
      },
    };

    this.verifications.set(providerReference, response);

    logger.info("[MockVerificationProvider] Verification completed", {
      providerReference,
      status,
    });

    return response;
  }

  async getVerificationStatus(
    providerReference: string,
  ): Promise<VerificationResponse> {
    logger.info("[MockVerificationProvider] Getting verification status", {
      providerReference,
    });

    const verification = this.verifications.get(providerReference);

    if (!verification) {
      throw new Error(`Verification not found: ${providerReference}`);
    }

    return verification;
  }
}

export const mockVerificationProvider = new MockVerificationProvider();
