"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useProject,
  useSubmitProject,
  useApproveProject,
  useHoldProject,
  useCompleteProject,
} from "@/hooks/useProjects";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  ProjectType,
  PROJECT_TYPE_LABELS,
  ProjectStatus,
} from "@/lib/constants/projects";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  ErrorMessage,
  Alert,
} from "@/components/ui";
import {
  ArrowLeft,
  Edit,
  Send,
  CheckCircle,
  Pause,
  FlagTriangleRight,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { formatDate, formatCurrency, formatNumber } from "@/lib/utils";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(id);

  const submitProject = useSubmitProject(id);
  const approveProject = useApproveProject(id);
  const holdProject = useHoldProject(id);
  const completeProject = useCompleteProject(id);

  const handleSubmit = async () => {
    try {
      await submitProject.mutateAsync();
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveProject.mutateAsync();
    } catch (error) {
      console.error("Failed to approve project:", error);
    }
  };

  const handleHold = async () => {
    try {
      await holdProject.mutateAsync({ reason: "On hold pending review" });
    } catch (error) {
      console.error("Failed to hold project:", error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeProject.mutateAsync();
    } catch (error) {
      console.error("Failed to complete project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading project details..." size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/projects">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Projects
          </Button>
        </Link>
        <ErrorMessage
          title="Project not found"
          message="The project you're looking for doesn't exist or you don't have access to it."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/projects">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Projects
          </Button>
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
                {project.name}
              </h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-muted">{project.code}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Actions */}
            {project.status === ProjectStatus.DRAFT && (
              <CanView permission={Permission.PROJECT_SUBMIT}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-4 h-4" />}
                  onClick={handleSubmit}
                  loading={submitProject.isPending}
                >
                  Submit for Review
                </Button>
              </CanView>
            )}

            {project.status === ProjectStatus.SUBMITTED && (
              <CanView permission={Permission.PROJECT_APPROVE}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleApprove}
                  loading={approveProject.isPending}
                >
                  Approve
                </Button>
              </CanView>
            )}

            {(project.status === ProjectStatus.APPROVED ||
              project.status === ProjectStatus.IN_PROGRESS) && (
              <>
                <CanView permission={Permission.PROJECT_HOLD}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Pause className="w-4 h-4" />}
                    onClick={handleHold}
                    loading={holdProject.isPending}
                  >
                    Hold
                  </Button>
                </CanView>

                <CanView permission={Permission.PROJECT_COMPLETE}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FlagTriangleRight className="w-4 h-4" />}
                    onClick={handleComplete}
                    loading={completeProject.isPending}
                  >
                    Complete
                  </Button>
                </CanView>
              </>
            )}

            <CanView permission={Permission.PROJECT_UPDATE}>
              <Link href={`/dashboard/projects/${id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit
                </Button>
              </Link>
            </CanView>

            <CanView permission={Permission.PROJECT_UPDATE}>
              <Link href={`/dashboard/projects/${id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit
                </Button>
              </Link>
            </CanView>

            <Link href={`/dashboard/projects/${id}/dashboard`}>
              <Button
                variant="outline"
                size="sm"
                icon={<Building2 className="w-4 h-4" />}
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Errors */}
      {(submitProject.isError ||
        approveProject.isError ||
        holdProject.isError ||
        completeProject.isError) && (
        <Alert variant="danger">
          Failed to update project status. Please try again.
        </Alert>
      )}

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && (
                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Description
                  </p>
                  <p className="text-base text-text">{project.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Project Type
                  </p>
                  <p className="text-base text-text">
                    {project.type
                      ? PROJECT_TYPE_LABELS[project.type as ProjectType]
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Implementing Agency
                  </p>
                  <p className="text-base text-text">
                    {project.implementingAgency || "—"}
                  </p>
                </div>

                {project.ministry && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Ministry/Department
                    </p>
                    <p className="text-base text-text">{project.ministry}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Land Requirement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {project.totalLandRequirement && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Total Land Required
                    </p>
                    <p className="text-2xl font-bold text-text">
                      {formatNumber(project.totalLandRequirement)}{" "}
                      <span className="text-sm font-normal text-muted">
                        {project.landRequirementUnit || "hectares"}
                      </span>
                    </p>
                  </div>
                )}

                {project.estimatedCost && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Estimated Cost
                    </p>
                    <p className="text-2xl font-bold text-text">
                      {formatCurrency(project.estimatedCost)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {project.expectedStartDate && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Expected Start
                    </p>
                    <p className="text-base text-text">
                      {formatDate(project.expectedStartDate)}
                    </p>
                  </div>
                )}

                {project.expectedCompletionDate && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Expected Completion
                    </p>
                    <p className="text-base text-text">
                      {formatDate(project.expectedCompletionDate)}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-paper-line">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">Created</p>
                  <p className="text-sm text-text">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-text">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/gis?project=${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </Link>

              <Link href={`/dashboard/parcels?project=${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  View Parcels
                </Button>
              </Link>

              <Link href={`/dashboard/documents?project=${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Project ID</span>
                  <span className="font-mono text-xs text-text">
                    {project.id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
