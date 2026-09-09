import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  requestedDepartment: string | null;
  requestedRole: string | null;
  requestedStateId: string | null;
  requestedDistrictId: string | null;
  requestReason: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  isActive: boolean;
  roles: string[];
  scopes: any[];
  requestedDepartment: string | null;
  requestedRole: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
}

interface ApproveUserData {
  roleCode: string;
  stateId?: string;
  districtId?: string;
  departmentId?: string;
}

export function useAdminUsers() {
  const queryClient = useQueryClient();

  // Get pending users
  const {
    data: pendingUsers,
    isLoading: isPendingLoading,
    error: pendingError,
  } = useQuery<PendingUser[]>({
    queryKey: ["admin", "users", "pending"],
    queryFn: () => api.get("/admin/users/pending"),
  });

  // Get all users
  const {
    data: allUsers,
    isLoading: isAllUsersLoading,
    error: allUsersError,
  } = useQuery<User[]>({
    queryKey: ["admin", "users", "all"],
    queryFn: () => api.get("/admin/users"),
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: ApproveUserData;
    }) => {
      return api.post(`/admin/users/${userId}/approve`, data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  // Reject user mutation
  const rejectUserMutation = useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      return api.post(`/admin/users/${userId}/reject`, {
        reason,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return {
    pendingUsers,
    allUsers,
    isLoading: isPendingLoading || isAllUsersLoading,
    error: pendingError || allUsersError,
    approveUser: async (userId: string, data: ApproveUserData) => {
      return approveUserMutation.mutateAsync({ userId, data });
    },
    rejectUser: async (userId: string, reason?: string) => {
      return rejectUserMutation.mutateAsync({ userId, reason });
    },
  };
}
