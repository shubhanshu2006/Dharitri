/**
 * Project-related constants
 */

export enum ProjectStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: "Draft",
  [ProjectStatus.SUBMITTED]: "Submitted",
  [ProjectStatus.UNDER_REVIEW]: "Under Review",
  [ProjectStatus.APPROVED]: "Approved",
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.ON_HOLD]: "On Hold",
  [ProjectStatus.COMPLETED]: "Completed",
  [ProjectStatus.CANCELLED]: "Cancelled",
};

export const PROJECT_STATUS_COLORS: Record<
  ProjectStatus,
  { bg: string; text: string; border: string }
> = {
  [ProjectStatus.DRAFT]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [ProjectStatus.SUBMITTED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [ProjectStatus.UNDER_REVIEW]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [ProjectStatus.APPROVED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ProjectStatus.IN_PROGRESS]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ProjectStatus.ON_HOLD]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  [ProjectStatus.COMPLETED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [ProjectStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export enum ProjectType {
  HIGHWAY = "HIGHWAY",
  RAILWAY = "RAILWAY",
  INDUSTRIAL_CORRIDOR = "INDUSTRIAL_CORRIDOR",
  IRRIGATION = "IRRIGATION",
  URBAN_DEVELOPMENT = "URBAN_DEVELOPMENT",
  RENEWABLE_ENERGY = "RENEWABLE_ENERGY",
  STRATEGIC_INFRASTRUCTURE = "STRATEGIC_INFRASTRUCTURE",
  OTHER = "OTHER",
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [ProjectType.HIGHWAY]: "Highway",
  [ProjectType.RAILWAY]: "Railway",
  [ProjectType.INDUSTRIAL_CORRIDOR]: "Industrial Corridor",
  [ProjectType.IRRIGATION]: "Irrigation",
  [ProjectType.URBAN_DEVELOPMENT]: "Urban Development",
  [ProjectType.RENEWABLE_ENERGY]: "Renewable Energy",
  [ProjectType.STRATEGIC_INFRASTRUCTURE]: "Strategic Infrastructure",
  [ProjectType.OTHER]: "Other",
};

export enum LandRequirementUnit {
  HECTARE = "hectare",
  ACRE = "acre",
  SQM = "sqm",
}

export const LAND_UNIT_LABELS: Record<LandRequirementUnit, string> = {
  [LandRequirementUnit.HECTARE]: "Hectares",
  [LandRequirementUnit.ACRE]: "Acres",
  [LandRequirementUnit.SQM]: "Square Meters",
};
