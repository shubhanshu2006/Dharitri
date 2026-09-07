"use client";

import { useState } from "react";
import Link from "next/link";
import { useAcquisitionCases } from "@/hooks/useAcquisition";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  AcquisitionStatus,
  ACQUISITION_STATUS_LABELS,
} from "@/lib/constants/acquisition";
import { AcquisitionStatusBadge } from "@/components/acquisition/AcquisitionStatusBadge";
import {
  Card,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  EmptyState,
} from "@/components/ui";
import { Search, FolderOpen, Clock, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AcquisitionPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error } = useAcquisitionCases({
    page,
    limit: 25,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-paper-dim animate-pulse rounded" />
        </div>
        <LoadingTable rows={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
          Acquisition Cases
        </h1>
        <ErrorMessage
          title="Failed to load acquisition cases"
          message="Unable to fetch acquisition cases. Please try again."
        />
      </div>
    );
  }

  const cases = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
            Acquisition Cases
          </h1>
          <p className="text-muted mt-1">
            Manage land acquisition cases and workflow
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="search"
                  placeholder="Search by case ID or reference..."
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
              {Object.entries(ACQUISITION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Acquisition Cases List */}
      {cases.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-8 h-8 text-muted" />}
          title="No acquisition cases found"
          description={
            search || statusFilter
              ? "Try adjusting your filters"
              : "No acquisition cases have been created yet"
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {cases.map((acquisitionCase) => (
              <Link
                key={acquisitionCase.id}
                href={`/dashboard/acquisition/${acquisitionCase.id}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text">
                            Case #{acquisitionCase.id.slice(0, 8)}
                          </h3>
                          <AcquisitionStatusBadge
                            status={acquisitionCase.status}
                            size="sm"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">
                              Acquisition Parcel:
                            </span>
                            <span className="font-mono text-xs">
                              {acquisitionCase.acquisitionParcelId.slice(0, 8)}
                            </span>
                          </div>

                          {acquisitionCase.acquisitionParcel && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">Reference:</span>
                              <span className="text-xs">
                                {acquisitionCase.acquisitionParcel.acquisitionReference}
                              </span>
                            </div>
                          )}

                          {acquisitionCase.currentAssigneeName && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{acquisitionCase.currentAssigneeName}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{formatDateTime(acquisitionCase.createdAt)}</span>
                          </div>
                        </div>

                        {acquisitionCase.acquisitionParcel?.landCategory && (
                          <div className="text-xs text-muted">
                            Land Category:{" "}
                            {acquisitionCase.acquisitionParcel.landCategory}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-white" />
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
                {pagination.total} cases
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-sm border border-paper-line rounded-lg hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm text-muted px-3">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className="px-3 py-1.5 text-sm border border-paper-line rounded-lg hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
