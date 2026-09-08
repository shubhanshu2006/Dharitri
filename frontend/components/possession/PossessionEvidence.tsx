"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  EmptyState,
} from "@/components/ui";
import { FileText, Image, Download, ExternalLink } from "lucide-react";

interface EvidenceDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface PossessionEvidenceProps {
  documents?: EvidenceDocument[];
  readonly?: boolean;
  onUpload?: (files: FileList) => void;
}

/**
 * PossessionEvidence Component
 * Displays evidence documents/photos for possession records
 * 
 * Note: Full document management will be implemented in Phase 35
 * This is a placeholder component showing the structure
 */
export function PossessionEvidence({
  documents = [],
  readonly = false,
  onUpload,
}: PossessionEvidenceProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUpload) {
      onUpload(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Instrument_Sans']">
            Evidence & Documentation
          </CardTitle>
          <Badge className="bg-gray-100 text-gray-700">
            {documents.length} file{documents.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No evidence documents"
            description={
              readonly
                ? "No documents have been uploaded for this possession record"
                : "Upload photos and documents as evidence of possession"
            }
          />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = doc.url;
                      link.download = doc.name;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!readonly && onUpload && (
          <div className="mt-4">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="evidence-upload"
            />
            <label htmlFor="evidence-upload">
              <Button variant="outline" className="w-full" onClick={(e) => {
                e.preventDefault();
                document.getElementById('evidence-upload')?.click();
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Supported: Images, PDF, Word documents
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
