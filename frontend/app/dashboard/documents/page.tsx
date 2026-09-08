"use client";

import { useState } from "react";
import { useDocuments, useDownloadDocument } from "@/hooks/useDocuments";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  DocumentStatus,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DocumentEntityType,
  ENTITY_TYPE_LABELS,
} from "@/lib/constants/documents";
import { DocumentList } from "@/components/documents/DocumentList";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  LoadingTable,
  ErrorMessage,
  Button,
  Badge,
} from "@/components/ui";
import { Search, FileText, Filter, Download } from "lucide-react";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("");
  const pageSize = 25;

  const { data, isLoading, error } = useDocuments({
    status: statusFilter || undefined,
    documentType: typeFilter || undefined,
    entityType: entityTypeFilter || undefined,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const downloadMutation = useDownloadDocument();

  const handleDownload = async (documentId: string) => {
    try {
      await downloadMutation.mutateAsync(documentId);
      toast.success("Download started");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download document"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              Documents
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and access all project documents
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
          Documents
        </h1>
        <ErrorMessage
          title="Failed to load documents"
          message={error instanceof Error ? error.message : "An error occurred"}
        />
      </div>
    );
  }

  const documents = data?.data || [];
  const pagination = {
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || pageSize,
  };

  // Calculate stats
  const stats = {
    total: pagination.total,
    active: documents.filter((d) => d.status === DocumentStatus.ACTIVE).length,
    superseded: documents.filter((d) => d.status === DocumentStatus.SUPERSEDED).length,
    archived: documents.filter((d) => d.status === DocumentStatus.ARCHIVED).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Instrument_Sans']">
            Documents
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and access all project documents
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
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
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-1 text-emerald-700">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Superseded</p>
                <p className="text-2xl font-bold mt-1 text-amber-700">
                  {stats.superseded}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {stats.archived}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Statuses</option>
                {Object.values(DocumentStatus).map((status) => (
                  <option key={status} value={status}>
                    {DOCUMENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Document Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Types</option>
                {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {DOCUMENT_TYPE_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Entity Type
              </label>
              <select
                value={entityTypeFilter}
                onChange={(e) => {
                  setEntityTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Entities</option>
                {Object.values(DocumentEntityType).map((entity) => (
                  <option key={entity} value={entity}>
                    {ENTITY_TYPE_LABELS[entity]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <DocumentList
        documents={documents}
        isLoading={isLoading}
        emptyMessage={
          statusFilter || typeFilter || entityTypeFilter
            ? "No documents match the selected filters"
            : "No documents found. Upload your first document to get started."
        }
        onDownload={handleDownload}
      />

      {/* Pagination */}
      {pagination.total > pageSize && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, pagination.total)} of{" "}
                {pagination.total} documents
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
