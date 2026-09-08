/**
 * Document Management Constants
 * Defines document types, statuses, access classes, and file validation
 */

// Document Status Enum
export enum DocumentStatus {
  ACTIVE = "ACTIVE",
  SUPERSEDED = "SUPERSEDED",
  ARCHIVED = "ARCHIVED",
}

// Document Access Class Enum
export enum DocumentAccessClass {
  PUBLIC = "PUBLIC",
  INTERNAL = "INTERNAL",
  RESTRICTED = "RESTRICTED",
  CONFIDENTIAL = "CONFIDENTIAL",
}

// Document Entity Types
export enum DocumentEntityType {
  PROJECT = "PROJECT",
  PARCEL = "PARCEL",
  CASE = "CASE",
  COMPENSATION = "COMPENSATION",
  PAYMENT = "PAYMENT",
  RR = "RR",
  POSSESSION = "POSSESSION",
  GRIEVANCE = "GRIEVANCE",
}

// Document Types
export const DOCUMENT_TYPES = {
  // Legal Documents
  LAND_TITLE: "LAND_TITLE",
  SALE_DEED: "SALE_DEED",
  MUTATION_RECORD: "MUTATION_RECORD",
  ENCUMBRANCE_CERTIFICATE: "ENCUMBRANCE_CERTIFICATE",
  NOC: "NOC",
  
  // Identity Documents
  AADHAAR: "AADHAAR",
  PAN: "PAN",
  VOTER_ID: "VOTER_ID",
  RATION_CARD: "RATION_CARD",
  
  // Financial Documents
  PAYMENT_RECEIPT: "PAYMENT_RECEIPT",
  BANK_STATEMENT: "BANK_STATEMENT",
  VALUATION_REPORT: "VALUATION_REPORT",
  
  // Verification Documents
  FIELD_PHOTO: "FIELD_PHOTO",
  SURVEY_MAP: "SURVEY_MAP",
  BOUNDARY_VERIFICATION: "BOUNDARY_VERIFICATION",
  
  // Notices & Legal
  ACQUISITION_NOTICE: "ACQUISITION_NOTICE",
  POSSESSION_NOTICE: "POSSESSION_NOTICE",
  HEARING_NOTICE: "HEARING_NOTICE",
  AWARD_DOCUMENT: "AWARD_DOCUMENT",
  
  // Other
  OTHER: "OTHER",
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

// Human-readable labels
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.ACTIVE]: "Active",
  [DocumentStatus.SUPERSEDED]: "Superseded",
  [DocumentStatus.ARCHIVED]: "Archived",
};

export const DOCUMENT_ACCESS_LABELS: Record<DocumentAccessClass, string> = {
  [DocumentAccessClass.PUBLIC]: "Public",
  [DocumentAccessClass.INTERNAL]: "Internal",
  [DocumentAccessClass.RESTRICTED]: "Restricted",
  [DocumentAccessClass.CONFIDENTIAL]: "Confidential",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  [DOCUMENT_TYPES.LAND_TITLE]: "Land Title",
  [DOCUMENT_TYPES.SALE_DEED]: "Sale Deed",
  [DOCUMENT_TYPES.MUTATION_RECORD]: "Mutation Record",
  [DOCUMENT_TYPES.ENCUMBRANCE_CERTIFICATE]: "Encumbrance Certificate",
  [DOCUMENT_TYPES.NOC]: "No Objection Certificate",
  
  [DOCUMENT_TYPES.AADHAAR]: "Aadhaar Card",
  [DOCUMENT_TYPES.PAN]: "PAN Card",
  [DOCUMENT_TYPES.VOTER_ID]: "Voter ID",
  [DOCUMENT_TYPES.RATION_CARD]: "Ration Card",
  
  [DOCUMENT_TYPES.PAYMENT_RECEIPT]: "Payment Receipt",
  [DOCUMENT_TYPES.BANK_STATEMENT]: "Bank Statement",
  [DOCUMENT_TYPES.VALUATION_REPORT]: "Valuation Report",
  
  [DOCUMENT_TYPES.FIELD_PHOTO]: "Field Photograph",
  [DOCUMENT_TYPES.SURVEY_MAP]: "Survey Map",
  [DOCUMENT_TYPES.BOUNDARY_VERIFICATION]: "Boundary Verification",
  
  [DOCUMENT_TYPES.ACQUISITION_NOTICE]: "Acquisition Notice",
  [DOCUMENT_TYPES.POSSESSION_NOTICE]: "Possession Notice",
  [DOCUMENT_TYPES.HEARING_NOTICE]: "Hearing Notice",
  [DOCUMENT_TYPES.AWARD_DOCUMENT]: "Award Document",
  
  [DOCUMENT_TYPES.OTHER]: "Other",
};

export const ENTITY_TYPE_LABELS: Record<DocumentEntityType, string> = {
  [DocumentEntityType.PROJECT]: "Project",
  [DocumentEntityType.PARCEL]: "Parcel",
  [DocumentEntityType.CASE]: "Acquisition Case",
  [DocumentEntityType.COMPENSATION]: "Compensation",
  [DocumentEntityType.PAYMENT]: "Payment",
  [DocumentEntityType.RR]: "R&R",
  [DocumentEntityType.POSSESSION]: "Possession",
  [DocumentEntityType.GRIEVANCE]: "Grievance",
};

// Status descriptions
export const DOCUMENT_STATUS_DESCRIPTIONS: Record<DocumentStatus, string> = {
  [DocumentStatus.ACTIVE]:
    "Current active version of the document",
  [DocumentStatus.SUPERSEDED]:
    "Replaced by a newer version",
  [DocumentStatus.ARCHIVED]:
    "Archived and no longer in active use",
};

// Status colors (Tailwind CSS classes)
export const DOCUMENT_STATUS_COLORS: Record<
  DocumentStatus,
  { bg: string; text: string; border: string }
> = {
  [DocumentStatus.ACTIVE]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  [DocumentStatus.SUPERSEDED]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  [DocumentStatus.ARCHIVED]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
};

export const ACCESS_CLASS_COLORS: Record<
  DocumentAccessClass,
  { bg: string; text: string; border: string }
> = {
  [DocumentAccessClass.PUBLIC]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  [DocumentAccessClass.INTERNAL]: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  [DocumentAccessClass.RESTRICTED]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  [DocumentAccessClass.CONFIDENTIAL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
};

// File validation rules
export const FILE_VALIDATION = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    
    // Spreadsheets
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ALLOWED_EXTENSIONS: [
    ".pdf",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".xls",
    ".xlsx",
  ],
};

// MIME type to file extension mapping
export const MIME_TO_EXTENSION: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

// Helper: Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

// Helper: Validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(FILE_VALIDATION.MAX_SIZE)} limit`,
    };
  }

  if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File type not supported. Please upload PDF, Word, Excel, or image files.",
    };
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!FILE_VALIDATION.ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} not allowed`,
    };
  }

  return { valid: true };
}

// Helper: Get file icon based on MIME type
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType === "application/pdf") return "FileText";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document")
  )
    return "FileText";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "Table";
  return "File";
}

// Helper: Check if file is previewable
export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf"
  );
}

// Permission mappings
export const DOCUMENT_PERMISSIONS = {
  VIEW: "document:view",
  UPLOAD: "document:upload",
  DELETE: "document:delete",
} as const;
