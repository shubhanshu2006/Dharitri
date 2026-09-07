"use client";

import { useState } from "react";
import { useDocuments, useUploadDocument, useDeleteDocument } from "@/hooks/useDocuments";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Badge,
  Alert,
} from "@/components/ui";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  File,
  X,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";

interface ParcelDocumentsProps {
  parcelId: string;
}

const DOCUMENT_CATEGORIES = [
  "SURVEY_REPORT",
  "TITLE_DEED",
  "VERIFICATION_REPORT",
  "COMPENSATION_DOCUMENT",
  "LEGAL_DOCUMENT",
  "PHOTO",
  "OTHER",
];

const CATEGORY_LABELS: Record<string, string> = {
  SURVEY_REPORT: "Survey Report",
  TITLE_DEED: "Title Deed",
  VERIFICATION_REPORT: "Verification Report",
  COMPENSATION_DOCUMENT: "Compensation Document",
  LEGAL_DOCUMENT: "Legal Document",
  PHOTO: "Photo",
  OTHER: "Other",
};

export function ParcelDocuments({ parcelId }: ParcelDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: "",
    description: "",
    category: "OTHER",
  });

  const { data, isLoading, refetch } = useDocuments({
    entityType: "PARCEL",
    entityId: parcelId,
  });

  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const documents = data?.data || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadData((prev) => ({
        ...prev,
        name: file.name,
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await uploadDocument.mutateAsync({
        file: selectedFile,
        data: {
          entityType: "PARCEL",
          entityId: parcelId,
          ...uploadData,
        },
      });
      // Reset form
      setSelectedFile(null);
      setUploadData({ name: "", description: "", category: "OTHER" });
      refetch();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument.mutateAsync(documentId);
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDownload = (document: any) => {
    // In a real implementation, this would download the file
    // For now, we'll just log it
    console.log("Download document:", document);
    window.open(`/api/v1/documents/${document.id}/download`, "_blank");
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Documents
          {documents.length > 0 && (
            <Badge variant="default" size="sm">
              {documents.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Form */}
        <CanView permission={Permission.DOCUMENT_UPLOAD}>
          <div className="p-4 bg-paper-dim rounded-lg border border-paper-line">
            <h4 className="text-sm font-semibold text-text mb-3">
              Upload Document
            </h4>
            <form onSubmit={handleUpload} className="space-y-3">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-paper-line rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  >
                    {selectedFile ? (
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-text">
                          {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFile(null);
                          }}
                          className="ml-2 text-muted hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-muted" />
                        <span className="text-sm text-muted">
                          Click to select file
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Category
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                >
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat] || cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>
        </CanView>

        {/* Upload Success */}
        {uploadDocument.isSuccess && (
          <Alert
            variant="success"
            dismissible
            onDismiss={() => uploadDocument.reset()}
          >
            Document uploaded successfully.
          </Alert>
        )}

        {/* Upload Error */}
        {uploadDocument.isError && (
          <Alert
            variant="danger"
            dismissible
            onDismiss={() => uploadDocument.reset()}
          >
            Failed to upload document. Please try again.
          </Alert>
        )}

        {/* Documents List */}
        {isLoading ? (
          <Loading text="Loading documents..." />
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-paper-line hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-text truncate">
                      {doc.name}
                    </h5>
                    {doc.description && (
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {doc.category && (
                        <Badge variant="default" size="sm">
                          {CATEGORY_LABELS[doc.category] || doc.category}
                        </Badge>
                      )}
                      <span className="text-xs text-muted">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">
                        {formatDate(doc.uploadedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-muted hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <CanView permission={Permission.DOCUMENT_DELETE}>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CanView>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
