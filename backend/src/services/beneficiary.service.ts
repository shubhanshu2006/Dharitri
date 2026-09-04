import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";
import { mockVerificationProvider } from "../integrations/verification/mock-verification-provider.js";
import { VerificationProvider } from "../integrations/verification/verification-provider.interface.js";

interface CreateBeneficiaryInput {
  displayName: string;
  externalReference?: string;
}

interface UpdateBeneficiaryInput {
  displayName?: string;
  externalReference?: string;
}

class BeneficiaryService {
  private verificationProvider: VerificationProvider = mockVerificationProvider;

  async createBeneficiary(data: CreateBeneficiaryInput, userId: string) {
    logger.info("Creating beneficiary", {
      displayName: data.displayName,
      userId,
    });

    const beneficiary = await prisma.beneficiary.create({
      data: {
        displayName: data.displayName,
        externalReference: data.externalReference,
        verificationStatus: "NOT_STARTED",
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Beneficiary created", {
      beneficiaryId: beneficiary.id,
    });

    return beneficiary;
  }

  async getBeneficiary(id: string) {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      include: {
        verifications: {
          orderBy: { createdAt: "desc" },
        },
        affectedPeople: true,
        families: true,
        payments: {
          include: {
            award: true,
          },
        },
      },
    });

    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }

    return beneficiary;
  }

  async listBeneficiaries(filters: {
    verificationStatus?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }

    if (filters.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: "insensitive" } },
        {
          externalReference: { contains: filters.search, mode: "insensitive" },
        },
      ];
    }

    const [beneficiaries, total] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          verifications: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.beneficiary.count({ where }),
    ]);

    return {
      data: beneficiaries,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async updateBeneficiary(
    id: string,
    data: UpdateBeneficiaryInput,
    userId: string,
  ) {
    const existing = await prisma.beneficiary.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Beneficiary not found");
    }

    const updated = await prisma.beneficiary.update({
      where: { id },
      data,
      include: {
        verifications: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    logger.info("Beneficiary updated", {
      beneficiaryId: id,
      userId,
    });

    return updated;
  }

  async verifyBeneficiary(id: string, userId: string) {
    logger.info("Initiating beneficiary verification", {
      beneficiaryId: id,
      userId,
    });

    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
    });

    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }

    const verificationResponse = await this.verificationProvider.verifyIdentity(
      {
        beneficiaryId: id,
        displayName: beneficiary.displayName,
        externalReference: beneficiary.externalReference || undefined,
      },
    );

    const verification = await prisma.beneficiaryVerification.create({
      data: {
        beneficiaryId: id,
        status: verificationResponse.status as any,
        provider: this.verificationProvider.name,
        providerReference: verificationResponse.providerReference,
        verifiedAt: verificationResponse.verifiedAt,
        failureReason: verificationResponse.failureReason,
        metadata: verificationResponse.metadata,
      },
      include: {
        beneficiary: true,
      },
    });

    await prisma.beneficiary.update({
      where: { id },
      data: {
        verificationStatus: verificationResponse.status as any,
      },
    });

    logger.info("Beneficiary verification completed", {
      beneficiaryId: id,
      verificationId: verification.id,
      status: verification.status,
    });

    return verification;
  }

  async getVerificationStatus(beneficiaryId: string) {
    const verifications = await prisma.beneficiaryVerification.findMany({
      where: { beneficiaryId },
      orderBy: { createdAt: "desc" },
      include: {
        beneficiary: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (verifications.length === 0) {
      throw new Error("No verification records found for beneficiary");
    }

    return {
      beneficiary: verifications[0].beneficiary,
      latestVerification: verifications[0],
      verificationHistory: verifications,
    };
  }
}

export default new BeneficiaryService();
