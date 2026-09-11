/**
 * Role constants matching backend
 * Source: backend/src/constants/roles.ts
 */

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  CENTRAL_MINISTRY = "CENTRAL_MINISTRY",
  STATE_ADMIN = "STATE_ADMIN",
  DISTRICT_ADMIN = "DISTRICT_ADMIN",
  LAND_ACQUISITION_OFFICER = "LAND_ACQUISITION_OFFICER",
  PROJECT_IMPLEMENTING_AGENCY = "PROJECT_IMPLEMENTING_AGENCY",
  FIELD_VERIFIER = "FIELD_VERIFIER",
  FINANCE_OFFICER = "FINANCE_OFFICER",
  RR_OFFICER = "RR_OFFICER",
  GIS_OFFICER = "GIS_OFFICER",
  REVIEWER = "REVIEWER",
  EXECUTIVE_VIEWER = "EXECUTIVE_VIEWER",
  CITIZEN = "CITIZEN",
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Full system access",
  [Role.CENTRAL_MINISTRY]: "Central government ministry access",
  [Role.STATE_ADMIN]: "State-level administration",
  [Role.DISTRICT_ADMIN]: "District-level administration",
  [Role.LAND_ACQUISITION_OFFICER]: "Land acquisition operations",
  [Role.PROJECT_IMPLEMENTING_AGENCY]: "Project implementation and management",
  [Role.FIELD_VERIFIER]: "Field verification operations",
  [Role.FINANCE_OFFICER]: "Financial operations and payments",
  [Role.RR_OFFICER]: "Rehabilitation and resettlement",
  [Role.GIS_OFFICER]: "GIS and mapping operations",
  [Role.REVIEWER]: "Review and approval operations",
  [Role.EXECUTIVE_VIEWER]: "Executive dashboard and reports access",
  [Role.CITIZEN]: "Public access",
};

/**
 * Role color mapping for UI badges
 */
export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  [Role.SUPER_ADMIN]: {
    bg: "bg-clay-100",
    text: "text-clay-700",
    border: "border-clay-200",
  },
  [Role.CENTRAL_MINISTRY]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [Role.STATE_ADMIN]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [Role.DISTRICT_ADMIN]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [Role.LAND_ACQUISITION_OFFICER]: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  [Role.PROJECT_IMPLEMENTING_AGENCY]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [Role.FIELD_VERIFIER]: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  [Role.FINANCE_OFFICER]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [Role.RR_OFFICER]: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  [Role.GIS_OFFICER]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  [Role.REVIEWER]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  [Role.EXECUTIVE_VIEWER]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  [Role.CITIZEN]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};
