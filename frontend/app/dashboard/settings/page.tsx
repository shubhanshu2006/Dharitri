"use client";

import { useCurrentUser } from "@/hooks/useUser";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Loading,
  ErrorMessage,
} from "@/components/ui";
import { RoleBadge } from "@/components/auth/RoleBadge";
import { PERMISSION_DESCRIPTIONS } from "@/lib/constants/permissions";
import {
  User,
  Shield,
  MapPin,
  Mail,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading your profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load profile"
        message="Unable to fetch your user information. Please try again."
      />
    );
  }

  if (!user) {
    return (
      <ErrorMessage
        title="User not found"
        message="Your user profile could not be found."
      />
    );
  }

  // Get scope level label
  const scopeLabels: Record<string, string> = {
    NATIONAL: "National Level",
    STATE: "State Level",
    DISTRICT: "District Level",
    PROJECT: "Project Level",
    ASSIGNED_CASE: "Case Level",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
          Profile & Settings
        </h1>
        <p className="text-muted mt-1">
          View your account information, roles, and permissions.
        </p>
      </div>

      {/* User Information */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted" />
            <div>
              <p className="text-sm text-muted">Full Name</p>
              <p className="text-base font-medium text-text">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted" />
            <div>
              <p className="text-sm text-muted">Email Address</p>
              <p className="text-base font-medium text-text">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted" />
            <div>
              <p className="text-sm text-muted">User ID</p>
              <p className="text-base font-mono text-text text-sm">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Assigned Roles
          </CardTitle>
          <CardDescription>
            Your roles determine your access level and responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role) => (
                <RoleBadge key={role} role={role} size="md" showDescription />
              ))
            ) : (
              <p className="text-sm text-muted">No roles assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scope */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            Access Scope
          </CardTitle>
          <CardDescription>
            Your authorization scope within the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted mb-1">Scope Level</p>
            <span className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
              {scopeLabels[user.scope.level] || user.scope.level}
            </span>
          </div>

          {user.scope.stateId && (
            <div>
              <p className="text-sm text-muted mb-1">State ID</p>
              <p className="text-sm font-mono text-text">{user.scope.stateId}</p>
            </div>
          )}

          {user.scope.districtId && (
            <div>
              <p className="text-sm text-muted mb-1">District ID</p>
              <p className="text-sm font-mono text-text">
                {user.scope.districtId}
              </p>
            </div>
          )}

          {user.scope.projectId && (
            <div>
              <p className="text-sm text-muted mb-1">Project ID</p>
              <p className="text-sm font-mono text-text">
                {user.scope.projectId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Permissions
          </CardTitle>
          <CardDescription>
            Actions you are authorized to perform ({user.permissions?.length || 0}{" "}
            permissions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.permissions && user.permissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-start gap-2 p-3 rounded-lg bg-paper-dim border border-paper-line"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text">
                      {permission.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {PERMISSION_DESCRIPTIONS[permission as keyof typeof PERMISSION_DESCRIPTIONS] ||
                        "Permission access"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No permissions assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card variant="bordered">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-text mb-1">Security Note</p>
              <p className="text-muted">
                Your permissions are verified on the server for every action. UI
                visibility is for convenience only. If you need access to
                additional features, please contact your system administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
