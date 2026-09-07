"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  ProjectStatus,
  ProjectType,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "@/lib/constants/projects";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import {
  Button,
  Card,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  EmptyState,
  Input,
} from "@/components/ui";
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { data, isLoading, error } = useProjects({
    page,
    limit: 25,
    search: search || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-paper-dim animate-pulse rounded" />
          <div className="h-10 w-32 bg-paper-dim animate-pulse rounded" />
        </div>
        <LoadingTable rows={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
          Projects
        </h1>
        <ErrorMessage
          title="Failed to load projects"
          message="Unable to fetch projects. Please try again."
        />
      </div>
    );
  }

  const projects = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
            Projects
          </h1>
          <p className="text-muted mt-1">
            Manage land acquisition projects across the country
          </p>
        </div>
        <CanView permission={Permission.PROJECT_CREATE}>
          <Link href="/dashboard/projects/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              New Project
            </Button>
          </Link>
        </CanView>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="search"
                  placeholder="Search by name or code..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            >
              <option value="">All Statuses</option>
              {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            >
              <option value="">All Types</option>
              {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-8 h-8 text-muted" />}
          title="No projects found"
          description={
            search || statusFilter || typeFilter
              ? "Try adjusting your filters"
              : "Get started by creating your first project"
          }
          action={
            <CanView permission={Permission.PROJECT_CREATE}>
              <Link href="/dashboard/projects/new">
                <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Create Project
                </Button>
              </Link>
            </CanView>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text">
                            {project.name}
                          </h3>
                          <ProjectStatusBadge status={project.status} size="sm" />
                        </div>

                        {project.description && (
                          <p className="text-sm text-muted mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            <span>{project.code}</span>
                          </div>

                          {project.type && (
                            <div className="flex items-center gap-1.5">
                              <FolderKanban className="w-4 h-4" />
                              <span>
                                {PROJECT_TYPE_LABELS[project.type as ProjectType] ||
                                  project.type}
                              </span>
                            </div>
                          )}

                          {project.totalLandRequirement && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {formatNumber(project.totalLandRequirement)}{" "}
                                {project.landRequirementUnit || "hectares"}
                              </span>
                            </div>
                          )}

                          {project.expectedStartDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Start: {formatDate(project.expectedStartDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <FolderKanban className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} projects
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted px-3">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
