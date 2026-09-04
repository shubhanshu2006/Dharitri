import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

class AnalyticsService {
  async getAcquisitionTrends(filters: {
    months?: number;
    stateId?: string;
    districtId?: string;
  }) {
    logger.info("Fetching acquisition trends", filters);

    const months = filters.months || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: any = { createdAt: { gte: startDate } };
    if (filters.stateId) where.project = { stateId: filters.stateId };
    if (filters.districtId) where.project = { districtId: filters.districtId };

    const [totalCases, byStatus, byMonth] = await Promise.all([
      prisma.acquisitionCase.count({ where: { acquisitionParcel: where } }),
      prisma.acquisitionParcel.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
      this.getCasesByMonth(startDate, where),
    ]);

    return {
      period: { months, startDate, endDate: new Date() },
      totalCases,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      monthly: byMonth,
    };
  }

  async getCompensationTrends(filters: {
    months?: number;
    stateId?: string;
    districtId?: string;
  }) {
    logger.info("Fetching compensation trends", filters);

    const months = filters.months || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: any = { createdAt: { gte: startDate } };
    if (filters.stateId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { stateId: filters.stateId } },
      };
    if (filters.districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId: filters.districtId } },
      };

    const [totalAssessments, avgAmount, byMonth] = await Promise.all([
      prisma.compensationAssessment.count({ where }),
      prisma.compensationAssessment.aggregate({
        where,
        _avg: { totalAmount: true },
      }),
      this.getCompensationByMonth(startDate, where),
    ]);

    return {
      period: { months, startDate, endDate: new Date() },
      totalAssessments,
      averageAmount: Number(avgAmount._avg?.totalAmount || 0),
      monthly: byMonth,
    };
  }

  async getPaymentAnalytics(filters: {
    months?: number;
    stateId?: string;
    districtId?: string;
  }) {
    logger.info("Fetching payment analytics", filters);

    const months = filters.months || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: any = { createdAt: { gte: startDate } };
    if (filters.stateId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { stateId: filters.stateId } },
      };
    if (filters.districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId: filters.districtId } },
      };

    const [
      total,
      credited,
      failed,
      avgProcessingTime,
      byStatus,
      failureReasons,
    ] = await Promise.all([
      prisma.paymentTransaction.count({ where }),
      prisma.paymentTransaction.count({
        where: { ...where, status: "CREDITED" },
      }),
      prisma.paymentTransaction.count({
        where: { ...where, status: "FAILED" },
      }),
      this.getAvgProcessingTime(where),
      prisma.paymentTransaction.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
      this.getFailureReasons(where),
    ]);

    return {
      period: { months, startDate, endDate: new Date() },
      total,
      credited,
      failed,
      successRate: total > 0 ? Math.round((credited / total) * 100) : 0,
      avgProcessingTimeHours: avgProcessingTime,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      failureReasons,
    };
  }

  async getRRTrends(filters: {
    months?: number;
    stateId?: string;
    districtId?: string;
  }) {
    logger.info("Fetching R&R trends", filters);

    const months = filters.months || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: any = { createdAt: { gte: startDate } };
    if (filters.stateId) where.project = { stateId: filters.stateId };
    if (filters.districtId) where.project = { districtId: filters.districtId };

    const [total, completed, byStatus, byMonth] = await Promise.all([
      prisma.rRCase.count({ where: { ...where, applicable: true } }),
      prisma.rRCase.count({ where: { ...where, status: "COMPLETED" } }),
      prisma.rRCase.groupBy({
        by: ["status"],
        where: { ...where, applicable: true },
        _count: true,
      }),
      this.getRRCasesByMonth(startDate, where),
    ]);

    return {
      period: { months, startDate, endDate: new Date() },
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      monthly: byMonth,
    };
  }

  async getPossessionTrends(filters: {
    months?: number;
    stateId?: string;
    districtId?: string;
  }) {
    logger.info("Fetching possession trends", filters);

    const months = filters.months || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: any = { createdAt: { gte: startDate } };
    if (filters.stateId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { stateId: filters.stateId } },
      };
    if (filters.districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId: filters.districtId } },
      };

    const [total, recorded, byStatus, byMonth] = await Promise.all([
      prisma.possessionRecord.count({ where }),
      prisma.possessionRecord.count({
        where: { ...where, status: "RECORDED" },
      }),
      prisma.possessionRecord.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
      this.getPossessionByMonth(startDate, where),
    ]);

    return {
      period: { months, startDate, endDate: new Date() },
      total,
      recorded,
      recordedRate: total > 0 ? Math.round((recorded / total) * 100) : 0,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      monthly: byMonth,
    };
  }

  async getBottlenecks(filters: { stateId?: string; districtId?: string }) {
    logger.info("Analyzing bottlenecks", filters);

    const where: any = {};
    if (filters.stateId) where.project = { stateId: filters.stateId };
    if (filters.districtId) where.project = { districtId: filters.districtId };

    const [
      verificationBacklog,
      compensationPending,
      paymentFailed,
      rrPending,
      possessionPending,
      overdueProjects,
    ] = await Promise.all([
      prisma.acquisitionParcel.count({
        where: { ...where, status: "VERIFICATION_PENDING" },
      }),
      prisma.compensationAssessment.count({
        where: {
          acquisitionCase: { acquisitionParcel: where },
          awards: { none: {} },
        },
      }),
      prisma.paymentTransaction.count({
        where: {
          acquisitionCase: { acquisitionParcel: where },
          status: "FAILED",
        },
      }),
      prisma.rRCase.count({
        where: {
          ...where,
          applicable: true,
          status: {
            in: ["APPLICABILITY_REVIEW", "ASSESSMENT", "APPROVAL_PENDING"],
          },
        },
      }),
      prisma.possessionRecord.count({
        where: {
          acquisitionCase: { acquisitionParcel: where },
          status: { in: ["PENDING", "READY"] },
        },
      }),
      this.getOverdueProjects(filters),
    ]);

    const bottlenecks = [
      {
        stage: "VERIFICATION",
        count: verificationBacklog,
        severity: this.getSeverity(verificationBacklog, 50),
      },
      {
        stage: "COMPENSATION",
        count: compensationPending,
        severity: this.getSeverity(compensationPending, 30),
      },
      {
        stage: "PAYMENT",
        count: paymentFailed,
        severity: this.getSeverity(paymentFailed, 20),
      },
      {
        stage: "RR",
        count: rrPending,
        severity: this.getSeverity(rrPending, 40),
      },
      {
        stage: "POSSESSION",
        count: possessionPending,
        severity: this.getSeverity(possessionPending, 30),
      },
    ];

    return {
      bottlenecks: bottlenecks.sort((a, b) => b.count - a.count),
      overdueProjects,
      summary: {
        totalIssues: bottlenecks.reduce((sum, b) => sum + b.count, 0),
        criticalStages: bottlenecks.filter(
          (b) => b.severity === "HIGH" || b.severity === "CRITICAL",
        ).length,
      },
    };
  }

  private async getCasesByMonth(startDate: Date, where: any) {
    const cases = await prisma.acquisitionParcel.findMany({
      where,
      select: { createdAt: true, status: true },
    });

    const byMonth: any = {};
    cases.forEach((c) => {
      const month = c.createdAt.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = 0;
      byMonth[month]++;
    });

    return Object.entries(byMonth).map(([month, count]) => ({ month, count }));
  }

  private async getCompensationByMonth(startDate: Date, where: any) {
    const assessments = await prisma.compensationAssessment.findMany({
      where,
      select: { createdAt: true, totalAmount: true },
    });

    const byMonth: any = {};
    assessments.forEach((a) => {
      const month = a.createdAt.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = { count: 0, totalAmount: 0 };
      byMonth[month].count++;
      byMonth[month].totalAmount += Number(a.totalAmount);
    });

    return Object.entries(byMonth).map(([month, data]: any) => ({
      month,
      count: data.count,
      totalAmount: data.totalAmount,
    }));
  }

  private async getRRCasesByMonth(startDate: Date, where: any) {
    const cases = await prisma.rRCase.findMany({
      where: { ...where, applicable: true },
      select: { createdAt: true },
    });

    const byMonth: any = {};
    cases.forEach((c) => {
      const month = c.createdAt.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = 0;
      byMonth[month]++;
    });

    return Object.entries(byMonth).map(([month, count]) => ({ month, count }));
  }

  private async getPossessionByMonth(startDate: Date, where: any) {
    const records = await prisma.possessionRecord.findMany({
      where,
      select: { createdAt: true },
    });

    const byMonth: any = {};
    records.forEach((r) => {
      const month = r.createdAt.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = 0;
      byMonth[month]++;
    });

    return Object.entries(byMonth).map(([month, count]) => ({ month, count }));
  }

  private async getAvgProcessingTime(where: any) {
    const payments = await prisma.paymentTransaction.findMany({
      where: {
        ...where,
        status: "CREDITED",
        initiatedAt: { not: null },
        creditedAt: { not: null },
      },
      select: { initiatedAt: true, creditedAt: true },
    });

    if (payments.length === 0) return 0;

    const totalHours = payments.reduce((sum, p) => {
      const diff = p.creditedAt!.getTime() - p.initiatedAt!.getTime();
      return sum + diff / (1000 * 60 * 60);
    }, 0);

    return Math.round(totalHours / payments.length);
  }

  private async getFailureReasons(where: any) {
    const failed = await prisma.paymentTransaction.findMany({
      where: { ...where, status: "FAILED", failureReason: { not: null } },
      select: { failureReason: true },
    });

    const reasons: any = {};
    failed.forEach((f) => {
      const reason = f.failureReason || "UNKNOWN";
      reasons[reason] = (reasons[reason] || 0) + 1;
    });

    return Object.entries(reasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);
  }

  private async getOverdueProjects(filters: {
    stateId?: string;
    districtId?: string;
  }) {
    const where: any = {};
    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;

    const overdueCount = await prisma.projectMilestone.count({
      where: {
        project: where,
        status: { not: "COMPLETED" },
        deadline: { lt: new Date() },
      },
    });

    return overdueCount;
  }

  private getSeverity(count: number, threshold: number): string {
    if (count >= threshold * 2) return "CRITICAL";
    if (count >= threshold) return "HIGH";
    if (count >= threshold / 2) return "MEDIUM";
    return "LOW";
  }
}

export default new AnalyticsService();
