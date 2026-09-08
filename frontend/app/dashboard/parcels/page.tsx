"use client";

import { useState } from "react";
import Link from "next/link";
import { useParcels } from "@/hooks/useParcels";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  ParcelStatus,
  PARCEL_STATUS_LABELS,
} from "@/lib/constants/parcels";
import {
  ACQUISITION_STATUS_LABELS,
  AcquisitionStatus,
} from "@/lib/constants/acquisition";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import {
  Card,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  EmptyState,
  Badge,
} from "@/components/ui";
import {
  Search,
  MapPin,
  Ruler,
  FileText,
  Map as MapIcon,
} from "lucide-react";
import { formatNumber, formatArea } from "@/lib/utils";

export default function ParcelsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [acquisitionFilter, setAcquisitionFilter] = useState<string>("");

  const { data, isLoading, error } = useParcels({
    page,
    limit: 25,
    search: search || undefined,
    status: statusFilter || undefined,
    acquisitionStatus: acquisitionFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-paper-dim animate-pulse rounded" />
        </div>
        <LoadingTable rows={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
          Parcels
        </h1>
        <ErrorMessage
          title="Failed to load parcels"
          message="Unable to fetch parcels. Please try again."
        />
      </div>
    );
  }

  const parcels = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
            Land Parcels
          </h1>
          <p className="text-muted mt-1">
            View and manage land parcels across projects
          </p>
        </div>
        <CanView permission={Permission.GIS_VIEW}>
          <Link href="/dashboard/gis">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
              <MapIcon className="w-4 h-4" />
              View on Map
            </button>
          </Link>
        </CanView>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="search"
                  placeholder="Search by ID or survey number..."
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
              {Object.entries(PARCEL_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Acquisition Status Filter */}
            <select
              value={acquisitionFilter}
              onChange={(e) => {
                setAcquisitionFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            >
              <option value="">All Acquisition Statuses</option>
              {Object.entries(ACQUISITION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Parcels List */}
      {parcels.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8 text-muted" />}
          title="No parcels found"
          description={
            search || statusFilter || acquisitionFilter
              ? "Try adjusting your filters"
              : "No parcels have been identified yet"
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {parcels.map((parcel) => (
              <Link key={parcel.id} href={`/dashboard/parcels/${parcel.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text">
                            {parcel.surveyNumber || parcel.referenceId}
                          </h3>
                          <ParcelStatusBadge status={parcel.status} size="sm" />
                          {parcel.acquisitionStatus && (
                            <Badge variant="default" size="sm">
                              {ACQUISITION_STATUS_LABELS[
                                parcel.acquisitionStatus as AcquisitionStatus
                              ] || parcel.acquisitionStatus}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            <span>{parcel.referenceId}</span>
                          </div>

                          {parcel.area && (
                            <div className="flex items-center gap-1.5">
                              <Ruler className="w-4 h-4" />
                              <span>
                                {formatArea(
                                  parcel.area,
                                  parcel.areaUnit || "sqm"
                                )}
                              </span>
                            </div>
                          )}

                          {parcel.villageId && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>Village ID: {parcel.villageId}</span>
                            </div>
                          )}

                          {parcel.ulpin && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono bg-paper-dim px-2 py-0.5 rounded">
                                ULPIN: {parcel.ulpin}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status Row */}
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          {parcel.verificationStatus && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted">Verification:</span>
                              <Badge variant="info" size="sm">
                                {parcel.verificationStatus.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          )}

                          {parcel.compensationStatus && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted">Compensation:</span>
                              <Badge variant="default" size="sm">
                                {parcel.compensationStatus.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          )}

                          {parcel.possessionStatus && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted">Possession:</span>
                              <Badge variant="default" size="sm">
                                {parcel.possessionStatus.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
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
                {pagination.total} parcels
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
