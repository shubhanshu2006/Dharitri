/**
 * R&R (Rehabilitation & Resettlement) related constants
 * Based on backend RRStatus enum and service implementation
 */

export enum RRStatus {
  NOT_STARTED = "NOT_STARTED",
  APPLICABILITY_REVIEW = "APPLICABILITY_REVIEW",
  ASSESSMENT = "ASSESSMENT",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  APPROVED = "APPROVED",
  PROVISION_IN_PROGRESS = "PROVISION_IN_PROGRESS",
  FIELD_VERIFICATION = "FIELD_VERIFICATION",
  COMPLETED = "COMPLETED",
  DISPUTED = "DISPUTED",
  ON_HOLD = "ON_HOLD",
}

export const RR_STATUS_LABELS: Record<RRStatus, string> = {
  [RRStatus.NOT_STARTED]: "Not Started",
  [RRStatus.APPLICABILITY_REVIEW]: "Applicability Review",
  [RRStatus.ASSESSMENT]: "Assessment",
  [RRStatus.APPROVAL_PENDING]: "Approval Pending",
  [RRStatus.APPROVED]: "Approved",
  [RRStatus.PROVISION_IN_PROGRESS]: "Provision in Progress",
  [RRStatus.FIELD_VERIFICATION]: "Field Verification",
  [RRStatus.COMPLETED]: "Completed",
  [RRStatus.DISPUTED]: "Disputed",
  [RRStatus.ON_HOLD]: "On Hold",
};

export const RR_STATUS_COLORS: Record<
  RRStatus,
  { bg: string; text: string; border: string }
> = {
  [RRStatus.NOT_STARTED]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [RRStatus.APPLICABILITY_REVIEW]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [RRStatus.ASSESSMENT]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [RRStatus.APPROVAL_PENDING]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [RRStatus.APPROVED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [RRStatus.PROVISION_IN_PROGRESS]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [RRStatus.FIELD_VERIFICATION]: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  [RRStatus.COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [RRStatus.DISPUTED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  [RRStatus.ON_HOLD]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

// Valid status transitions (from backend service)
export const RR_STATUS_TRANSITIONS: Record<RRStatus, RRStatus[]> = {
  [RRStatus.NOT_STARTED]: [RRStatus.APPLICABILITY_REVIEW],
  [RRStatus.APPLICABILITY_REVIEW]: [
    RRStatus.ASSESSMENT,
    RRStatus.NOT_STARTED,
  ],
  [RRStatus.ASSESSMENT]: [
    RRStatus.APPROVAL_PENDING,
    RRStatus.APPLICABILITY_REVIEW,
  ],
  [RRStatus.APPROVAL_PENDING]: [
    RRStatus.APPROVED,
    RRStatus.ASSESSMENT,
    RRStatus.DISPUTED,
  ],
  [RRStatus.APPROVED]: [RRStatus.PROVISION_IN_PROGRESS],
  [RRStatus.PROVISION_IN_PROGRESS]: [
    RRStatus.FIELD_VERIFICATION,
    RRStatus.ON_HOLD,
  ],
  [RRStatus.FIELD_VERIFICATION]: [
    RRStatus.COMPLETED,
    RRStatus.PROVISION_IN_PROGRESS,
  ],
  [RRStatus.COMPLETED]: [],
  [RRStatus.DISPUTED]: [RRStatus.APPLICABILITY_REVIEW, RRStatus.ASSESSMENT],
  [RRStatus.ON_HOLD]: [RRStatus.PROVISION_IN_PROGRESS, RRStatus.DISPUTED],
};

export const RR_STATUS_DESCRIPTIONS: Record<RRStatus, string> = {
  [RRStatus.NOT_STARTED]: "R&R case not yet started",
  [RRStatus.APPLICABILITY_REVIEW]: "Reviewing R&R applicability for affected family",
  [RRStatus.ASSESSMENT]: "Assessing R&R entitlements",
  [RRStatus.APPROVAL_PENDING]: "Awaiting approval from authorities",
  [RRStatus.APPROVED]: "R&R entitlements approved",
  [RRStatus.PROVISION_IN_PROGRESS]: "Providing R&R benefits to family",
  [RRStatus.FIELD_VERIFICATION]: "Field verification in progress",
  [RRStatus.COMPLETED]: "R&R case successfully completed",
  [RRStatus.DISPUTED]: "Case under dispute",
  [RRStatus.ON_HOLD]: "Case temporarily on hold",
};

// Entitlement statuses (from backend)
export enum EntitlementStatus {
  ASSESSED = "ASSESSED",
  APPROVED = "APPROVED",
  PROVIDED = "PROVIDED",
  VERIFIED = "VERIFIED",
  DISPUTED = "DISPUTED",
}

export const ENTITLEMENT_STATUS_LABELS: Record<EntitlementStatus, string> = {
  [EntitlementStatus.ASSESSED]: "Assessed",
  [EntitlementStatus.APPROVED]: "Approved",
  [EntitlementStatus.PROVIDED]: "Provided",
  [EntitlementStatus.VERIFIED]: "Verified",
  [EntitlementStatus.DISPUTED]: "Disputed",
};
