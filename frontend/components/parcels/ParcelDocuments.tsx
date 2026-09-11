"use client";

import { useState } from "react";
import { useDocumentsByEntity, useUploadDocument, useDeleteDocument } from "@/hooks/useDocuments";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Badge,
  Alert,
  ConfirmModal,
} from "@/components/ui";
import { toast } from "sonner";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  DocumentEntityType,
  DocumentAccessClass,
  DOCUMENT_TYPES,
  formatFileSize,
} from "@/lib/constants/documents";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  File,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ParcelDocumentsProps {
  parcelId: string;
}

export function ParcelDocuments({ parcelId }: ParcelDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: "",
    documentType: DOCUMENT_TYPES.OTHER as string,
    accessClass: DocumentAccessClass.INTERNAL as DocumentAccessClass,
  });

  const { data, isLoading, refetch } = useDocumentsByEntity(
    DocumentEntityType.PARCEL,
    parcelId
  );

  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const documents = data?.data || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadData((prev) => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
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
        entityType: DocumentEntityType.PARCEL,
        entityId: parcelId,
        title: uploadData.title,
        documentType: uploadData.documentType,
        accessClass: uploadData.accessClass,
      });
      // Reset form
      setSelectedFile(null);
      setUploadData({
        title: "",
        documentType: DOCUMENT_TYPES.OTHER as string,
        accessClass: DocumentAccessClass.INTERNAL as DocumentAccessClass,
      });
      refetch();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocument.mutateAsync(docToDelete);
      toast.success("Document deleted successfully");
      setDocToDelete(null);
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = (documentId: string) => {
    setDocToDelete(documentId);
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
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Document Type
                </label>
                <select
                  value={uploadData.documentType}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      documentType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                >
                  <option value={DOCUMENT_TYPES.SURVEY_MAP}>Survey Map</option>
                  <option value={DOCUMENT_TYPES.LAND_TITLE}>Land Title</option>
                  <option value={DOCUMENT_TYPES.SALE_DEED}>Sale Deed</option>
                  <option value={DOCUMENT_TYPES.MUTATION_RECORD}>Mutation Record</option>
                  <option value={DOCUMENT_TYPES.FIELD_PHOTO}>Field Photo</option>
                  <option value={DOCUMENT_TYPES.BOUNDARY_VERIFICATION}>Boundary Verification</option>
                  <option value={DOCUMENT_TYPES.OTHER}>Other</option>
                </select>
              </div>

              {/* Access Class */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Access Level
                </label>
                <select
                  value={uploadData.accessClass}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      accessClass: e.target.value as DocumentAccessClass,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                >
                  <option value={DocumentAccessClass.PUBLIC}>Public</option>
                  <option value={DocumentAccessClass.INTERNAL}>Internal</option>
                  <option value={DocumentAccessClass.RESTRICTED}>Restricted</option>
                  <option value={DocumentAccessClass.CONFIDENTIAL}>Confidential</option>
                </select>
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
                      {doc.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="sm">
                        {doc.documentType}
                      </Badge>
                      {doc.currentVersion && (
                        <>
                          <span className="text-xs text-muted">
                            {formatFileSize(Number(doc.currentVersion.sizeBytes))}
                          </span>
                          <span className="text-xs text-muted">•</span>
                          <span className="text-xs text-muted">
                            {formatDate(doc.createdAt)}
                          </span>
                        </>
                      )}
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

      <ConfirmModal
        isOpen={Boolean(docToDelete)}
        onClose={() => setDocToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document from the parcel record? This action cannot be undone."
        confirmText="Delete Document"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </Card>
  );
}
