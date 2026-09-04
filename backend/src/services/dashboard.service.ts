import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

class DashboardService {
  async getNationalMetrics() {
    logger.info("Fetching national dashboard metrics");

    const [
      totalProjects,
      completedProjects,
      totalParcels,
      landProposed,
      landAcquired,
      compensationStats,
      paymentStats,
      rrStats,
      possessionStats,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.acquisitionParcel.count(),
      prisma.acquisitionParcel.aggregate({
        _sum: { requiredAreaSqMeters: true },
      }),
      prisma.acquisitionParcel.aggregate({
        where: { status: "ACQUISITION_COMPLETED" },
        _sum: { requiredAreaSqMeters: true },
      }),
      this.getCompensationStats(),
      this.getPaymentStats(),
      this.getRRStats(),
      this.getPossessionStats(),
    ]);

    return {
      projects: {
        total: totalProjects,
        completed: completedProjects,
      },
      land: {
        proposedSquareMeters: Number(
          landProposed._sum?.requiredAreaSqMeters || 0,
        ),
        acquiredSquareMeters: Number(
          landAcquired._sum?.requiredAreaSqMeters || 0,
        ),
        proposedAcres: this.metersToAcres(
          Number(landProposed._sum?.requiredAreaSqMeters || 0),
        ),
        acquiredAcres: this.metersToAcres(
          Number(landAcquired._sum?.requiredAreaSqMeters || 0),
        ),
      },
      parcels: {
        total: totalParcels,
      },
      compensation: compensationStats,
      payments: paymentStats,
      rr: rrStats,
      possession: possessionStats,
    };
  }

  async getStateMetrics(stateId: string) {
    logger.info("Fetching state dashboard metrics", { stateId });

    const [
      totalProjects,
      completedProjects,
      totalParcels,
      landProposed,
      landAcquired,
      compensationStats,
      paymentStats,
      rrStats,
      possessionStats,
    ] = await Promise.all([
      prisma.project.count({ where: { stateId } }),
      prisma.project.count({ where: { stateId, status: "COMPLETED" } }),
      prisma.acquisitionParcel.count({ where: { project: { stateId } } }),
      prisma.acquisitionParcel.aggregate({
        where: { project: { stateId } },
        _sum: { requiredAreaSqMeters: true },
      }),
      prisma.acquisitionParcel.aggregate({
        where: { project: { stateId }, status: "ACQUISITION_COMPLETED" },
        _sum: { requiredAreaSqMeters: true },
      }),
      this.getCompensationStats(stateId),
      this.getPaymentStats(stateId),
      this.getRRStats(stateId),
      this.getPossessionStats(stateId),
    ]);

    return {
      stateId,
      projects: { total: totalProjects, completed: completedProjects },
      land: {
        proposedSquareMeters: Number(
          landProposed._sum?.requiredAreaSqMeters || 0,
        ),
        acquiredSquareMeters: Number(
          landAcquired._sum?.requiredAreaSqMeters || 0,
        ),
        proposedAcres: this.metersToAcres(
          Number(landProposed._sum?.requiredAreaSqMeters || 0),
        ),
        acquiredAcres: this.metersToAcres(
          Number(landAcquired._sum?.requiredAreaSqMeters || 0),
        ),
      },
      parcels: { total: totalParcels },
      compensation: compensationStats,
      payments: paymentStats,
      rr: rrStats,
      possession: possessionStats,
    };
  }

  async getDistrictMetrics(districtId: string) {
    logger.info("Fetching district dashboard metrics", { districtId });

    const [
      totalProjects,
      completedProjects,
      totalParcels,
      landProposed,
      landAcquired,
      compensationStats,
      paymentStats,
      rrStats,
      possessionStats,
    ] = await Promise.all([
      prisma.project.count({ where: { districtId } }),
      prisma.project.count({ where: { districtId, status: "COMPLETED" } }),
      prisma.acquisitionParcel.count({ where: { project: { districtId } } }),
      prisma.acquisitionParcel.aggregate({
        where: { project: { districtId } },
        _sum: { requiredAreaSqMeters: true },
      }),
      prisma.acquisitionParcel.aggregate({
        where: { project: { districtId }, status: "ACQUISITION_COMPLETED" },
        _sum: { requiredAreaSqMeters: true },
      }),
      this.getCompensationStats(undefined, districtId),
      this.getPaymentStats(undefined, districtId),
      this.getRRStats(undefined, districtId),
      this.getPossessionStats(undefined, districtId),
    ]);

    return {
      districtId,
      projects: { total: totalProjects, completed: completedProjects },
      land: {
        proposedSquareMeters: Number(
          landProposed._sum?.requiredAreaSqMeters || 0,
        ),
        acquiredSquareMeters: Number(
          landAcquired._sum?.requiredAreaSqMeters || 0,
        ),
        proposedAcres: this.metersToAcres(
          Number(landProposed._sum?.requiredAreaSqMeters || 0),
        ),
        acquiredAcres: this.metersToAcres(
          Number(landAcquired._sum?.requiredAreaSqMeters || 0),
        ),
      },
      parcels: { total: totalParcels },
      compensation: compensationStats,
      payments: paymentStats,
      rr: rrStats,
      possession: possessionStats,
    };
  }

  async getProjectMetrics(projectId: string) {
    logger.info("Fetching project dashboard metrics", { projectId });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { state: true, district: true },
    });
    if (!project) throw new Error("Project not found");

    const [
      totalParcels,
      landProposed,
      landAcquired,
      casesStats,
      compensationStats,
      paymentStats,
      rrStats,
      possessionStats,
      milestoneStats,
    ] = await Promise.all([
      prisma.acquisitionParcel.count({ where: { projectId } }),
      prisma.acquisitionParcel.aggregate({
        where: { projectId },
        _sum: { requiredAreaSqMeters: true },
      }),
      prisma.acquisitionParcel.aggregate({
        where: { projectId, status: "ACQUISITION_COMPLETED" },
        _sum: { requiredAreaSqMeters: true },
      }),
      this.getCasesStats(projectId),
      this.getCompensationStats(undefined, undefined, projectId),
      this.getPaymentStats(undefined, undefined, projectId),
      this.getRRStats(undefined, undefined, projectId),
      this.getPossessionStats(undefined, undefined, projectId),
      this.getMilestoneStats(projectId),
    ]);

    return {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        state: project.state.name,
        district: project.district?.name,
      },
      land: {
        proposedSquareMeters: Number(
          landProposed._sum?.requiredAreaSqMeters || 0,
        ),
        acquiredSquareMeters: Number(
          landAcquired._sum?.requiredAreaSqMeters || 0,
        ),
        proposedAcres: this.metersToAcres(
          Number(landProposed._sum?.requiredAreaSqMeters || 0),
        ),
        acquiredAcres: this.metersToAcres(
          Number(landAcquired._sum?.requiredAreaSqMeters || 0),
        ),
      },
      parcels: { total: totalParcels },
      cases: casesStats,
      compensation: compensationStats,
      payments: paymentStats,
      rr: rrStats,
      possession: possessionStats,
      milestones: milestoneStats,
    };
  }

  private async getCompensationStats(
    stateId?: string,
    districtId?: string,
    projectId?: string,
  ) {
    const where: any = {};
    if (projectId) where.acquisitionCase = { acquisitionParcel: { projectId } };
    else if (districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId } },
      };
    else if (stateId)
      where.acquisitionCase = { acquisitionParcel: { project: { stateId } } };

    const [totalAssessments, totalAmount] = await Promise.all([
      prisma.compensationAssessment.count({ where }),
      prisma.compensationAssessment.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalAssessments,
      totalAssessed: Number(totalAmount._sum?.totalAmount || 0),
    };
  }

  private async getPaymentStats(
    stateId?: string,
    districtId?: string,
    projectId?: string,
  ) {
    const where: any = {};
    if (projectId) where.acquisitionCase = { acquisitionParcel: { projectId } };
    else if (districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId } },
      };
    else if (stateId)
      where.acquisitionCase = { acquisitionParcel: { project: { stateId } } };

    const [totalPayments, initiatedAmount, creditedAmount, failedPayments] =
      await Promise.all([
        prisma.paymentTransaction.count({ where }),
        prisma.paymentTransaction.aggregate({
          where: { ...where, status: { in: ["INITIATED", "PROCESSING"] } },
          _sum: { amount: true },
        }),
        prisma.paymentTransaction.aggregate({
          where: { ...where, status: "CREDITED" },
          _sum: { amount: true },
        }),
        prisma.paymentTransaction.count({
          where: { ...where, status: "FAILED" },
        }),
      ]);

    return {
      totalPayments,
      initiatedAmount: Number(initiatedAmount._sum?.amount || 0),
      creditedAmount: Number(creditedAmount._sum?.amount || 0),
      failedPayments,
    };
  }

  private async getRRStats(
    stateId?: string,
    districtId?: string,
    projectId?: string,
  ) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    else if (districtId) where.project = { districtId };
    else if (stateId) where.project = { stateId };

    const [totalCases, completed, inProgress] = await Promise.all([
      prisma.rRCase.count({ where: { ...where, applicable: true } }),
      prisma.rRCase.count({ where: { ...where, status: "COMPLETED" } }),
      prisma.rRCase.count({
        where: {
          ...where,
          status: { in: ["ASSESSMENT", "PROVISION_IN_PROGRESS"] },
        },
      }),
    ]);

    return { totalCases, completed, inProgress };
  }

  private async getPossessionStats(
    stateId?: string,
    districtId?: string,
    projectId?: string,
  ) {
    const where: any = {};
    if (projectId) where.acquisitionCase = { acquisitionParcel: { projectId } };
    else if (districtId)
      where.acquisitionCase = {
        acquisitionParcel: { project: { districtId } },
      };
    else if (stateId)
      where.acquisitionCase = { acquisitionParcel: { project: { stateId } } };

    const [totalRecords, recorded, pending] = await Promise.all([
      prisma.possessionRecord.count({ where }),
      prisma.possessionRecord.count({
        where: { ...where, status: "RECORDED" },
      }),
      prisma.possessionRecord.count({
        where: { ...where, status: { in: ["PENDING", "READY"] } },
      }),
    ]);

    return { totalRecords, recorded, pending };
  }

  private async getCasesStats(projectId: string) {
    const [total, draft, verificationPending, verified, completed] =
      await Promise.all([
        prisma.acquisitionCase.count({
          where: { acquisitionParcel: { projectId } },
        }),
        prisma.acquisitionParcel.count({
          where: { projectId, status: "DRAFT" },
        }),
        prisma.acquisitionParcel.count({
          where: { projectId, status: "VERIFICATION_PENDING" },
        }),
        prisma.acquisitionParcel.count({
          where: { projectId, status: "VERIFIED" },
        }),
        prisma.acquisitionParcel.count({
          where: { projectId, status: "ACQUISITION_COMPLETED" },
        }),
      ]);

    return { total, draft, verificationPending, verified, completed };
  }

  private async getMilestoneStats(projectId: string) {
    const [total, completed, overdue] = await Promise.all([
      prisma.projectMilestone.count({ where: { projectId } }),
      prisma.projectMilestone.count({
        where: { projectId, status: "COMPLETED" },
      }),
      prisma.projectMilestone.count({
        where: {
          projectId,
          status: { not: "COMPLETED" },
          deadline: { lt: new Date() },
        },
      }),
    ]);

    return { total, completed, overdue };
  }

  private metersToAcres(squareMeters: number): number {
    return Math.round((squareMeters / 4046.86) * 100) / 100;
  }
}

export default new DashboardService();
