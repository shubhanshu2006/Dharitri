"use client";

import { useState } from "react";
import Link from "next/link";
import { useVerificationCases } from "@/hooks/useVerification";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  VerificationStatus,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/constants/verification";
import { VerificationStatusBadge } from "@/components/verification/VerificationStatusBadge";
import {
  Card,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  EmptyState,
  Badge,
} from "@/components/ui";
import { Search, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function VerificationPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error } = useVerificationCases({
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
          Verification Cases
        </h1>
        <ErrorMessage
          title="Failed to load verification cases"
          message="Unable to fetch verification cases. Please try again."
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
            Verification Cases
          </h1>
          <p className="text-muted mt-1">
            Review and manage parcel verification cases
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
                  placeholder="Search by case ID or acquisition case..."
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
              {Object.entries(VERIFICATION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Verification Cases List */}
      {cases.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-muted" />}
          title="No verification cases found"
          description={
            search || statusFilter
              ? "Try adjusting your filters"
              : "No verification cases have been created yet"
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {cases.map((verificationCase) => {
              const hasResults = verificationCase.results && verificationCase.results.length > 0;
              const passCount = verificationCase.results?.filter(r => r.status === 'PASS').length || 0;
              const failCount = verificationCase.results?.filter(r => r.status === 'FAIL').length || 0;
              const warningCount = verificationCase.results?.filter(r => r.status === 'WARNING').length || 0;

              return (
                <Link
                  key={verificationCase.id}
                  href={`/dashboard/verification/${verificationCase.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-text">
                              Case #{verificationCase.id.slice(0, 8)}
                            </h3>
                            <VerificationStatusBadge
                              status={verificationCase.status}
                              size="sm"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">Acquisition Case:</span>
                              <span className="font-mono text-xs">
                                {verificationCase.acquisitionCaseId.slice(0, 8)}
                              </span>
                            </div>

                            {verificationCase.assignedUserName && (
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium">Assigned to:</span>
                                <span>{verificationCase.assignedUserName}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{formatDateTime(verificationCase.createdAt)}</span>
                            </div>
                          </div>

                          {/* Results Summary */}
                          {hasResults && (
                            <div className="flex items-center gap-2">
                              {passCount > 0 && (
                                <Badge variant="success" size="sm">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {passCount} Passed
                                </Badge>
                              )}
                              {failCount > 0 && (
                                <Badge variant="danger" size="sm">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {failCount} Failed
                                </Badge>
                              )}
                              {warningCount > 0 && (
                                <Badge variant="warning" size="sm">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {warningCount} Warnings
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
