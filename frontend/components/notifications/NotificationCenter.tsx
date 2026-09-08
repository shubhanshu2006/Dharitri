"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
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
  getNotificationConfig,
  getEntityNavigationUrl,
  formatNotificationTime,
} from "@/lib/constants/notifications";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  onClose: () => void;
}

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

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const router = useRouter();
  const { data, isLoading } = useNotifications({ limit: 10 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data || [];

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
      onClose();
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markAllAsRead.isPending}
            className="text-sm"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-[480px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const config = getNotificationConfig(notification.type);
              const IconComponent =
                iconMap[config.icon as keyof typeof iconMap] || Bell;
              const isRead = notification.status === NotificationStatus.READ;

              return (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.entityType,
                      notification.entityId,
                      isRead
                    )
                  }
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-gray-50",
                    !isRead && "bg-blue-50/50"
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                        config.bgClass
                      )}
                    >
                      <IconComponent
                        className={cn("h-5 w-5", config.iconClass)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={cn(
                            "font-medium text-sm",
                            isRead ? "text-gray-700" : "text-gray-900"
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!isRead && (
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm mb-2 line-clamp-2",
                          isRead ? "text-gray-500" : "text-gray-600"
                        )}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatNotificationTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            variant="ghost"
            className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => {
              router.push("/dashboard/notifications");
              onClose();
            }}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
}
