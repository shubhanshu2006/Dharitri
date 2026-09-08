"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Alert,
} from "@/components/ui";
import {
  DocumentStatus,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DocumentAccessClass,
  DOCUMENT_ACCESS_LABELS,
  ACCESS_CLASS_COLORS,
  DOCUMENT_TYPE_LABELS,
  formatFileSize,
  isPreviewable,
} from "@/lib/constants/documents";
import { Document, useDocumentDownloadUrl, useCreateDocumentVersion } from "@/hooks/useDocuments";
import {
  FileText,
  Download,
  Upload,
  Calendar,
  User,
  Shield,
  Tag,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DocumentViewerProps {
  document: Document;
  onVersionUpload?: () => void;
}

export function DocumentViewer({ document, onVersionUpload }: DocumentViewerProps) {
  const [showVersionUpload, setShowVersionUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data: downloadData } = useDocumentDownloadUrl(document.id);
  const versionMutation = useCreateDocumentVersion(document.id);

  const statusColors = DOCUMENT_STATUS_COLORS[document.status as DocumentStatus];
  const accessColors = ACCESS_CLASS_COLORS[document.accessClass as DocumentAccessClass];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleVersionUpload = async () => {
    if (!selectedFile) return;

    try {
      await versionMutation.mutateAsync(selectedFile);
      toast.success("New version uploaded successfully");
      setShowVersionUpload(false);
      setSelectedFile(null);
      onVersionUpload?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload version"
      );
    }
  };

  const handleDownload = () => {
    if (downloadData?.url) {
      const link = window.document.createElement("a");
      link.href = downloadData.url;
      link.download = downloadData.filename;
      link.click();
    }
  };

  const canPreview =
    document.currentVersion && isPreviewable(document.currentVersion.mimeType);

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="font-['Instrument_Sans']">
                  {document.title}
                </CardTitle>
                <Badge
                  className={cn(
                    "border",
                    statusColors.bg,
                    statusColors.text,
                    statusColors.border
                  )}
                >
                  {DOCUMENT_STATUS_LABELS[document.status as DocumentStatus]}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {DOCUMENT_TYPE_LABELS[document.documentType] || document.documentType}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowVersionUpload(!showVersionUpload)}
              >
                <Upload className="h-4 w-4 mr-2" />
                New Version
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Shield className="h-4 w-4" />
                  <span>Access Level</span>
                </div>
                <Badge
                  className={cn(
                    "border",
                    accessColors.bg,
                    accessColors.text,
                    accessColors.border
                  )}
                >
                  {DOCUMENT_ACCESS_LABELS[document.accessClass as DocumentAccessClass]}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  <span>Uploaded By</span>
                </div>
                <p className="text-sm">{document.uploadedBy?.name || "Unknown"}</p>
                <p className="text-xs text-gray-500">{document.uploadedBy?.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Upload Date</span>
                </div>
                <p className="text-sm">{formatDate(document.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {document.currentVersion && (
                <>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <FileText className="h-4 w-4" />
                      <span>Current Version</span>
                    </div>
                    <p className="text-sm font-medium">
                      Version {document.currentVersion.versionNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {document.currentVersion.originalFileName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Tag className="h-4 w-4" />
                      <span>File Details</span>
                    </div>
                    <p className="text-sm">
                      {formatFileSize(Number(document.currentVersion.sizeBytes))}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {document.currentVersion.mimeType}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Upload */}
      {showVersionUpload && (
        <Alert variant="info">
          <Upload className="h-4 w-4" />
          <div className="flex-1">
            <p className="font-medium">Upload New Version</p>
            <p className="text-sm mb-3">
              This will create version {(document.currentVersion?.versionNumber || 0) + 1}
            </p>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                className="text-sm"
              />
              {selectedFile && (
                <Button
                  size="sm"
                  onClick={handleVersionUpload}
                  disabled={versionMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {versionMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Preview (if applicable) */}
      {canPreview && downloadData?.url && (
        <Card>
          <CardHeader>
            <CardTitle className="font-['Instrument_Sans'] flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {document.currentVersion?.mimeType.startsWith("image/") ? (
              <img
                src={downloadData.url}
                alt={document.title}
                className="max-w-full h-auto rounded-lg border border-gray-200"
              />
            ) : document.currentVersion?.mimeType === "application/pdf" ? (
              <iframe
                src={downloadData.url}
                className="w-full h-[600px] border border-gray-200 rounded-lg"
                title={document.title}
              />
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      {document.versions && document.versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-['Instrument_Sans']">
              Version History
              <Badge className="ml-2 bg-gray-100 text-gray-700">
                {document.versions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {document.versions.map((version) => (
                <div
                  key={version.id}
                  className={cn(
                    "p-3 border rounded-lg",
                    version.id === document.currentVersionId
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          Version {version.versionNumber}
                        </p>
                        {version.id === document.currentVersionId && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {version.originalFileName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{formatFileSize(Number(version.sizeBytes))}</span>
                        <span>•</span>
                        <span>{formatDate(version.createdAt)}</span>
                        {version.uploadedBy && (
                          <>
                            <span>•</span>
                            <span>{version.uploadedBy.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
