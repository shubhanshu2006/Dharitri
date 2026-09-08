"use client";

import { useState } from "react";
import Link from "next/link";
import { useRRCases } from "@/hooks/useRR";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { RRStatus, RR_STATUS_LABELS } from "@/lib/constants/rr";
import { RRStatusBadge } from "@/components/rr/RRStatusBadge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  EmptyState,
  Button,
  Badge,
} from "@/components/ui";
import { Search, Users, Plus, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RRCasesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error } = useRRCases({
    skip: (page - 1) * 25,
    take: 25,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              R&R Cases
            </h1>
            <p className="text-gray-600 mt-1">
              Rehabilitation & Resettlement case management
            </p>
          </div>
        </div>
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-['Instrument_Sans']">
          R&R Cases
        </h1>
        <ErrorMessage
          title="Failed to load R&R cases"
          message={error instanceof Error ? error.message : "An error occurred"}
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
          <h1 className="text-3xl font-bold font-['Instrument_Sans']">
            R&R Cases
          </h1>
          <p className="text-gray-600 mt-1">
            Manage rehabilitation and resettlement cases
          </p>
        </div>
        <CanView permission={Permission.RR_CREATE}>
          <Link href="/dashboard/rr/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New R&R Case
            </Button>
          </Link>
        </CanView>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by family ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(RR_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      {cases.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No R&R cases found"
          description="Get started by creating your first R&R case"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-['Instrument_Sans']">
              R&R Cases
              <Badge className="ml-2 bg-gray-100 text-gray-700">
                {pagination?.total || 0} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Family
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Applicable
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cases.map((rrCase) => (
                    <tr
                      key={rrCase.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {rrCase.familyId.slice(0, 8)}...
                          </p>
                          {rrCase.acquisitionCaseId && (
                            <p className="text-sm text-gray-500">
                              Case: {rrCase.acquisitionCaseId.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">
                          {rrCase.projectId.slice(0, 8)}...
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <RRStatusBadge status={rrCase.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            rrCase.applicable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {rrCase.applicable ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(rrCase.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/rr/${rrCase.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 25 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * 25 + 1} to{" "}
                  {Math.min(page * 25, pagination.total)} of {pagination.total}{" "}
                  cases
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * 25 >= pagination.total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
