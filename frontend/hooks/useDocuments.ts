import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Document {
  id: string;
  entityType: string;
  entityId: string;
  name: string;
  description?: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category?: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: string;
  currentVersion: number;
  status?: string;
  metadata?: Record<string, any>;
}

interface DocumentsParams {
  entityType?: string;
  entityId?: string;
  category?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

interface DocumentsResponse {
  data: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch documents for an entity
 */
export function useDocuments(params: DocumentsParams) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => api.get<DocumentsResponse>("/documents", params),
    enabled: !!params.entityId,
  });
}

/**
 * Fetch single document
 */
export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ["documents", documentId],
    queryFn: () => api.get<Document>(`/documents/${documentId}`),
    enabled: !!documentId,
  });
}

/**
 * Upload document
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      data,
    }: {
      file: File;
      data: {
        entityType: string;
        entityId: string;
        name: string;
        description?: string;
        category?: string;
      };
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      return api.upload<Document>("/documents/upload", formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "documents",
          {
            entityType: variables.data.entityType,
            entityId: variables.data.entityId,
          },
        ],
      });
    },
  });
}

/**
 * Delete document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      api.delete(`/documents/${documentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
