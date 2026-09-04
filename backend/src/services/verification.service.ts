import { prisma } from "../database/client.js";
import {
  VerificationCheck,
  VerificationResult,
} from "../types/verification.js";
import { NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class VerificationService {
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
    checks.push(await this.checkJurisdiction(acquisitionParcel));
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

  private async checkProjectBoundary(
    acquisitionParcel: any,
  ): Promise<VerificationCheck> {
    const hasBoundary = acquisitionParcel.project.boundary !== null;

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
  ): Promise<VerificationCheck> {
    const parcelStateId = acquisitionParcel.cadastralParcel.stateId;
    const projectStateId = acquisitionParcel.project.stateId;
    const parcelDistrictId = acquisitionParcel.cadastralParcel.districtId;
    const projectDistrictId = acquisitionParcel.project.districtId;

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
