import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

const ALGORITHM_VERSION = "rules-v1";

interface RiskFactor {
  name: string;
  contribution: number;
  explanation: string;
}

interface RiskScore {
  score: number;
  riskLevel: string;
  algorithmVersion: string;
  generatedAt: Date;
  factors: RiskFactor[];
}

class AIService {
  async calculateProjectRisk(projectId: string): Promise<RiskScore> {
    logger.info("Calculating project risk", { projectId });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
      },
    });

    if (!project) throw new Error("Project not found");

    const factors: RiskFactor[] = [];
    let totalScore = 0;

    const overdueMilestones = await this.getOverdueMilestones(projectId);
    if (overdueMilestones > 0) {
      const contribution = Math.min(overdueMilestones * 5, 25);
      factors.push({
        name: "overdue_milestones",
        contribution,
        explanation: `${overdueMilestones} milestone(s) are past their deadline`,
      });
      totalScore += contribution;
    }

    const verificationBacklog = await this.getVerificationBacklog(projectId);
    if (verificationBacklog > 0) {
      const contribution = Math.min(verificationBacklog * 2, 20);
      factors.push({
        name: "verification_backlog",
        contribution,
        explanation: `${verificationBacklog} parcel(s) pending verification`,
      });
      totalScore += contribution;
    }

    const paymentFailures = await this.getPaymentFailures(projectId);
    if (paymentFailures > 0) {
      const contribution = Math.min(paymentFailures * 3, 20);
      factors.push({
        name: "payment_failures",
        contribution,
        explanation: `${paymentFailures} payment transaction(s) failed`,
      });
      totalScore += contribution;
    }

    const rrBacklog = await this.getRRBacklog(projectId);
    if (rrBacklog > 0) {
      const contribution = Math.min(rrBacklog * 2, 15);
      factors.push({
        name: "rr_backlog",
        contribution,
        explanation: `${rrBacklog} R&R case(s) pending action`,
      });
      totalScore += contribution;
    }

    const documentIssues = await this.getDocumentIssues(projectId);
    if (documentIssues > 0) {
      const contribution = Math.min(documentIssues * 2, 15);
      factors.push({
        name: "document_corrections",
        contribution,
        explanation: `${documentIssues} document(s) require corrections`,
      });
      totalScore += contribution;
    }

    const compensationPending = await this.getCompensationPending(projectId);
    if (compensationPending > 0) {
      const contribution = Math.min(compensationPending * 2, 15);
      factors.push({
        name: "compensation_pending",
        contribution,
        explanation: `${compensationPending} compensation assessment(s) without awards`,
      });
      totalScore += contribution;
    }

    const possessionPending = await this.getPossessionPending(projectId);
    if (possessionPending > 0) {
      const contribution = Math.min(possessionPending * 2, 10);
      factors.push({
        name: "possession_pending",
        contribution,
        explanation: `${possessionPending} possession record(s) not yet recorded`,
      });
      totalScore += contribution;
    }

    return {
      score: Math.min(totalScore, 100),
      riskLevel: this.getRiskLevel(totalScore),
      algorithmVersion: ALGORITHM_VERSION,
      generatedAt: new Date(),
      factors,
    };
  }

  async calculateParcelVerificationRisk(parcelId: string): Promise<RiskScore> {
    logger.info("Calculating parcel verification risk", { parcelId });

    const parcel = await prisma.acquisitionParcel.findUnique({
      where: { id: parcelId },
    });

    if (!parcel) throw new Error("Parcel not found");

    const factors: RiskFactor[] = [];
    let totalScore = 0;

    const daysSinceCreation = Math.floor(
      (new Date().getTime() - parcel.createdAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreation > 30 && parcel.status === "VERIFICATION_PENDING") {
      const contribution = Math.min(
        Math.floor((daysSinceCreation - 30) / 5),
        30,
      );
      factors.push({
        name: "verification_delay",
        contribution,
        explanation: `Verification pending for ${daysSinceCreation} days`,
      });
      totalScore += contribution;
    }

    const acquisitionCase = await prisma.acquisitionCase.findFirst({
      where: { acquisitionParcelId: parcelId },
    });

    const documentCount = acquisitionCase
      ? await prisma.document.count({
          where: {
            entityType: "ACQUISITION_CASE",
            entityId: acquisitionCase.id,
          },
        })
      : 0;

    if (documentCount < 3) {
      const contribution = 15;
      factors.push({
        name: "insufficient_documents",
        contribution,
        explanation: `Only ${documentCount} document(s) attached, minimum 3 recommended`,
      });
      totalScore += contribution;
    }

    const fieldVisits = await prisma.fieldVisit.count({
      where: { acquisitionCaseId: acquisitionCase?.id },
    });

    if (fieldVisits === 0) {
      factors.push({
        name: "no_field_visit",
        contribution: 20,
        explanation: "No field visit conducted for this parcel",
      });
      totalScore += 20;
    }

    return {
      score: Math.min(totalScore, 100),
      riskLevel: this.getRiskLevel(totalScore),
      algorithmVersion: ALGORITHM_VERSION,
      generatedAt: new Date(),
      factors,
    };
  }

  async calculateCompensationDelayRisk(caseId: string): Promise<RiskScore> {
    logger.info("Calculating compensation delay risk", { caseId });

    const acquisitionCase = await prisma.acquisitionCase.findUnique({
      where: { id: caseId },
    });

    if (!acquisitionCase) throw new Error("Acquisition case not found");

    const factors: RiskFactor[] = [];
    let totalScore = 0;

    const assessments = await prisma.compensationAssessment.findMany({
      where: { acquisitionCaseId: caseId },
      include: { award: true },
    });

    const pendingAssessments = assessments.filter((a) => !a.award);

    if (pendingAssessments.length > 0) {
      const oldestAssessment = pendingAssessments.reduce((oldest, current) =>
        current.createdAt < oldest.createdAt ? current : oldest,
      );

      const daysPending = Math.floor(
        (new Date().getTime() - oldestAssessment.createdAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysPending > 15) {
        const contribution = Math.min(Math.floor((daysPending - 15) / 3), 35);
        factors.push({
          name: "assessment_delay",
          contribution,
          explanation: `Compensation assessment pending award for ${daysPending} days`,
        });
        totalScore += contribution;
      }
    }

    const hasMultipleAssessments = assessments.length > 1;
    if (hasMultipleAssessments) {
      factors.push({
        name: "multiple_assessments",
        contribution: 20,
        explanation: `${assessments.length} assessments indicate disputes or reassessments`,
      });
      totalScore += 20;
    }

    const grievances = await prisma.grievance.count({
      where: {
        acquisitionCaseId: caseId,
        status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] },
      },
    });

    if (grievances > 0) {
      const contribution = Math.min(grievances * 15, 25);
      factors.push({
        name: "active_grievances",
        contribution,
        explanation: `${grievances} active grievance(s) may delay compensation`,
      });
      totalScore += contribution;
    }

    return {
      score: Math.min(totalScore, 100),
      riskLevel: this.getRiskLevel(totalScore),
      algorithmVersion: ALGORITHM_VERSION,
      generatedAt: new Date(),
      factors,
    };
  }

  async calculateRRDelayRisk(rrCaseId: string): Promise<RiskScore> {
    logger.info("Calculating R&R delay risk", { rrCaseId });

    const rrCase = await prisma.rRCase.findUnique({
      where: { id: rrCaseId },
      include: {
        family: { include: { members: true } },
      },
    });

    if (!rrCase) throw new Error("R&R case not found");

    const factors: RiskFactor[] = [];
    let totalScore = 0;

    const daysSinceCreation = Math.floor(
      (new Date().getTime() - rrCase.createdAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreation > 45 && rrCase.status !== "COMPLETED") {
      const contribution = Math.min(
        Math.floor((daysSinceCreation - 45) / 5),
        30,
      );
      factors.push({
        name: "rr_processing_delay",
        contribution,
        explanation: `R&R case pending completion for ${daysSinceCreation} days`,
      });
      totalScore += contribution;
    }

    const familySize = rrCase.family?.members?.length || 0;
    if (familySize > 8) {
      const contribution = 15;
      factors.push({
        name: "large_displaced_family",
        contribution,
        explanation: `Large family (${familySize} members) requires complex R&R planning`,
      });
      totalScore += contribution;
    }

    if (rrCase.applicable && rrCase.status === "APPLICABILITY_REVIEW") {
      factors.push({
        name: "applicability_pending",
        contribution: 25,
        explanation: "R&R applicability review not yet completed",
      });
      totalScore += 25;
    }

    return {
      score: Math.min(totalScore, 100),
      riskLevel: this.getRiskLevel(totalScore),
      algorithmVersion: ALGORITHM_VERSION,
      generatedAt: new Date(),
      factors,
    };
  }

  async calculatePossessionDelayRisk(possessionId: string): Promise<RiskScore> {
    logger.info("Calculating possession delay risk", { possessionId });

    const possession = await prisma.possessionRecord.findUnique({
      where: { id: possessionId },
    });

    if (!possession) throw new Error("Possession record not found");

    const factors: RiskFactor[] = [];
    let totalScore = 0;

    if (possession.status === "READY") {
      const daysSinceReady = Math.floor(
        (new Date().getTime() - possession.updatedAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceReady > 10) {
        const contribution = Math.min(
          Math.floor((daysSinceReady - 10) / 2),
          35,
        );
        factors.push({
          name: "possession_ready_not_recorded",
          contribution,
          explanation: `Possession ready for recording but pending for ${daysSinceReady} days`,
        });
        totalScore += contribution;
      }
    }

    const hasCompensationAward = await prisma.compensationAward.count({
      where: {
        assessment: {
          acquisitionCaseId: possession.acquisitionCaseId,
        },
      },
    });

    if (hasCompensationAward === 0 && possession.status !== "PENDING") {
      factors.push({
        name: "no_compensation_award",
        contribution: 30,
        explanation:
          "No compensation award found but possession process initiated",
      });
      totalScore += 30;
    }

    const paymentStatus = await prisma.paymentTransaction.findFirst({
      where: {
        acquisitionCaseId: possession.acquisitionCaseId,
        status: "CREDITED",
      },
    });

    if (!paymentStatus && possession.status === "READY") {
      factors.push({
        name: "payment_not_credited",
        contribution: 25,
        explanation: "Compensation payment not yet credited to beneficiary",
      });
      totalScore += 25;
    }

    return {
      score: Math.min(totalScore, 100),
      riskLevel: this.getRiskLevel(totalScore),
      algorithmVersion: ALGORITHM_VERSION,
      generatedAt: new Date(),
      factors,
    };
  }

  async detectAnomalies(projectId: string) {
    logger.info("Detecting anomalies for project", { projectId });

    const anomalies = [];

    const duplicatePayments = await prisma.paymentTransaction.groupBy({
      by: ["beneficiaryId", "awardId"],
      where: {
        acquisitionCase: { acquisitionParcel: { projectId } },
        status: "CREDITED",
      },
      _count: true,
      having: { beneficiaryId: { _count: { gt: 1 } } },
    });

    if (duplicatePayments.length > 0) {
      anomalies.push({
        type: "DUPLICATE_PAYMENTS",
        severity: "HIGH",
        count: duplicatePayments.length,
        explanation:
          "Multiple credited payments found for same beneficiary and award",
        affectedEntities: duplicatePayments.map((d) => ({
          beneficiaryId: d.beneficiaryId,
          awardId: d.awardId,
        })),
      });
    }

    const compensationWithoutPayment = await prisma.compensationAward.findMany({
      where: {
        acquisitionCase: { acquisitionParcel: { projectId } },
        payments: { none: {} },
        createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { id: true, awardedAmount: true },
    });

    if (compensationWithoutPayment.length > 0) {
      anomalies.push({
        type: "COMPENSATION_WITHOUT_PAYMENT",
        severity: "HIGH",
        count: compensationWithoutPayment.length,
        explanation:
          "Compensation awards older than 30 days without payment transactions",
        affectedAwards: compensationWithoutPayment.map((a) => a.id),
      });
    }

    const possessionWithoutCompensation = await prisma.possessionRecord.count({
      where: {
        acquisitionCase: {
          acquisitionParcel: { projectId },
          compensationAssessments: { none: {} },
        },
        status: "RECORDED",
      },
    });

    if (possessionWithoutCompensation > 0) {
      anomalies.push({
        type: "POSSESSION_WITHOUT_COMPENSATION",
        severity: "CRITICAL",
        count: possessionWithoutCompensation,
        explanation: "Possession recorded without any compensation assessment",
      });
    }

    return {
      projectId,
      detectedAt: new Date(),
      algorithmVersion: ALGORITHM_VERSION,
      anomalies,
      summary: {
        total: anomalies.length,
        critical: anomalies.filter((a) => a.severity === "CRITICAL").length,
        high: anomalies.filter((a) => a.severity === "HIGH").length,
      },
    };
  }

  private async getOverdueMilestones(projectId: string): Promise<number> {
    return prisma.projectMilestone.count({
      where: {
        projectId,
        status: { not: "COMPLETED" },
        deadline: { lt: new Date() },
      },
    });
  }

  private async getVerificationBacklog(projectId: string): Promise<number> {
    return prisma.acquisitionParcel.count({
      where: { projectId, status: "VERIFICATION_PENDING" },
    });
  }

  private async getPaymentFailures(projectId: string): Promise<number> {
    return prisma.paymentTransaction.count({
      where: {
        acquisitionCase: { acquisitionParcel: { projectId } },
        status: "FAILED",
      },
    });
  }

  private async getRRBacklog(projectId: string): Promise<number> {
    return prisma.rRCase.count({
      where: {
        projectId,
        applicable: true,
        status: {
          in: ["APPLICABILITY_REVIEW", "ASSESSMENT", "APPROVAL_PENDING"],
        },
      },
    });
  }

  private async getDocumentIssues(projectId: string): Promise<number> {
    return prisma.document.count({
      where: {
        entityType: "ACQUISITION_CASE",
        status: "ARCHIVED",
      },
    });
  }

  private async getCompensationPending(projectId: string): Promise<number> {
    const cases = await prisma.acquisitionCase.findMany({
      where: { acquisitionParcel: { projectId } },
      include: {
        compensationAssessments: {
          include: { award: true },
        },
      },
    });

    return cases.filter(
      (c) =>
        c.compensationAssessments.length > 0 &&
        c.compensationAssessments.some((a) => !a.award),
    ).length;
  }

  private async getPossessionPending(projectId: string): Promise<number> {
    return prisma.possessionRecord.count({
      where: {
        acquisitionCase: { acquisitionParcel: { projectId } },
        status: { in: ["PENDING", "READY"] },
      },
    });
  }

  private getRiskLevel(score: number): string {
    if (score >= 75) return "CRITICAL";
    if (score >= 50) return "HIGH";
    if (score >= 25) return "MEDIUM";
    return "LOW";
  }
}

export default new AIService();
