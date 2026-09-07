// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T = any> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
    requestId?: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error Codes
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID_STATE_TRANSITION"
  | "DUPLICATE_RESOURCE"
  | "INTEGRATION_ERROR"
  | "INTEGRATION_TIMEOUT"
  | "PAYMENT_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

// User Types
export interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  scope: {
    level: "NATIONAL" | "STATE" | "DISTRICT" | "PROJECT" | "ASSIGNED_CASE";
    stateId?: string;
    districtId?: string;
    projectId?: string;
  };
}

// Project Types
export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: string;
  ministry?: string;
  implementingAgency?: string;
  totalLandRequirement?: number;
  landRequirementUnit?: string;
  estimatedCost?: number;
  expectedStartDate?: string;
  expectedCompletionDate?: string;
  status: ProjectStatus;
  stateId?: string;
  districtId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

// Parcel Types
export interface Parcel {
  id: string;
  referenceId: string;
  surveyNumber?: string;
  ulpin?: string;
  area?: number;
  areaUnit?: string;
  landCategory?: string;
  villageId?: string;
  tehsilId?: string;
  districtId?: string;
  stateId?: string;
  status: ParcelStatus;
  verificationStatus?: string;
  acquisitionStatus?: string;
  compensationStatus?: string;
  paymentStatus?: string;
  rrStatus?: string;
  possessionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export type ParcelStatus =
  | "DRAFT"
  | "IDENTIFIED"
  | "VERIFIED"
  | "IN_ACQUISITION"
  | "ACQUIRED"
  | "DISPUTED"
  | "REJECTED";

// GeoJSON Types
export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}
