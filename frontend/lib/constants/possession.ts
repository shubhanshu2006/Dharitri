/**
 * Possession Management Constants
 * Defines statuses, labels, colors, and workflows for possession recording
 */

// Possession Status Enum
export enum PossessionStatus {
  PENDING = "PENDING",
  NOTICE_ISSUED = "NOTICE_ISSUED",
  READY = "READY",
  RECORDED = "RECORDED",
}

// Checklist Item Status Enum
export enum ChecklistItemStatus {
  PENDING = "PENDING",
  PASS = "PASS",
  FAIL = "FAIL",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

// Human-readable labels
export const POSSESSION_STATUS_LABELS: Record<PossessionStatus, string> = {
  [PossessionStatus.PENDING]: "Pending",
  [PossessionStatus.NOTICE_ISSUED]: "Notice Issued",
  [PossessionStatus.READY]: "Ready for Possession",
  [PossessionStatus.RECORDED]: "Possession Recorded",
};

export const CHECKLIST_STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  [ChecklistItemStatus.PENDING]: "Pending",
  [ChecklistItemStatus.PASS]: "Pass",
  [ChecklistItemStatus.FAIL]: "Fail",
  [ChecklistItemStatus.NOT_APPLICABLE]: "N/A",
};

// Status descriptions
export const POSSESSION_STATUS_DESCRIPTIONS: Record<PossessionStatus, string> = {
  [PossessionStatus.PENDING]:
    "Possession process has not yet started. Awaiting initiation.",
  [PossessionStatus.NOTICE_ISSUED]:
    "Possession notice has been issued. Checklist verification in progress.",
  [PossessionStatus.READY]:
    "All prerequisites completed. Ready for possession recording.",
  [PossessionStatus.RECORDED]:
    "Physical possession has been recorded with evidence and documentation.",
};

// Status colors (Tailwind CSS classes)
export const POSSESSION_STATUS_COLORS: Record<
  PossessionStatus,
  { bg: string; text: string; border: string }
> = {
  [PossessionStatus.PENDING]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  [PossessionStatus.NOTICE_ISSUED]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  [PossessionStatus.READY]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  [PossessionStatus.RECORDED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
};

export const CHECKLIST_STATUS_COLORS: Record<
  ChecklistItemStatus,
  { bg: string; text: string; border: string }
> = {
  [ChecklistItemStatus.PENDING]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  [ChecklistItemStatus.PASS]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  [ChecklistItemStatus.FAIL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  [ChecklistItemStatus.NOT_APPLICABLE]: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};

// Status transitions (workflow)
export const POSSESSION_STATUS_TRANSITIONS: Record<
  PossessionStatus,
  PossessionStatus[]
> = {
  [PossessionStatus.PENDING]: [PossessionStatus.NOTICE_ISSUED],
  [PossessionStatus.NOTICE_ISSUED]: [PossessionStatus.READY],
  [PossessionStatus.READY]: [PossessionStatus.RECORDED],
  [PossessionStatus.RECORDED]: [], // Terminal state
};

// Status icons (using Lucide icon names)
export const POSSESSION_STATUS_ICONS: Record<PossessionStatus, string> = {
  [PossessionStatus.PENDING]: "Clock",
  [PossessionStatus.NOTICE_ISSUED]: "Bell",
  [PossessionStatus.READY]: "CheckCircle",
  [PossessionStatus.RECORDED]: "CheckCheck",
};

// Default checklist items (initialized by backend)
export const DEFAULT_CHECKLIST_ITEMS = [
  "Physical boundary verification",
  "Clear encumbrance check",
  "No unauthorized occupation",
  "Documentation verification",
  "Photographic evidence captured",
];

// Permission mappings
export const POSSESSION_PERMISSIONS = {
  VIEW: "possession:view",
  UPDATE: "possession:update",
  RECORD: "possession:record",
} as const;

// Filter options for status
export const POSSESSION_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: PossessionStatus.PENDING, label: POSSESSION_STATUS_LABELS[PossessionStatus.PENDING] },
  { value: PossessionStatus.NOTICE_ISSUED, label: POSSESSION_STATUS_LABELS[PossessionStatus.NOTICE_ISSUED] },
  { value: PossessionStatus.READY, label: POSSESSION_STATUS_LABELS[PossessionStatus.READY] },
  { value: PossessionStatus.RECORDED, label: POSSESSION_STATUS_LABELS[PossessionStatus.RECORDED] },
];

// Helper: Check if possession can be recorded
export function canRecordPossession(status: PossessionStatus): boolean {
  return status === PossessionStatus.READY;
}

// Helper: Check if notice can be issued
export function canIssueNotice(status: PossessionStatus): boolean {
  return status === PossessionStatus.PENDING;
}

// Helper: Check if can mark ready
export function canMarkReady(status: PossessionStatus): boolean {
  return status === PossessionStatus.NOTICE_ISSUED;
}

// Helper: Get next possible statuses
export function getNextStatuses(currentStatus: PossessionStatus): PossessionStatus[] {
  return POSSESSION_STATUS_TRANSITIONS[currentStatus] || [];
}
