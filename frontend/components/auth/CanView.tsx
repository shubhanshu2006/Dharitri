"use client";

import { useCurrentUser } from "@/hooks/useUser";
import type { ReactNode } from "react";

interface CanViewProps {
  children: ReactNode;
  permission?: string | string[];
  role?: string | string[];
  fallback?: ReactNode;
  requireAll?: boolean; // For multiple permissions: require all (AND) or any (OR)
}

/**
 * Permission-based visibility wrapper
 * Hides children if user lacks required permissions/roles
 * 
 * Note: This is for UX only - backend authorization is the actual security layer
 */
export function CanView({
  children,
  permission,
  role,
  fallback = null,
  requireAll = false,
}: CanViewProps) {
  const { data: user, isLoading } = useCurrentUser();

  // Loading state - hide content until we know permissions
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Not authenticated
  if (!user) {
    return <>{fallback}</>;
  }

  // Check permissions
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? permissions.every((p) => user.permissions?.includes(p))
      : permissions.some((p) => user.permissions?.includes(p));

    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Check roles
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasRole = requireAll
      ? roles.every((r) => user.roles?.includes(r))
      : roles.some((r) => user.roles?.includes(r));

    if (!hasRole) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
