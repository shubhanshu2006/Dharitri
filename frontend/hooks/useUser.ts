import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types/api";

/**
 * Fetch current authenticated user with roles and permissions
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => api.get<User>("/me"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Check if user has a specific permission
 */
export function useHasPermission(permission: string) {
  const { data: user } = useCurrentUser();
  return user?.permissions?.includes(permission) ?? false;
}

/**
 * Check if user has any of the specified roles
 */
export function useHasRole(roles: string | string[]) {
  const { data: user } = useCurrentUser();
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return user?.roles?.some((role) => roleArray.includes(role)) ?? false;
}

/**
 * Get user's scope level
 */
export function useUserScope() {
  const { data: user } = useCurrentUser();
  return user?.scope;
}
