"use client";

import { useCurrentUser } from "@/hooks/useUser";

interface UseCanDoProps {
  permission?: string | string[];
  role?: string | string[];
  requireAll?: boolean;
}

/**
 * Permission checker hook - returns boolean
 * Used for conditional logic (not just visibility)
 * 
 * Note: This is for UX only - backend authorization is the actual security layer
 */
export function useCanDo({ permission, role, requireAll = false }: UseCanDoProps): boolean {
  const { data: user, isLoading } = useCurrentUser();

  // Loading state - deny by default
  if (isLoading || !user) {
    return false;
  }

  // Check permissions
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? permissions.every((p) => user.permissions?.includes(p))
      : permissions.some((p) => user.permissions?.includes(p));

    if (!hasPermission) {
      return false;
    }
  }

  // Check roles
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasRole = requireAll
      ? roles.every((r) => user.roles?.includes(r))
      : roles.some((r) => user.roles?.includes(r));

    if (!hasRole) {
      return false;
    }
  }

  return true;
}

// Alias for backward compatibility
export const CanDo = useCanDo;
