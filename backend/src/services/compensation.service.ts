import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

interface CreateCompensationAssessmentInput {
  acquisitionCaseId: string;
  landValue: number;
  solatium?: number;
  interest?: number;
  otherComponents?: number;
  deductions?: number;
}

interface UpdateCompensationAssessmentInput {
  landValue?: number;
  solatium?: number;
  interest?: number;
  otherComponents?: number;
  deductions?: number;
}

interface CompensationQueryFilters {
  acquisitionCaseId?: string;
  status?: string;
  assessedById?: string;
  minAmount?: number;
  maxAmount?: number;
  skip?: number;
  take?: number;
}

class CompensationService {
  async createAssessment(
    data: CreateCompensationAssessmentInput,
    userId: string,
  ) {
    logger.info("Creating compensation assessment", {
      acquisitionCaseId: data.acquisitionCaseId,
      userId,
    });

    const acquisitionCase = await prisma.acquisitionCase.findUnique({
      where: { id: data.acquisitionCaseId },
    });

    if (!acquisitionCase) {
      throw new Error("Acquisition case not found");
    }

    const applicableRuleSet = await this.getApplicableRuleSet();

    const totalAmount = this.calculateTotal(
      data.landValue,
      data.solatium || 0,
      data.interest || 0,
      data.otherComponents || 0,
      data.deductions || 0,
    );

    const assessment = await prisma.compensationAssessment.create({
      data: {
        acquisitionCaseId: data.acquisitionCaseId,
        ruleSetId: applicableRuleSet.id,
        landValue: data.landValue,
        solatium: data.solatium || 0,
        interest: data.interest || 0,
        otherComponents: data.otherComponents || 0,
        deductions: data.deductions || 0,
        totalAmount,
        status: "DRAFT",
        assessedById: userId,
        assessedAt: new Date(),
      },
      include: {
        acquisitionCase: {
          include: {
            acquisitionParcel: true,
          },
        },
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ruleSet: true,
      },
    });

    logger.info("Compensation assessment created", {
      assessmentId: assessment.id,
      ruleSetId: applicableRuleSet.id,
      totalAmount,
    });

    return assessment;
  }

