"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Clock, Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changeNote?: string;
}

interface DocumentVersionHistoryProps {
  documentId: string;
  onUploadVersion?: () => void;
}

export function DocumentVersionHistory({
  documentId,
  onUploadVersion,
}: DocumentVersionHistoryProps) {
  const queryClient = useQueryClient();
  const [uploadingVersion, setUploadingVersion] = useState(false);

  // Fetch version history
  const { data: versions, isLoading, error, refetch } = useQuery({
    queryKey: ["document-versions", documentId],
    queryFn: () =>
      api.get<DocumentVersion[]>(`/documents/${documentId}/versions`),
  });

  // Download version
  const downloadVersion = async (versionId: string, fileName: string) => {
    try {
      const response = await fetch(
        `/api/v1/documents/${documentId}/versions/${versionId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download version:", error);
    }
  };

  // Upload new version
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingVersion(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post(`/documents/${documentId}/versions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["document-versions", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onUploadVersion?.();
    } catch (error) {
      console.error("Failed to upload version:", error);
    } finally {
      setUploadingVersion(false);
      event.target.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingSpinner size="sm" message="Loading version history..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <ErrorMessage
          message="Failed to load version history"
          onRetry={refetch}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Version History</h3>
          <span className="text-sm text-gray-500">
            ({versions?.length || 0} version{versions?.length !== 1 ? "s" : ""})
          </span>
        </div>

        {/* Upload New Version */}
        <div>
          <input
            type="file"
            id={`version-upload-${documentId}`}
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploadingVersion}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              document.getElementById(`version-upload-${documentId}`)?.click()
            }
            disabled={uploadingVersion}
            loading={uploadingVersion}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Version
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {versions && versions.length > 0 ? (
          versions.map((version, index) => (
            <div
              key={version.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        Version {version.versionNumber}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {version.fileName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatFileSize(version.fileSize)}</span>
                      <span>•</span>
                      <span>Uploaded by {version.uploadedBy}</span>
                      <span>•</span>
                      <span>{formatDate(version.uploadedAt)}</span>
                    </div>
                    {version.changeNote && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{version.changeNote}"
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadVersion(version.id, version.fileName)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No version history</p>
            <p className="text-sm mt-1">Upload a new version to start tracking changes</p>
          </div>
        )}
      </div>
    </Card>
  );
}
