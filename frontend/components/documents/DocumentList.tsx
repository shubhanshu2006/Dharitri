"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  EmptyState,
} from "@/components/ui";
import {
  DocumentStatus,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_TYPE_LABELS,
  formatFileSize,
  getFileIcon,
} from "@/lib/constants/documents";
import { Document } from "@/hooks/useDocuments";
import { FileText, Download, ExternalLink, Eye, MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  onDownload?: (documentId: string) => void;
}

export function DocumentList({
  documents,
  isLoading = false,
  emptyMessage = "No documents found",
  showActions = true,
  onDownload,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="h-10 w-10 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-12 w-12" />}
        title="No documents"
        description={emptyMessage}
      />
    );
  }

  const getIconComponent = (mimeType: string) => {
    const iconName = getFileIcon(mimeType);
    switch (iconName) {
      case "Image":
        return <div className="p-2 bg-blue-100 rounded-lg"><FileText className="h-5 w-5 text-blue-600" /></div>;
      case "Table":
        return <div className="p-2 bg-green-100 rounded-lg"><FileText className="h-5 w-5 text-green-600" /></div>;
      default:
        return <div className="p-2 bg-gray-100 rounded-lg"><FileText className="h-5 w-5 text-gray-600" /></div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-['Instrument_Sans']">
          Documents
          <Badge className="ml-2 bg-gray-100 text-gray-700">
            {documents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc) => {
            const statusColors = DOCUMENT_STATUS_COLORS[doc.status as DocumentStatus];
            const fileSize = doc.currentVersion?.sizeBytes
              ? formatFileSize(Number(doc.currentVersion.sizeBytes))
              : "N/A";

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getIconComponent(doc.currentVersion?.mimeType || "")}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{doc.title}</p>
                      <Badge
                        className={cn(
                          "text-xs",
                          statusColors.bg,
                          statusColors.text
                        )}
                      >
                        {DOCUMENT_STATUS_LABELS[doc.status as DocumentStatus]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}</span>
                      <span>•</span>
                      <span>{fileSize}</span>
                      <span>•</span>
                      <span>{formatDate(doc.createdAt)}</span>
                      {doc.uploadedBy && (
                        <>
                          <span>•</span>
                          <span>{doc.uploadedBy.name}</span>
                        </>
                      )}
                    </div>
                    
                    {doc.versions && doc.versions.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Version {doc.currentVersion?.versionNumber} of {doc.versions.length}
                      </p>
                    )}
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    {onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(doc.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
