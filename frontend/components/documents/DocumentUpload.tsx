"use client";

import { useState, useRef, DragEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
} from "@/components/ui";
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DocumentAccessClass,
  DOCUMENT_ACCESS_LABELS,
  validateFile,
  formatFileSize,
  DocumentEntityType,
  ENTITY_TYPE_LABELS,
} from "@/lib/constants/documents";
import { useUploadDocument } from "@/hooks/useDocuments";
import { Upload, X, FileText, Image, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  entityType: DocumentEntityType;
  entityId: string;
  onUploadComplete?: () => void;
  className?: string;
}

export function DocumentUpload({
  entityType,
  entityId,
  onUploadComplete,
  className,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [accessClass, setAccessClass] = useState<DocumentAccessClass>(
    DocumentAccessClass.INTERNAL
  );
  const [validationError, setValidationError] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid file");
      setSelectedFile(null);
      return;
    }

    setValidationError("");
    setSelectedFile(file);
    
    // Auto-fill title if empty
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !documentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        entityType,
        entityId,
        documentType,
        title,
        accessClass,
        file: selectedFile,
      });

      toast.success("Document uploaded successfully");
      
      // Reset form
      setSelectedFile(null);
      setTitle("");
      setDocumentType("");
      setAccessClass(DocumentAccessClass.INTERNAL);
      setValidationError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadComplete?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document"
      );
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-8 w-8 text-emerald-600" />;
    }
    return <FileText className="h-8 w-8 text-gray-600" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entity Info */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="text-gray-600">
            Uploading to: <span className="font-medium">{ENTITY_TYPE_LABELS[entityType]}</span>
          </p>
          <p className="text-gray-500 font-mono text-xs mt-1">
            ID: {entityId.slice(0, 12)}...
          </p>
        </div>

        {/* Drag and Drop Zone */}
        {!selectedFile && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300 hover:border-gray-400"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, Word, Excel, Images (max {formatFileSize(10 * 1024 * 1024)})
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
              className="hidden"
            />
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <Alert variant="danger">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p className="font-medium">Validation Error</p>
              <p className="text-sm">{validationError}</p>
            </div>
          </Alert>
        )}

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(selectedFile)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select type</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {DOCUMENT_TYPE_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Access Class */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Access Level *
                </label>
                <select
                  value={accessClass}
                  onChange={(e) => setAccessClass(e.target.value as DocumentAccessClass)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {Object.values(DocumentAccessClass).map((access) => (
                    <option key={access} value={access}>
                      {DOCUMENT_ACCESS_LABELS[access]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRemoveFile}
              disabled={uploadMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                uploadMutation.isPending ||
                !selectedFile ||
                !title ||
                !documentType
              }
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {uploadMutation.isPending ? (
                <>Uploading...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
