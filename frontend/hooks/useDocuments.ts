import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  objectKey: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  uploadedById: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Document {
  id: string;
  entityType: string;
  entityId: string;
  documentType: string;
  title: string;
  accessClass: string;
  status: string;
  uploadedById: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
  currentVersionId?: string;
  currentVersion?: DocumentVersion;
  versions?: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}

interface DocumentListParams {
  entityType?: string;
  entityId?: string;
  documentType?: string;
  status?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface DocumentListResponse {
  data: Document[];
  total: number;
  page: number;
  pageSize: number;
}

interface UploadDocumentData {
  entityType: string;
  entityId: string;
  documentType: string;
  title: string;
  accessClass?: string;
  file: File;
}

interface DownloadUrlResponse {
  url: string;
  expiresIn: number;
  filename: string;
  mimeType: string;
}

/**
 * Fetch list of documents with filters
 */
export function useDocuments(params: DocumentListParams = {}) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => api.get<DocumentListResponse>("/documents", params),
  });
}

/**
 * Fetch a single document with versions
 */
export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ["documents", documentId],
    queryFn: () => api.get<Document>(`/documents/${documentId}`),
    enabled: !!documentId,
  });
}

/**
 * Upload a new document
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadDocumentData) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("entityType", data.entityType);
      formData.append("entityId", data.entityId);
      formData.append("documentType", data.documentType);
      formData.append("title", data.title);
      if (data.accessClass) {
        formData.append("accessClass", data.accessClass);
      }

      // Use fetch directly for file upload with progress
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (document: Document) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.setQueryData(["documents", document.id], document);
    },
  });
}

/**
 * Get download URL for a document
 */
export function useDocumentDownloadUrl(documentId: string | undefined) {
  return useQuery({
    queryKey: ["documents", documentId, "download"],
    queryFn: () =>
      api.get<DownloadUrlResponse>(`/documents/${documentId}/download`),
    enabled: !!documentId,
    staleTime: 0, // Always fetch fresh URL
  });
}

/**
 * Download a document
 */
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await api.get<DownloadUrlResponse>(
        `/documents/${documentId}/download`
      );
      
      // Trigger download
      const link = document.createElement("a");
      link.href = response.url;
      link.download = response.filename;
      link.click();
      
      return response;
    },
  });
}

/**
 * Create a new version of a document
 */
export function useCreateDocumentVersion(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/versions`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Version upload failed");
      }

      return response.json();
    },
    onSuccess: (document: Document) => {
      queryClient.invalidateQueries({ queryKey: ["documents", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.setQueryData(["documents", documentId], document);
    },
  });
}

/**
 * Delete a document (archive)
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      api.delete<{ success: boolean; message: string }>(
        `/documents/${documentId}`
      ),
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.removeQueries({ queryKey: ["documents", documentId] });
    },
  });
}

/**
 * Get documents by entity
 */
export function useDocumentsByEntity(
  entityType: string | undefined,
  entityId: string | undefined
) {
  return useQuery({
    queryKey: ["documents", "entity", entityType, entityId],
    queryFn: () =>
      api.get<DocumentListResponse>("/documents", {
        entityType,
        entityId,
      }),
    enabled: !!entityType && !!entityId,
  });
}

/**
 * Get documents by type
 */
export function useDocumentsByType(documentType: string | undefined) {
  return useQuery({
    queryKey: ["documents", "type", documentType],
    queryFn: () =>
      api.get<DocumentListResponse>("/documents", {
        documentType,
      }),
    enabled: !!documentType,
  });
}
