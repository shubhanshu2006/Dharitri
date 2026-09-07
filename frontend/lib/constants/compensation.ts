/**
 * Compensation-related constants
 */

export enum CompensationStatus {
  DRAFT = "DRAFT",
  UNDER_REVIEW = "UNDER_REVIEW",
  CORRECTION_REQUIRED = "CORRECTION_REQUIRED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const COMPENSATION_STATUS_LABELS: Record<CompensationStatus, string> = {
  [CompensationStatus.DRAFT]: "Draft",
  [CompensationStatus.UNDER_REVIEW]: "Under Review",
  [CompensationStatus.CORRECTION_REQUIRED]: "Correction Required",
  [CompensationStatus.SUBMITTED]: "Submitted",
  [CompensationStatus.APPROVED]: "Approved",
  [CompensationStatus.REJECTED]: "Rejected",
};

export const COMPENSATION_STATUS_COLORS: Record<
  CompensationStatus,
  { bg: string; text: string; border: string }
> = {
  [CompensationStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [CompensationStatus.UNDER_REVIEW]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [CompensationStatus.CORRECTION_REQUIRED]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  [CompensationStatus.SUBMITTED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [CompensationStatus.APPROVED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [CompensationStatus.REJECTED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Compensation component types
export const COMPENSATION_COMPONENTS = {
  LAND_VALUE: "Land Value",
  SOLATIUM: "Solatium (100%)",
  INTEREST: "Interest (12%)",
  OTHER_COMPONENTS: "Other Components",
  DEDUCTIONS: "Deductions",
} as const;

export const COMPENSATION_COMPONENT_DESCRIPTIONS = {
  LAND_VALUE: "Base market value of the land being acquired",
  SOLATIUM: "Additional 100% of land value as compensation for compulsory acquisition",
  INTEREST: "12% per annum interest from acquisition notification to payment",
  OTHER_COMPONENTS: "Additional entitlements like structures, trees, crops, etc.",
  DEDUCTIONS: "Any amounts to be deducted from total compensation",
} as const;
