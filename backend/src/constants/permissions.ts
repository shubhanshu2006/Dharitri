export enum Permission {
  PROJECT_CREATE = "PROJECT_CREATE",
  PROJECT_VIEW = "PROJECT_VIEW",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  PROJECT_DELETE = "PROJECT_DELETE",
  PROJECT_APPROVE = "PROJECT_APPROVE",
  PROJECT_SUBMIT = "PROJECT_SUBMIT",
  PROJECT_HOLD = "PROJECT_HOLD",
  PROJECT_COMPLETE = "PROJECT_COMPLETE",

  PARCEL_VIEW = "PARCEL_VIEW",
  PARCEL_CREATE = "PARCEL_CREATE",
  PARCEL_UPDATE = "PARCEL_UPDATE",
  PARCEL_DELETE = "PARCEL_DELETE",
  PARCEL_SYNC = "PARCEL_SYNC",

  VERIFICATION_CREATE = "VERIFICATION_CREATE",
  VERIFICATION_VIEW = "VERIFICATION_VIEW",
  VERIFICATION_RUN = "VERIFICATION_RUN",
  VERIFICATION_APPROVE = "VERIFICATION_APPROVE",
  VERIFICATION_REQUEST_CORRECTION = "VERIFICATION_REQUEST_CORRECTION",

  ACQUISITION_CREATE = "ACQUISITION_CREATE",
  ACQUISITION_VIEW = "ACQUISITION_VIEW",
  ACQUISITION_UPDATE = "ACQUISITION_UPDATE",
  ACQUISITION_TRANSITION = "ACQUISITION_TRANSITION",

  COMPENSATION_CREATE = "COMPENSATION_CREATE",
  COMPENSATION_VIEW = "COMPENSATION_VIEW",
  COMPENSATION_UPDATE = "COMPENSATION_UPDATE",
  COMPENSATION_SUBMIT = "COMPENSATION_SUBMIT",
  COMPENSATION_APPROVE = "COMPENSATION_APPROVE",
  COMPENSATION_REJECT = "COMPENSATION_REJECT",

  PAYMENT_INITIATE = "PAYMENT_INITIATE",
  PAYMENT_VIEW = "PAYMENT_VIEW",
  PAYMENT_SYNC = "PAYMENT_SYNC",

  BENEFICIARY_CREATE = "BENEFICIARY_CREATE",
  BENEFICIARY_VIEW = "BENEFICIARY_VIEW",
  BENEFICIARY_UPDATE = "BENEFICIARY_UPDATE",
  BENEFICIARY_VERIFY = "BENEFICIARY_VERIFY",

  RR_CREATE = "RR_CREATE",
  RR_VIEW = "RR_VIEW",
  RR_UPDATE = "RR_UPDATE",
  RR_APPROVE = "RR_APPROVE",
  RR_COMPLETE = "RR_COMPLETE",

  POSSESSION_VIEW = "POSSESSION_VIEW",
  POSSESSION_RECORD = "POSSESSION_RECORD",
  POSSESSION_UPDATE = "POSSESSION_UPDATE",

  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
  DOCUMENT_VIEW = "DOCUMENT_VIEW",
  DOCUMENT_DELETE = "DOCUMENT_DELETE",

  FIELD_VISIT_CREATE = "FIELD_VISIT_CREATE",
  FIELD_VISIT_VIEW = "FIELD_VISIT_VIEW",
  FIELD_VISIT_SUBMIT = "FIELD_VISIT_SUBMIT",

  GIS_VIEW = "GIS_VIEW",
  GIS_UPDATE = "GIS_UPDATE",
  GIS_ADMIN = "GIS_ADMIN",

  CASE_ROUTE = "CASE_ROUTE",
  CASE_ASSIGN = "CASE_ASSIGN",

  DASHBOARD_VIEW = "DASHBOARD_VIEW",
  ANALYTICS_VIEW = "ANALYTICS_VIEW",

  USER_MANAGE = "USER_MANAGE",
  ROLE_MANAGE = "ROLE_MANAGE",
  PERMISSION_MANAGE = "PERMISSION_MANAGE",

  AUDIT_VIEW = "AUDIT_VIEW",

  NOTIFICATION_SEND = "NOTIFICATION_SEND",
  NOTIFICATION_VIEW = "NOTIFICATION_VIEW",

  GRIEVANCE_CREATE = "GRIEVANCE_CREATE",
  GRIEVANCE_VIEW = "GRIEVANCE_VIEW",
  GRIEVANCE_RESOLVE = "GRIEVANCE_RESOLVE",
}

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.PROJECT_CREATE]: "Create new projects",
  [Permission.PROJECT_VIEW]: "View projects",
  [Permission.PROJECT_UPDATE]: "Update project details",
  [Permission.PROJECT_DELETE]: "Delete projects",
  [Permission.PROJECT_APPROVE]: "Approve projects",
  [Permission.PROJECT_SUBMIT]: "Submit projects for review",
  [Permission.PROJECT_HOLD]: "Put projects on hold",
  [Permission.PROJECT_COMPLETE]: "Mark projects as complete",

  [Permission.PARCEL_VIEW]: "View land parcels",
  [Permission.PARCEL_CREATE]: "Create land parcels",
  [Permission.PARCEL_UPDATE]: "Update parcel information",
  [Permission.PARCEL_DELETE]: "Delete parcels",
  [Permission.PARCEL_SYNC]: "Sync parcel data from external sources",

  [Permission.VERIFICATION_CREATE]: "Create verification cases",
  [Permission.VERIFICATION_VIEW]: "View verification cases",
  [Permission.VERIFICATION_RUN]: "Run verification checks",
  [Permission.VERIFICATION_APPROVE]: "Approve verification results",
  [Permission.VERIFICATION_REQUEST_CORRECTION]:
    "Request verification corrections",

  [Permission.ACQUISITION_CREATE]: "Create acquisition cases",
  [Permission.ACQUISITION_VIEW]: "View acquisition cases",
  [Permission.ACQUISITION_UPDATE]: "Update acquisition information",
  [Permission.ACQUISITION_TRANSITION]: "Transition acquisition status",

  [Permission.COMPENSATION_CREATE]: "Create compensation assessments",
  [Permission.COMPENSATION_VIEW]: "View compensation details",
  [Permission.COMPENSATION_UPDATE]: "Update compensation assessments",
  [Permission.COMPENSATION_SUBMIT]: "Submit compensation for approval",
  [Permission.COMPENSATION_APPROVE]: "Approve compensation",
  [Permission.COMPENSATION_REJECT]: "Reject compensation",

  [Permission.PAYMENT_INITIATE]: "Initiate payments",
  [Permission.PAYMENT_VIEW]: "View payment information",
  [Permission.PAYMENT_SYNC]: "Sync payment status",

  [Permission.BENEFICIARY_CREATE]: "Create beneficiary records",
  [Permission.BENEFICIARY_VIEW]: "View beneficiary information",
  [Permission.BENEFICIARY_UPDATE]: "Update beneficiary details",
  [Permission.BENEFICIARY_VERIFY]: "Verify beneficiary identity",

  [Permission.RR_CREATE]: "Create R&R cases",
  [Permission.RR_VIEW]: "View R&R information",
  [Permission.RR_UPDATE]: "Update R&R cases",
  [Permission.RR_APPROVE]: "Approve R&R entitlements",
  [Permission.RR_COMPLETE]: "Mark R&R as complete",

  [Permission.POSSESSION_VIEW]: "View possession records",
  [Permission.POSSESSION_RECORD]: "Record possession",
  [Permission.POSSESSION_UPDATE]: "Update possession information",

  [Permission.DOCUMENT_UPLOAD]: "Upload documents",
  [Permission.DOCUMENT_VIEW]: "View documents",
  [Permission.DOCUMENT_DELETE]: "Delete documents",

  [Permission.FIELD_VISIT_CREATE]: "Create field visits",
  [Permission.FIELD_VISIT_VIEW]: "View field visits",
  [Permission.FIELD_VISIT_SUBMIT]: "Submit field visit reports",

  [Permission.GIS_VIEW]: "View GIS maps",
  [Permission.GIS_UPDATE]: "Update GIS data",
  [Permission.GIS_ADMIN]: "Administer GIS system",

  [Permission.CASE_ROUTE]: "Route cases to officers",
  [Permission.CASE_ASSIGN]: "Assign cases",

  [Permission.DASHBOARD_VIEW]: "View dashboards",
  [Permission.ANALYTICS_VIEW]: "View analytics",

  [Permission.USER_MANAGE]: "Manage users",
  [Permission.ROLE_MANAGE]: "Manage roles",
  [Permission.PERMISSION_MANAGE]: "Manage permissions",

  [Permission.AUDIT_VIEW]: "View audit logs",

  [Permission.NOTIFICATION_SEND]: "Send notifications",
  [Permission.NOTIFICATION_VIEW]: "View notifications",

  [Permission.GRIEVANCE_CREATE]: "Create grievances",
  [Permission.GRIEVANCE_VIEW]: "View grievances",
  [Permission.GRIEVANCE_RESOLVE]: "Resolve grievances",
};
