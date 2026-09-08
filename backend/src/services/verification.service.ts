import { prisma } from "../database/client.js";
import {
  VerificationCheck,
  VerificationResult,
} from "../types/verification.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { Prisma, VerificationStatus } from "../../generated/prisma/client.js";

export class VerificationService {
  async getVerificationCases(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: VerificationStatus;
    projectId?: string;
    assignedUserId?: string;
  }) {
    const {
      page = 1,
      limit = 25,
      search,
      status,
      projectId,
      assignedUserId,
    } = params;

    const where: Prisma.VerificationCaseWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    if (projectId || search) {
      const acquisitionParcelWhere: any = {};

      if (projectId) {
        acquisitionParcelWhere.projectId = projectId;
      }

      if (search) {
        acquisitionParcelWhere.OR = [
          { acquisitionReference: { contains: search, mode: "insensitive" } },
          {
            cadastralParcel: {
              surveyNumber: { contains: search, mode: "insensitive" },
            },
          },
        ];
      }

      where.acquisitionCase = {
        acquisitionParcel: acquisitionParcelWhere,
      };
    }

    const [cases, total] = await Promise.all([
      prisma.verificationCase.findMany({
        where,
        include: {
          acquisitionCase: {
            select: {
              id: true,
              status: true,
              acquisitionParcel: {
                select: {
                  id: true,
                  acquisitionReference: true,
                  projectId: true,
                  status: true,
                },
              },
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          results: {
            orderBy: { checkedAt: "desc" },
            take: 10,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.verificationCase.count({ where }),
    ]);

    return {
      data: cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVerificationCase(caseId: string) {
    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: {
        acquisitionCase: {
          select: {
            id: true,
            status: true,
            acquisitionParcel: {
              select: {
                id: true,
                acquisitionReference: true,
                projectId: true,
                requiredAreaSqMeters: true,
                status: true,
              },
            },
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        results: {
          orderBy: { checkedAt: "desc" },
        },
      },
    });

    if (!verificationCase) {
      throw new NotFoundError("Verification case not found");
    }

    return verificationCase;
  }

  async createVerificationCase(data: {
    acquisitionCaseId: string;
    assignedUserId?: string;
  }) {
    // Check if acquisition case exists
    const acquisitionCase = await prisma.acquisitionCase.findUnique({
      where: { id: data.acquisitionCaseId },
    });

    if (!acquisitionCase) {
      throw new NotFoundError("Acquisition case not found");
    }

    // Check if verification case already exists
    const existing = await prisma.verificationCase.findFirst({
      where: { acquisitionCaseId: data.acquisitionCaseId },
    });

    if (existing) {
      throw new ValidationError(
        "Verification case already exists for this acquisition case",
      );
    }

    const verificationCase = await prisma.verificationCase.create({
      data: {
        acquisitionCaseId: data.acquisitionCaseId,
        assignedUserId: data.assignedUserId,
        status: VerificationStatus.PENDING,
      },
      include: {
        acquisitionCase: {
          select: {
            id: true,
            status: true,
            acquisitionParcel: {
              select: {
                id: true,
                acquisitionReference: true,
              },
            },
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info("Verification case created", {
      caseId: verificationCase.id,
      acquisitionCaseId: data.acquisitionCaseId,
    });

    return verificationCase;
  }

  async runVerificationChecks(caseId: string) {
    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: {
        acquisitionCase: {
          include: {
            acquisitionParcel: {
              include: {
                cadastralParcel: {
                  include: {
                    landRecords: { take: 1, orderBy: { retrievedAt: "desc" } },
                    geometrySources: { where: { isCurrent: true }, take: 1 },
                  },
                },
                project: {
                  include: {
                    boundary: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!verificationCase) {
      throw new NotFoundError("Verification case not found");
    }

    // Update status to IN_PROGRESS
    await prisma.verificationCase.update({
      where: { id: caseId },
      data: {
        status: VerificationStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    const checks: VerificationCheck[] = [];
    let overallStatus: VerificationStatus = VerificationStatus.PASS;

    // Run checks for the acquisition parcel
    const parcel = verificationCase.acquisitionCase.acquisitionParcel;
    const parcelChecks = await this.runParcelChecks(parcel, parcel.project);
    checks.push(...parcelChecks);

    // Determine overall status
    const hasFailures = checks.some((c) => c.status === "FAIL");
    const hasWarnings = checks.some((c) => c.status === "WARNING");

    if (hasFailures) {
      overallStatus = VerificationStatus.FAIL;
    } else if (hasWarnings) {
      overallStatus = VerificationStatus.WARNING;
    } else {
      overallStatus = VerificationStatus.PASS;
    }

    // Save verification results
    await prisma.$transaction(
      checks.map((check) =>
        prisma.verificationResult.create({
          data: {
            verificationCaseId: caseId,
            checkName: check.checkName,
            status: check.status as VerificationStatus,
            severity: check.severity,
            source: check.source,
            message: check.message,
            checkedAt: new Date(),
            ruleVersion: "1.0.0",
          },
        }),
      ),
    );

    // Update verification case
    const updatedCase = await prisma.verificationCase.update({
      where: { id: caseId },
      data: {
        status: overallStatus,
        completedAt: new Date(),
      },
      include: {
        results: true,
        acquisitionCase: true,
        assignedUser: true,
      },
    });

    logger.info("Verification checks completed", {
      caseId,
      overallStatus,
      checkCount: checks.length,
    });

    return updatedCase;
  }

  /**
   * Approve a verification case
   */
  async approveVerificationCase(caseId: string) {
    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
    });

    if (!verificationCase) {
      throw new NotFoundError("Verification case not found");
    }

    if (verificationCase.status === VerificationStatus.FAIL) {
      throw new ValidationError(
        "Cannot approve a verification case with failed checks",
      );
    }

    const updatedCase = await prisma.verificationCase.update({
      where: { id: caseId },
      data: {
        status: VerificationStatus.APPROVED,
      },
      include: {
        results: true,
        acquisitionCase: true,
        assignedUser: true,
      },
    });

    logger.info("Verification case approved", { caseId });

    return updatedCase;
  }

  /**
   * Request correction for a verification case
   */
  async requestCorrection(caseId: string, reason: string) {
    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
    });

    if (!verificationCase) {
      throw new NotFoundError("Verification case not found");
    }

    const updatedCase = await prisma.verificationCase.update({
      where: { id: caseId },
      data: {
        status: VerificationStatus.REQUIRES_CORRECTION,
      },
      include: {
        results: true,
        acquisitionCase: true,
        assignedUser: true,
      },
    });

    logger.info("Verification correction requested", { caseId, reason });

    return updatedCase;
  }

  /**
   * Helper method to run checks on a single parcel
   */
  private async runParcelChecks(
    acquisitionParcel: any,
    project: any,
  ): Promise<VerificationCheck[]> {
    const checks: VerificationCheck[] = [];

    checks.push(await this.checkLandRecordExists(acquisitionParcel));
    checks.push(await this.checkGeometryExists(acquisitionParcel));
    checks.push(await this.checkProjectBoundary(project));
    checks.push(await this.checkJurisdiction(acquisitionParcel, project));
    checks.push(await this.checkAreaConsistency(acquisitionParcel));
    checks.push(await this.checkDuplicateAcquisition(acquisitionParcel));

    return checks;
  }

  async verifyAcquisitionParcel(
    acquisitionParcelId: string,
  ): Promise<VerificationResult> {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id: acquisitionParcelId },
      include: {
        cadastralParcel: {
          include: {
            landRecords: { take: 1, orderBy: { retrievedAt: "desc" } },
            geometrySources: { where: { isCurrent: true }, take: 1 },
          },
        },
        project: {
          include: {
            boundary: true,
          },
        },
      },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    logger.info("Running verification checks", { acquisitionParcelId });

    const checks: VerificationCheck[] = [];

    checks.push(await this.checkLandRecordExists(acquisitionParcel));
    checks.push(await this.checkGeometryExists(acquisitionParcel));
    checks.push(await this.checkProjectBoundary(acquisitionParcel));
    checks.push(
      await this.checkJurisdiction(acquisitionParcel, acquisitionParcel),
    );
    checks.push(await this.checkAreaConsistency(acquisitionParcel));
    checks.push(await this.checkDuplicateAcquisition(acquisitionParcel));

    const passedChecks = checks.filter((c) => c.status === "PASS").length;
    const failedChecks = checks.filter((c) => c.status === "FAIL").length;
    const warningChecks = checks.filter((c) => c.status === "WARNING").length;
    const pendingChecks = checks.filter((c) => c.status === "PENDING").length;

    let overallStatus: "PASS" | "FAIL" | "WARNING" | "PENDING" = "PASS";
    if (failedChecks > 0) overallStatus = "FAIL";
    else if (warningChecks > 0) overallStatus = "WARNING";
    else if (pendingChecks > 0) overallStatus = "PENDING";

    const result: VerificationResult = {
      entityType: "ACQUISITION_PARCEL",
      entityId: acquisitionParcelId,
      checks,
      overallStatus,
      passedChecks,
      failedChecks,
      warningChecks,
      pendingChecks,
      verifiedAt: new Date(),
    };

    logger.info("Verification completed", {
      acquisitionParcelId,
      overallStatus,
      passedChecks,
      failedChecks,
      warningChecks,
      pendingChecks,
    });

    return result;
  }

  private async checkLandRecordExists(
    acquisitionParcel: any,
  ): Promise<VerificationCheck> {
    const hasLandRecord =
      acquisitionParcel.cadastralParcel.landRecords.length > 0;

    return {
      checkName: "LAND_RECORD_EXISTS",
      status: hasLandRecord ? "PASS" : "FAIL",
      severity: "HIGH",
      source: "VERIFICATION_SERVICE",
      message: hasLandRecord
        ? "Land record found"
        : "No land record found for this parcel",
      metadata: {
        recordCount: acquisitionParcel.cadastralParcel.landRecords.length,
      },
    };
  }

  private async checkGeometryExists(
    acquisitionParcel: any,
  ): Promise<VerificationCheck> {
    const hasGeometry =
      acquisitionParcel.cadastralParcel.geometrySources.length > 0;

    return {
      checkName: "GEOMETRY_EXISTS",
      status: hasGeometry ? "PASS" : "WARNING",
      severity: "MEDIUM",
      source: "VERIFICATION_SERVICE",
      message: hasGeometry
        ? "Parcel geometry found"
        : "No geometry found for this parcel",
      metadata: {
        hasGeometry,
      },
    };
  }

  private async checkProjectBoundary(project: any): Promise<VerificationCheck> {
    const hasBoundary =
      project?.boundary !== null && project?.boundary !== undefined;

    return {
      checkName: "PROJECT_BOUNDARY_EXISTS",
      status: hasBoundary ? "PASS" : "WARNING",
      severity: "MEDIUM",
      source: "VERIFICATION_SERVICE",
      message: hasBoundary
        ? "Project boundary defined"
        : "Project boundary not defined",
      metadata: {
        hasBoundary,
      },
    };
  }

  private async checkJurisdiction(
    acquisitionParcel: any,
    project: any,
  ): Promise<VerificationCheck> {
    const parcelStateId = acquisitionParcel.cadastralParcel.stateId;
    const projectStateId = project.stateId;
    const parcelDistrictId = acquisitionParcel.cadastralParcel.districtId;
    const projectDistrictId = project.districtId;

    const stateMatch = parcelStateId === projectStateId;
    const districtMatch =
      !projectDistrictId || parcelDistrictId === projectDistrictId;

    const jurisdictionValid = stateMatch && districtMatch;

    return {
      checkName: "JURISDICTION_MATCH",
      status: jurisdictionValid ? "PASS" : "FAIL",
      severity: "CRITICAL",
      source: "VERIFICATION_SERVICE",
      message: jurisdictionValid
        ? "Parcel jurisdiction matches project"
        : "Parcel jurisdiction does not match project",
      metadata: {
        parcelStateId,
        projectStateId,
        parcelDistrictId,
        projectDistrictId,
        stateMatch,
        districtMatch,
      },
    };
  }

  private async checkAreaConsistency(
    acquisitionParcel: any,
  ): Promise<VerificationCheck> {
    const cadastralArea = parseFloat(
      acquisitionParcel.cadastralParcel.areaSqMeters,
    );
    const requiredArea = parseFloat(acquisitionParcel.requiredAreaSqMeters);

    const tolerance = 0.01;
    const difference = Math.abs(cadastralArea - requiredArea);
    const percentDiff = (difference / cadastralArea) * 100;

    const isConsistent =
      percentDiff <= tolerance || requiredArea <= cadastralArea;

    return {
      checkName: "AREA_CONSISTENCY",
      status: isConsistent ? "PASS" : "WARNING",
      severity: "MEDIUM",
      source: "VERIFICATION_SERVICE",
      message: isConsistent
        ? "Area measurements are consistent"
        : `Area difference: ${percentDiff.toFixed(2)}%`,
      metadata: {
        cadastralArea,
        requiredArea,
        difference,
        percentDiff,
      },
    };
  }

  private async checkDuplicateAcquisition(
    acquisitionParcel: any,
  ): Promise<VerificationCheck> {
    const existingAcquisitions = await prisma.acquisitionParcel.findMany({
      where: {
        cadastralParcelId: acquisitionParcel.cadastralParcelId,
        id: { not: acquisitionParcel.id },
        status: {
          in: [
            "DRAFT",
            "SUBMITTED",
            "UNDER_REVIEW",
            "VERIFIED",
            "ACQUISITION_INITIATED",
          ],
        },
      },
    });

    const hasDuplicate = existingAcquisitions.length > 0;

    return {
      checkName: "NO_DUPLICATE_ACQUISITION",
      status: hasDuplicate ? "FAIL" : "PASS",
      severity: hasDuplicate ? "CRITICAL" : "LOW",
      source: "VERIFICATION_SERVICE",
      message: hasDuplicate
        ? `Found ${existingAcquisitions.length} active acquisition(s) for this parcel`
        : "No duplicate acquisitions found",
      metadata: {
        duplicateCount: existingAcquisitions.length,
        duplicateIds: existingAcquisitions.map((a) => a.id),
      },
    };
  }
}

export default new VerificationService();