  private async getApplicableRuleSet() {
    const activeRuleSet = await prisma.compensationRuleSet.findFirst({
      where: {
        isActive: true,
        effectiveFrom: { lte: new Date() },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }],
      },
      orderBy: { effectiveFrom: "desc" },
    });

    if (!activeRuleSet) {
      throw new Error("No active compensation rule set found");
    }

    return activeRuleSet;
  }

  async getAssessment(id: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id },
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
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        award: true,
      },
    });

    if (!assessment) {
      throw new Error("Compensation assessment not found");
    }

    return assessment;
  }

  async listAssessments(filters: CompensationQueryFilters) {
    const where: any = {};

    if (filters.acquisitionCaseId) {
      where.acquisitionCaseId = filters.acquisitionCaseId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.assessedById) {
      where.assessedById = filters.assessedById;
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.totalAmount = {};
      if (filters.minAmount !== undefined) {
        where.totalAmount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.totalAmount.lte = filters.maxAmount;
      }
    }

    const [assessments, total] = await Promise.all([
      prisma.compensationAssessment.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { assessedAt: "desc" },
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
          assessedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.compensationAssessment.count({ where }),
    ]);

    return {
      data: assessments,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async updateAssessment(
    id: string,
    data: UpdateCompensationAssessmentInput,
    userId: string,
  ) {
    const existing = await prisma.compensationAssessment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Compensation assessment not found");
    }

    if (
      existing.status !== "DRAFT" &&
      existing.status !== "CORRECTION_REQUIRED"
    ) {
      throw new Error(`Cannot update assessment in status: ${existing.status}`);
    }

    const totalAmount = this.calculateTotal(
      data.landValue ?? Number(existing.landValue),
      data.solatium ?? Number(existing.solatium),
      data.interest ?? Number(existing.interest),
      data.otherComponents ?? Number(existing.otherComponents),
      data.deductions ?? Number(existing.deductions),
    );

    const updated = await prisma.compensationAssessment.update({
      where: { id },
      data: {
        ...data,
        totalAmount,
      },
      include: {
        acquisitionCase: true,
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Compensation assessment updated", { assessmentId: id });

    return updated;
  }

  async submitForReview(id: string, userId: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new Error("Compensation assessment not found");
    }

    if (
      assessment.status !== "DRAFT" &&
      assessment.status !== "CORRECTION_REQUIRED"
    ) {
      throw new Error(
        `Cannot submit assessment in status: ${assessment.status}`,
      );
    }

    const updated = await prisma.compensationAssessment.update({
      where: { id },
      data: { status: "SUBMITTED" },
      include: {
        acquisitionCase: true,
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Compensation assessment submitted", { assessmentId: id });

    return updated;
  }

  async approveAssessment(id: string, userId: string, notes?: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new Error("Compensation assessment not found");
    }

    if (assessment.status !== "SUBMITTED") {
      throw new Error(
        `Cannot approve assessment in status: ${assessment.status}`,
      );
    }

    const updated = await prisma.compensationAssessment.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: userId,
        approvedAt: new Date(),
      },
      include: {
        acquisitionCase: true,
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.createAward(id, userId);

    logger.info("Compensation assessment approved", { assessmentId: id });

    return updated;
  }

  async requestCorrection(id: string, userId: string, correctionNotes: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new Error("Compensation assessment not found");
    }

    if (assessment.status !== "SUBMITTED") {
      throw new Error(
        `Cannot request correction for assessment in status: ${assessment.status}`,
      );
    }

    const updated = await prisma.compensationAssessment.update({
      where: { id },
      data: {
        status: "CORRECTION_REQUIRED",
        approvedById: userId,
        approvedAt: new Date(),
      },
      include: {
        acquisitionCase: true,
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Correction requested for compensation assessment", {
      assessmentId: id,
    });

    return updated;
  }

  async rejectAssessment(id: string, userId: string, rejectionReason: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new Error("Compensation assessment not found");
    }

    if (assessment.status !== "SUBMITTED") {
      throw new Error(
        `Cannot reject assessment in status: ${assessment.status}`,
      );
    }

    const updated = await prisma.compensationAssessment.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedById: userId,
        approvedAt: new Date(),
      },
      include: {
        acquisitionCase: true,
        assessedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Compensation assessment rejected", { assessmentId: id });

    return updated;
  }

  private async createAward(assessmentId: string, userId: string) {
    const assessment = await prisma.compensationAssessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const awardNumber = `AWD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const award = await prisma.compensationAward.create({
      data: {
        assessmentId: assessment.id,
        awardNumber,
        awardedAmount: assessment.totalAmount,
        status: "APPROVED",
        approvedById: userId,
        approvedAt: new Date(),
      },
    });

    logger.info("Compensation award created", {
      awardId: award.id,
      assessmentId,
    });

    return award;
  }

  private calculateTotal(
    landValue: number,
    solatium: number,
    interest: number,
    otherComponents: number,
    deductions: number,
  ): number {
    const total =
      landValue + solatium + interest + otherComponents - deductions;
    return Math.max(0, total);
  }

  async getAward(id: string) {
    const award = await prisma.compensationAward.findUnique({
      where: { id },
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
            assessedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!award) {
      throw new Error("Compensation award not found");
    }

    return award;
  }

  async listAwards(filters: { status?: string; skip?: number; take?: number }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    const [awards, total] = await Promise.all([
      prisma.compensationAward.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { approvedAt: "desc" },
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
      }),
      prisma.compensationAward.count({ where }),
    ]);

    return {
      data: awards,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }
}

export default new CompensationService();
