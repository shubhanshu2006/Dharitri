/**
 * Acquisition-related constants
 */

export enum AcquisitionStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  VERIFICATION_PENDING = "VERIFICATION_PENDING",
  VERIFIED = "VERIFIED",
  ACQUISITION_INITIATED = "ACQUISITION_INITIATED",
  NOTIFICATION_STAGE = "NOTIFICATION_STAGE",
  AWARD_STAGE = "AWARD_STAGE",
  ACQUISITION_COMPLETED = "ACQUISITION_COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export const ACQUISITION_STATUS_LABELS: Record<AcquisitionStatus, string> = {
  [AcquisitionStatus.DRAFT]: "Draft",
  [AcquisitionStatus.SUBMITTED]: "Submitted",
  [AcquisitionStatus.UNDER_REVIEW]: "Under Review",
  [AcquisitionStatus.VERIFICATION_PENDING]: "Verification Pending",
  [AcquisitionStatus.VERIFIED]: "Verified",
  [AcquisitionStatus.ACQUISITION_INITIATED]: "Initiated",
  [AcquisitionStatus.NOTIFICATION_STAGE]: "Notification Stage",
  [AcquisitionStatus.AWARD_STAGE]: "Award Stage",
  [AcquisitionStatus.ACQUISITION_COMPLETED]: "Completed",
  [AcquisitionStatus.ON_HOLD]: "On Hold",
  [AcquisitionStatus.CANCELLED]: "Cancelled",
};

export const ACQUISITION_STATUS_COLORS: Record<
  AcquisitionStatus,
  { bg: string; text: string; border: string }
> = {
  [AcquisitionStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [AcquisitionStatus.SUBMITTED]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [AcquisitionStatus.UNDER_REVIEW]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [AcquisitionStatus.VERIFICATION_PENDING]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [AcquisitionStatus.VERIFIED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [AcquisitionStatus.ACQUISITION_INITIATED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [AcquisitionStatus.NOTIFICATION_STAGE]: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  [AcquisitionStatus.AWARD_STAGE]: {
    bg: "bg-lime-100",
    text: "text-lime-700",
    border: "border-lime-200",
  },
  [AcquisitionStatus.ACQUISITION_COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [AcquisitionStatus.ON_HOLD]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  [AcquisitionStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Valid status transitions (from API spec)
export const ACQUISITION_STATUS_TRANSITIONS: Record<
  AcquisitionStatus,
  AcquisitionStatus[]
> = {
  [AcquisitionStatus.DRAFT]: [
    AcquisitionStatus.SUBMITTED,
    AcquisitionStatus.CANCELLED,
  ],
  [AcquisitionStatus.SUBMITTED]: [
    AcquisitionStatus.UNDER_REVIEW,
    AcquisitionStatus.DRAFT,
    AcquisitionStatus.CANCELLED,
  ],
  [AcquisitionStatus.UNDER_REVIEW]: [
    AcquisitionStatus.VERIFICATION_PENDING,
    AcquisitionStatus.SUBMITTED,
    AcquisitionStatus.ON_HOLD,
    AcquisitionStatus.CANCELLED,
  ],
  [AcquisitionStatus.VERIFICATION_PENDING]: [
    AcquisitionStatus.VERIFIED,
    AcquisitionStatus.UNDER_REVIEW,
    AcquisitionStatus.ON_HOLD,
  ],
  [AcquisitionStatus.VERIFIED]: [
    AcquisitionStatus.ACQUISITION_INITIATED,
    AcquisitionStatus.ON_HOLD,
  ],
  [AcquisitionStatus.ACQUISITION_INITIATED]: [
    AcquisitionStatus.NOTIFICATION_STAGE,
    AcquisitionStatus.ON_HOLD,
  ],
  [AcquisitionStatus.NOTIFICATION_STAGE]: [
    AcquisitionStatus.AWARD_STAGE,
    AcquisitionStatus.ON_HOLD,
  ],
  [AcquisitionStatus.AWARD_STAGE]: [
    AcquisitionStatus.ACQUISITION_COMPLETED,
    AcquisitionStatus.ON_HOLD,
  ],
  [AcquisitionStatus.ACQUISITION_COMPLETED]: [],
  [AcquisitionStatus.ON_HOLD]: [
    AcquisitionStatus.UNDER_REVIEW,
    AcquisitionStatus.CANCELLED,
  ],
  [AcquisitionStatus.CANCELLED]: [],
};

export const ACQUISITION_STATUS_DESCRIPTIONS: Record<AcquisitionStatus, string> = {
  [AcquisitionStatus.DRAFT]: "Case is being prepared",
  [AcquisitionStatus.SUBMITTED]: "Case has been submitted for review",
  [AcquisitionStatus.UNDER_REVIEW]: "Case is under review by authorities",
  [AcquisitionStatus.VERIFICATION_PENDING]: "Awaiting verification checks",
  [AcquisitionStatus.VERIFIED]: "Verification completed successfully",
  [AcquisitionStatus.ACQUISITION_INITIATED]: "Acquisition process has started",
  [AcquisitionStatus.NOTIFICATION_STAGE]: "Notifications are being issued",
  [AcquisitionStatus.AWARD_STAGE]: "Award process is in progress",
  [AcquisitionStatus.ACQUISITION_COMPLETED]: "Acquisition successfully completed",
  [AcquisitionStatus.ON_HOLD]: "Case is temporarily on hold",
  [AcquisitionStatus.CANCELLED]: "Case has been cancelled",
};
