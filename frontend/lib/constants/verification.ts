/**
 * Verification-related constants
 */

export enum VerificationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  PASS = "PASS",
  FAIL = "FAIL",
  WARNING = "WARNING",
  APPROVED = "APPROVED",
  REQUIRES_CORRECTION = "REQUIRES_CORRECTION",
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: "Pending",
  [VerificationStatus.IN_PROGRESS]: "In Progress",
  [VerificationStatus.PASS]: "Passed",
  [VerificationStatus.FAIL]: "Failed",
  [VerificationStatus.WARNING]: "Warning",
  [VerificationStatus.APPROVED]: "Approved",
  [VerificationStatus.REQUIRES_CORRECTION]: "Requires Correction",
};

export const VERIFICATION_STATUS_COLORS: Record<
  VerificationStatus,
  { bg: string; text: string; border: string }
> = {
  [VerificationStatus.PENDING]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [VerificationStatus.IN_PROGRESS]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [VerificationStatus.PASS]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [VerificationStatus.FAIL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  [VerificationStatus.WARNING]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [VerificationStatus.APPROVED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [VerificationStatus.REQUIRES_CORRECTION]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

export enum VerificationSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const VERIFICATION_SEVERITY_LABELS: Record<
  VerificationSeverity,
  string
> = {
  [VerificationSeverity.LOW]: "Low",
  [VerificationSeverity.MEDIUM]: "Medium",
  [VerificationSeverity.HIGH]: "High",
  [VerificationSeverity.CRITICAL]: "Critical",
};

export const VERIFICATION_SEVERITY_COLORS: Record<
  VerificationSeverity,
  { bg: string; text: string; border: string }
> = {
  [VerificationSeverity.LOW]: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  [VerificationSeverity.MEDIUM]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [VerificationSeverity.HIGH]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  [VerificationSeverity.CRITICAL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Verification check types from backend
export const VERIFICATION_CHECK_TYPES = {
  LAND_RECORD_EXISTS: "Land Record Exists",
  GEOMETRY_EXISTS: "Geometry Exists",
  PROJECT_INTERSECTION: "Project Intersection Valid",
  JURISDICTION: "Jurisdiction Matches",
  AREA_CONSISTENCY: "Area Consistency",
  DUPLICATE_ACQUISITION: "No Duplicate Acquisition Case",
  EXISTING_ACQUISITION: "No Existing Acquisition Case",
  REQUIRED_DOCUMENTS: "Required Documents Present",
  BENEFICIARY_VERIFICATION: "Beneficiary Verification State",
} as const;
