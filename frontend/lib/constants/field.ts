/**
 * Field Verification Constants
 * Mobile-first field verification statuses, evidence types, and helpers
 */

// Field Visit Status Enum
export enum FieldVisitStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  VERIFIED = "VERIFIED",
  CORRECTION_REQUIRED = "CORRECTION_REQUIRED",
}

// Checklist Item Status Enum
export enum FieldChecklistStatus {
  PENDING = "PENDING",
  PASS = "PASS",
  FAIL = "FAIL",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

// Evidence Type Enum
export enum EvidenceType {
  BOUNDARY_PHOTO = "BOUNDARY_PHOTO",
  STRUCTURE_PHOTO = "STRUCTURE_PHOTO",
  OCCUPANCY_PHOTO = "OCCUPANCY_PHOTO",
  DOCUMENT_SCAN = "DOCUMENT_SCAN",
  GENERAL_PHOTO = "GENERAL_PHOTO",
}

// Human-readable labels
export const FIELD_STATUS_LABELS: Record<FieldVisitStatus, string> = {
  [FieldVisitStatus.DRAFT]: "Draft",
  [FieldVisitStatus.IN_PROGRESS]: "In Progress",
  [FieldVisitStatus.SUBMITTED]: "Submitted",
  [FieldVisitStatus.VERIFIED]: "Verified",
  [FieldVisitStatus.CORRECTION_REQUIRED]: "Correction Required",
};

export const CHECKLIST_STATUS_LABELS: Record<FieldChecklistStatus, string> = {
  [FieldChecklistStatus.PENDING]: "Pending",
  [FieldChecklistStatus.PASS]: "Pass",
  [FieldChecklistStatus.FAIL]: "Fail",
  [FieldChecklistStatus.NOT_APPLICABLE]: "N/A",
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  [EvidenceType.BOUNDARY_PHOTO]: "Boundary Photo",
  [EvidenceType.STRUCTURE_PHOTO]: "Structure Photo",
  [EvidenceType.OCCUPANCY_PHOTO]: "Occupancy Photo",
  [EvidenceType.DOCUMENT_SCAN]: "Document Scan",
  [EvidenceType.GENERAL_PHOTO]: "General Photo",
};

// Status descriptions
export const FIELD_STATUS_DESCRIPTIONS: Record<FieldVisitStatus, string> = {
  [FieldVisitStatus.DRAFT]:
    "Field visit created but not yet started",
  [FieldVisitStatus.IN_PROGRESS]:
    "Field verification is currently in progress",
  [FieldVisitStatus.SUBMITTED]:
    "Field visit submitted for review",
  [FieldVisitStatus.VERIFIED]:
    "Field visit verified and approved",
  [FieldVisitStatus.CORRECTION_REQUIRED]:
    "Corrections needed - please review feedback",
};

// Status colors (Tailwind CSS classes) - optimized for mobile
export const FIELD_STATUS_COLORS: Record<
  FieldVisitStatus,
  { bg: string; text: string; border: string }
> = {
  [FieldVisitStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  [FieldVisitStatus.IN_PROGRESS]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  [FieldVisitStatus.SUBMITTED]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  [FieldVisitStatus.VERIFIED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  [FieldVisitStatus.CORRECTION_REQUIRED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
};

export const CHECKLIST_STATUS_COLORS: Record<
  FieldChecklistStatus,
  { bg: string; text: string; border: string }
> = {
  [FieldChecklistStatus.PENDING]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  [FieldChecklistStatus.PASS]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  [FieldChecklistStatus.FAIL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  [FieldChecklistStatus.NOT_APPLICABLE]: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};

// GPS Accuracy thresholds (in meters)
export const GPS_ACCURACY = {
  EXCELLENT: 5,
  GOOD: 10,
  FAIR: 20,
  POOR: 50,
} as const;

// Helper: Get GPS accuracy label
export function getGPSAccuracyLabel(accuracyMeters: number | undefined): string {
  if (!accuracyMeters) return "Unknown";
  if (accuracyMeters <= GPS_ACCURACY.EXCELLENT) return "Excellent";
  if (accuracyMeters <= GPS_ACCURACY.GOOD) return "Good";
  if (accuracyMeters <= GPS_ACCURACY.FAIR) return "Fair";
  if (accuracyMeters <= GPS_ACCURACY.POOR) return "Poor";
  return "Very Poor";
}

// Helper: Get GPS accuracy color
export function getGPSAccuracyColor(accuracyMeters: number | undefined): string {
  if (!accuracyMeters) return "text-gray-500";
  if (accuracyMeters <= GPS_ACCURACY.EXCELLENT) return "text-emerald-600";
  if (accuracyMeters <= GPS_ACCURACY.GOOD) return "text-blue-600";
  if (accuracyMeters <= GPS_ACCURACY.FAIR) return "text-amber-600";
  return "text-red-600";
}

// Helper: Check if field visit can be submitted
export function canSubmitFieldVisit(
  checklistItems: any[],
  evidenceCount: number,
  hasGPS: boolean
): { can: boolean; reason?: string } {
  if (!hasGPS) {
    return { can: false, reason: "GPS location required" };
  }

  const completedItems = checklistItems.filter(
    (item) =>
      item.status === FieldChecklistStatus.PASS ||
      item.status === FieldChecklistStatus.NOT_APPLICABLE
  ).length;

  if (completedItems < checklistItems.length) {
    return {
      can: false,
      reason: `Complete all checklist items (${completedItems}/${checklistItems.length})`,
    };
  }

  if (evidenceCount === 0) {
    return { can: false, reason: "At least one photo required" };
  }

  return { can: true };
}

// Default checklist items (initialized by backend)
export const DEFAULT_FIELD_CHECKLIST = [
  "Physical boundary verification",
  "Structure occupancy check",
  "Clear encumbrance verification",
  "Access road availability",
  "Photographic evidence captured",
];

// Permission mappings
export const FIELD_PERMISSIONS = {
  VIEW: "field:view",
  CREATE: "field:create",
  VERIFY: "field:verify",
} as const;

// Mobile-specific settings
export const MOBILE_SETTINGS = {
  // Large touch targets (minimum 44px as per iOS HIG)
  MIN_TOUCH_TARGET: 44,
  
  // Photo compression settings
  PHOTO_MAX_WIDTH: 1920,
  PHOTO_MAX_HEIGHT: 1080,
  PHOTO_QUALITY: 0.85,
  
  // GPS timeout
  GPS_TIMEOUT: 10000, // 10 seconds
  
  // Offline queue limits
  MAX_OFFLINE_PHOTOS: 50,
  MAX_OFFLINE_VISITS: 20,
} as const;
