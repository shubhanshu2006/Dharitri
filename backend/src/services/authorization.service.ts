import { ScopeLevel } from "../../generated/prisma/client.js";
import { ForbiddenError } from "../utils/errors.js";

export interface UserWithAuth {
  id: string;
  clerkUserId: string;
  roles: string[];
  permissions: string[];
  scopes: Array<{
    scopeLevel: ScopeLevel;
    stateId: string | null;
    districtId: string | null;
    projectId: string | null;
    assignedCaseId: string | null;
  }>;
}

export interface ResourceScope {
  stateId?: string;
  districtId?: string;
  projectId?: string;
  caseId?: string;
}

export class AuthorizationService {
  hasPermission(user: UserWithAuth, permission: string): boolean {
    return user.permissions.includes(permission);
  }

  hasAnyPermission(user: UserWithAuth, permissions: string[]): boolean {
    return permissions.some((p) => user.permissions.includes(p));
  }

  hasAllPermissions(user: UserWithAuth, permissions: string[]): boolean {
    return permissions.every((p) => user.permissions.includes(p));
  }

  hasRole(user: UserWithAuth, role: string): boolean {
    return user.roles.includes(role);
  }

  hasAnyRole(user: UserWithAuth, roles: string[]): boolean {
    return roles.some((r) => user.roles.includes(r));
  }

  canAccessResource(user: UserWithAuth, resource: ResourceScope): boolean {
    if (user.scopes.some((s) => s.scopeLevel === "NATIONAL")) {
      return true;
    }

    if (resource.stateId) {
      const hasStateAccess = user.scopes.some(
        (s) => s.scopeLevel === "STATE" && s.stateId === resource.stateId,
      );
      if (hasStateAccess) return true;
    }

    if (resource.districtId) {
      const hasDistrictAccess = user.scopes.some(
        (s) =>
          s.scopeLevel === "DISTRICT" && s.districtId === resource.districtId,
      );
      if (hasDistrictAccess) return true;
    }

    if (resource.projectId) {
      const hasProjectAccess = user.scopes.some(
        (s) => s.scopeLevel === "PROJECT" && s.projectId === resource.projectId,
      );
      if (hasProjectAccess) return true;
    }

    if (resource.caseId) {
      const hasCaseAccess = user.scopes.some(
        (s) =>
          s.scopeLevel === "ASSIGNED_CASE" &&
          s.assignedCaseId === resource.caseId,
      );
      if (hasCaseAccess) return true;
    }

    return false;
  }

  requirePermission(user: UserWithAuth, permission: string): void {
    if (!this.hasPermission(user, permission)) {
      throw new ForbiddenError(`Permission required: ${permission}`);
    }
  }

  requireAnyPermission(user: UserWithAuth, permissions: string[]): void {
    if (!this.hasAnyPermission(user, permissions)) {
      throw new ForbiddenError(
        `One of these permissions required: ${permissions.join(", ")}`,
      );
    }
  }

  requireAllPermissions(user: UserWithAuth, permissions: string[]): void {
    if (!this.hasAllPermissions(user, permissions)) {
      throw new ForbiddenError(
        `All these permissions required: ${permissions.join(", ")}`,
      );
    }
  }

  requireRole(user: UserWithAuth, role: string): void {
    if (!this.hasRole(user, role)) {
      throw new ForbiddenError(`Role required: ${role}`);
    }
  }

  requireAnyRole(user: UserWithAuth, roles: string[]): void {
    if (!this.hasAnyRole(user, roles)) {
      throw new ForbiddenError(
        `One of these roles required: ${roles.join(", ")}`,
      );
    }
  }

  requireResourceAccess(user: UserWithAuth, resource: ResourceScope): void {
    if (!this.canAccessResource(user, resource)) {
      throw new ForbiddenError("You do not have access to this resource");
    }
  }
}

export const authorizationService = new AuthorizationService();
