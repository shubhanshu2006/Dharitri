import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification, NotificationQuery } from "@/lib/constants/notifications";

// API endpoints
const notificationApi = {
  getNotifications: (params?: NotificationQuery) =>
    api.get<{ data: Notification[]; total: number; unreadCount: number }>(
      "/notifications",
      params as any
    ),
  markAsRead: (notificationId: string) =>
    api.post<Notification>(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.post<{ count: number }>("/notifications/read-all"),
};

// Query Keys
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationQuery) =>
    [...notificationKeys.all, "list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

// Hooks
export function useNotifications(params?: NotificationQuery) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationApi.getNotifications({
        status: undefined, // Get all to count unread
        limit: 1, // We only need the count
      });
      return response.unreadCount;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate all notification queries to refresh counts and lists
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
