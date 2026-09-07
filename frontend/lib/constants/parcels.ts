/**
 * Parcel-related constants
 */

export enum ParcelStatus {
  DRAFT = "DRAFT",
  IDENTIFIED = "IDENTIFIED",
  VERIFIED = "VERIFIED",
  IN_ACQUISITION = "IN_ACQUISITION",
  ACQUIRED = "ACQUIRED",
  DISPUTED = "DISPUTED",
  REJECTED = "REJECTED",
}

export const PARCEL_STATUS_LABELS: Record<ParcelStatus, string> = {
  [ParcelStatus.DRAFT]: "Draft",
  [ParcelStatus.IDENTIFIED]: "Identified",
  [ParcelStatus.VERIFIED]: "Verified",
  [ParcelStatus.IN_ACQUISITION]: "In Acquisition",
  [ParcelStatus.ACQUIRED]: "Acquired",
  [ParcelStatus.DISPUTED]: "Disputed",
  [ParcelStatus.REJECTED]: "Rejected",
};

export const PARCEL_STATUS_COLORS: Record<
  ParcelStatus,
  { bg: string; text: string; border: string }
> = {
  [ParcelStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [ParcelStatus.IDENTIFIED]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [ParcelStatus.VERIFIED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [ParcelStatus.IN_ACQUISITION]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [ParcelStatus.ACQUIRED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ParcelStatus.DISPUTED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  [ParcelStatus.REJECTED]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

export enum VerificationStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
  REQUIRES_CORRECTION = "REQUIRES_CORRECTION",
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  [VerificationStatus.NOT_STARTED]: "Not Started",
  [VerificationStatus.PENDING]: "Pending",
  [VerificationStatus.VERIFIED]: "Verified",
  [VerificationStatus.FAILED]: "Failed",
  [VerificationStatus.REQUIRES_CORRECTION]: "Requires Correction",
};

export enum AcquisitionStatus {
  NOT_STARTED = "NOT_STARTED",
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  VERIFIED = "VERIFIED",
  ACQUISITION_INITIATED = "ACQUISITION_INITIATED",
  NOTIFICATION_STAGE = "NOTIFICATION_STAGE",
  AWARD_STAGE = "AWARD_STAGE",
  ACQUISITION_COMPLETED = "ACQUISITION_COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export const ACQUISITION_STATUS_LABELS: Record<AcquisitionStatus, string> = {
  [AcquisitionStatus.NOT_STARTED]: "Not Started",
  [AcquisitionStatus.DRAFT]: "Draft",
  [AcquisitionStatus.SUBMITTED]: "Submitted",
  [AcquisitionStatus.UNDER_REVIEW]: "Under Review",
  [AcquisitionStatus.VERIFIED]: "Verified",
  [AcquisitionStatus.ACQUISITION_INITIATED]: "Initiated",
  [AcquisitionStatus.NOTIFICATION_STAGE]: "Notification",
  [AcquisitionStatus.AWARD_STAGE]: "Award Stage",
  [AcquisitionStatus.ACQUISITION_COMPLETED]: "Completed",
  [AcquisitionStatus.ON_HOLD]: "On Hold",
  [AcquisitionStatus.CANCELLED]: "Cancelled",
};
