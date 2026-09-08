"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Filter,
  CheckCheck,
  Settings,
  Building2,
  CheckCircle,
  FlagTriangleRight,
  MapPin,
  DollarSign,
  Send,
  XCircle,
  Users,
  Home,
  FileText,
  AlertCircle,
  AlertTriangle,
  Megaphone,
} from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/useNotifications";
import {
  NotificationStatus,
  NotificationType,
  getNotificationConfig,
  getEntityNavigationUrl,
  formatNotificationTime,
} from "@/lib/constants/notifications";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const iconMap = {
  Building2,
  CheckCircle,
  FlagTriangleRight,
  MapPin,
  DollarSign,
  Send,
  XCircle,
  Users,
  Home,
  FileText,
  AlertCircle,
  AlertTriangle,
  Megaphone,
};

export default function NotificationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<
    NotificationStatus | "ALL"
  >("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const queryParams =
    statusFilter === "ALL" ? undefined : { status: statusFilter };
  const { data, isLoading, refetch } = useNotifications(queryParams);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  // Filter by type in frontend (backend doesn't support type filter in this example)
  const filteredNotifications =
    typeFilter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === typeFilter);

  const handleNotificationClick = async (
    notificationId: string,
    entityType?: string,
    entityId?: string,
    isRead?: boolean
  ) => {
    // Mark as read if not already
    if (!isRead) {
      await markAsRead.mutateAsync(notificationId);
    }

    // Navigate to entity if available
    const url = getEntityNavigationUrl(entityType, entityId);
    if (url) {
      router.push(url);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with all your project activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/notifications/preferences")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} disabled={markAllAsRead.isPending}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex gap-1">
              {(["ALL", NotificationStatus.READ, "UNREAD"] as const).map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "primary" : "ghost"}
                    size="sm"
                    onClick={() =>
                      setStatusFilter(
                        status === "UNREAD"
                          ? (undefined as any)
                          : (status as NotificationStatus | "ALL")
                      )
                    }
                    className="text-xs"
                  >
                    {status === "UNREAD" ? "Unread" : status}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value={NotificationType.PROJECT_CREATED}>
                Projects
              </option>
              <option value={NotificationType.PAYMENT_COMPLETED}>
                Payments
              </option>
              <option value={NotificationType.DOCUMENT_UPLOADED}>
                Documents
              </option>
              <option value={NotificationType.FIELD_VISIT_ASSIGNED}>
                Field Visits
              </option>
              <option value={NotificationType.ALERT_CRITICAL}>Alerts</option>
              <option value={NotificationType.SYSTEM_ANNOUNCEMENT}>
                System
              </option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="ml-auto"
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* Notification List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading notifications...
          </div>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "Try adjusting your filters to see more notifications"
                : "You're all caught up! Check back later for updates"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            const IconComponent =
              iconMap[config.icon as keyof typeof iconMap] || Bell;
            const isRead = notification.status === NotificationStatus.READ;

            return (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  !isRead && "bg-blue-50/30 border-blue-200"
                )}
                onClick={() =>
                  handleNotificationClick(
                    notification.id,
                    notification.entityType,
                    notification.entityId,
                    isRead
                  )
                }
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                        config.bgClass
                      )}
                    >
                      <IconComponent
                        className={cn("h-6 w-6", config.iconClass)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <h3
                            className={cn(
                              "font-semibold text-base",
                              isRead ? "text-gray-700" : "text-gray-900"
                            )}
                          >
                            {notification.title}
                          </h3>
                          {!isRead && (
                            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-sm mb-3",
                          isRead ? "text-gray-600" : "text-gray-700"
                        )}
                      >
                        {notification.message}
                      </p>
                      {notification.entityType && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">
                            Related to:
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {notification.entityType.replace(/_/g, " ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {filteredNotifications.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          Showing {filteredNotifications.length} notification
          {filteredNotifications.length !== 1 ? "s" : ""}
          {unreadCount > 0 && ` • ${unreadCount} unread`}
        </div>
      )}
    </div>
  );
}
