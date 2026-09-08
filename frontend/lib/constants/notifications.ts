// Notification Constants and Types

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

export enum NotificationType {
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_APPROVED = "PROJECT_APPROVED",
  PROJECT_COMPLETED = "PROJECT_COMPLETED",
  PARCEL_VERIFIED = "PARCEL_VERIFIED",
  COMPENSATION_ASSESSED = "COMPENSATION_ASSESSED",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  RR_CASE_ASSIGNED = "RR_CASE_ASSIGNED",
  POSSESSION_RECORDED = "POSSESSION_RECORDED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  FIELD_VISIT_ASSIGNED = "FIELD_VISIT_ASSIGNED",
  GRIEVANCE_SUBMITTED = "GRIEVANCE_SUBMITTED",
  ALERT_CRITICAL = "ALERT_CRITICAL",
  ALERT_WARNING = "ALERT_WARNING",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  status: NotificationStatus;
  readAt?: string;
  createdAt: string;
}

export interface NotificationQuery {
  status?: NotificationStatus;
  type?: string;
  limit?: number;
  offset?: number;
}

// Notification type configuration
export const NOTIFICATION_CONFIG = {
  [NotificationType.PROJECT_CREATED]: {
    icon: "Building2",
    color: "blue",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    iconClass: "text-blue-600",
  },
  [NotificationType.PROJECT_APPROVED]: {
    icon: "CheckCircle",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
  },
  [NotificationType.PROJECT_COMPLETED]: {
    icon: "FlagTriangleRight",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
  },
  [NotificationType.PARCEL_VERIFIED]: {
    icon: "MapPin",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
  },
  [NotificationType.COMPENSATION_ASSESSED]: {
    icon: "DollarSign",
    color: "amber",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    iconClass: "text-amber-600",
  },
  [NotificationType.PAYMENT_INITIATED]: {
    icon: "Send",
    color: "blue",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    iconClass: "text-blue-600",
  },
  [NotificationType.PAYMENT_COMPLETED]: {
    icon: "CheckCircle",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
  },
  [NotificationType.PAYMENT_FAILED]: {
    icon: "XCircle",
    color: "red",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    iconClass: "text-red-600",
  },
  [NotificationType.RR_CASE_ASSIGNED]: {
    icon: "Users",
    color: "blue",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    iconClass: "text-blue-600",
  },
  [NotificationType.POSSESSION_RECORDED]: {
    icon: "Home",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
  },
  [NotificationType.DOCUMENT_UPLOADED]: {
    icon: "FileText",
    color: "blue",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    iconClass: "text-blue-600",
  },
  [NotificationType.FIELD_VISIT_ASSIGNED]: {
    icon: "MapPin",
    color: "purple",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700",
    iconClass: "text-purple-600",
  },
  [NotificationType.GRIEVANCE_SUBMITTED]: {
    icon: "AlertCircle",
    color: "amber",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    iconClass: "text-amber-600",
  },
  [NotificationType.ALERT_CRITICAL]: {
    icon: "AlertTriangle",
    color: "red",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    iconClass: "text-red-600",
  },
  [NotificationType.ALERT_WARNING]: {
    icon: "AlertTriangle",
    color: "amber",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    iconClass: "text-amber-600",
  },
  [NotificationType.SYSTEM_ANNOUNCEMENT]: {
    icon: "Megaphone",
    color: "blue",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    iconClass: "text-blue-600",
  },
} as const;

// Helper functions
export function getNotificationConfig(type: string) {
  return (
    NOTIFICATION_CONFIG[type as NotificationType] ||
    NOTIFICATION_CONFIG[NotificationType.SYSTEM_ANNOUNCEMENT]
  );
}

export function getEntityNavigationUrl(
  entityType?: string,
  entityId?: string
): string | null {
  if (!entityType || !entityId) return null;

  const routes: Record<string, string> = {
    PROJECT: `/dashboard/projects/${entityId}`,
    PARCEL: `/dashboard/parcels/${entityId}`,
    CASE: `/dashboard/acquisition/${entityId}`,
    COMPENSATION: `/dashboard/compensation/${entityId}`,
    PAYMENT: `/dashboard/compensation/${entityId}`, // Payment is part of compensation
    RR_CASE: `/dashboard/rr/${entityId}`,
    POSSESSION: `/dashboard/possession/${entityId}`,
    DOCUMENT: `/dashboard/documents/${entityId}`,
    FIELD_VISIT: `/dashboard/field/${entityId}`,
    GRIEVANCE: `/dashboard/grievances/${entityId}`,
  };

  return routes[entityType] || null;
}

export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
