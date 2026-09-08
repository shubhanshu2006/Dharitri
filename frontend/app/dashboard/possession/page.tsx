"use client";

import { useState } from "react";
import Link from "next/link";
import { usePossessionRecords } from "@/hooks/usePossession";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  PossessionStatus,
  POSSESSION_STATUS_LABELS,
  POSSESSION_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/possession";
import { PossessionStatusBadge } from "@/components/possession/PossessionStatusBadge";
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
import { Search, Home, FileText, Plus, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PossessionRecordsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const pageSize = 25;

  const { data, isLoading, error } = usePossessionRecords({
    status: statusFilter || undefined,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              Possession Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and record land possession for acquisition cases
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
          Possession Management
        </h1>
        <ErrorMessage
          title="Failed to load possession records"
          message={error instanceof Error ? error.message : "An error occurred"}
        />
      </div>
    );
  }

  const records = data?.data || [];
  const pagination = data?.pagination;

  // Calculate stats
  const stats = {
    total: pagination?.total || 0,
    pending: records.filter((r) => r.status === PossessionStatus.PENDING).length,
    ready: records.filter((r) => r.status === PossessionStatus.READY).length,
    recorded: records.filter((r) => r.status === PossessionStatus.RECORDED).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Instrument_Sans']">
            Possession Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and record land possession for acquisition cases
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Home className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold mt-1 text-amber-700">
                  {stats.ready}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recorded</p>
                <p className="text-2xl font-bold mt-1 text-emerald-700">
                  {stats.recorded}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {POSSESSION_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {records.length === 0 ? (
        <EmptyState
          icon={<Home className="h-12 w-12" />}
          title="No possession records found"
          description={
            statusFilter
              ? "No records match the selected filters"
              : "Possession records will appear here once cases are ready"
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-['Instrument_Sans']">
              Possession Records
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
                      Case ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Parcel
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Possession Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Checklist
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
                  {records.map((record) => {
                    const completedItems =
                      record.checklistItems?.filter(
                        (item) => item.status === "PASS" || item.status === "NOT_APPLICABLE"
                      ).length || 0;
                    const totalItems = record.checklistItems?.length || 0;

                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-sm">
                            {record.acquisitionCaseId.slice(0, 8)}...
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-900">
                            {/* @ts-ignore */}
                            {record.acquisitionCase?.acquisitionParcel?.cadastralParcel
                              ?.parcelId || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <PossessionStatusBadge status={record.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.possessionDate
                            ? formatDate(record.possessionDate)
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              completedItems === totalItems && totalItems > 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {completedItems}/{totalItems}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(record.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/possession/${record.acquisitionCaseId}`}
                          >
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total > pageSize && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, pagination.total)} of{" "}
                  {pagination.total} records
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
                    disabled={page * pageSize >= pagination.total}
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
