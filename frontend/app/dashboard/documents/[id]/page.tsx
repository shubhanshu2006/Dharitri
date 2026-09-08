"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useDocument, useDeleteDocument } from "@/hooks/useDocuments";
import { CanView, useCanDo } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import {
  Card,
  CardContent,
  Loading,
  ErrorMessage,
  Button,
  Alert,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { ArrowLeft, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: document, isLoading, error, refetch } = useDocument(id);
  const deleteMutation = useDeleteDocument();
  const canDelete = useCanDo({ permission: Permission.DOCUMENT_DELETE });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Document archived successfully");
      router.push("/dashboard/documents");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to archive document"
      );
    }
  };

  const handleVersionUpload = () => {
    refetch();
  };

  if (isLoading) {
    return <Loading text="Loading document..." />;
  }

  if (error || !document) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/documents">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load document"
          message={
            error instanceof Error ? error.message : "Document not found"
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/documents">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              Document Details
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage document information
            </p>
          </div>
          {canDelete && document.status !== "ARCHIVED" && (
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Archive Document
            </Button>
          )}
        </div>
      </div>

      {/* Document Viewer */}
      <DocumentViewer document={document} onVersionUpload={handleVersionUpload} />

      {/* Entity Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-3">Related Entity</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entity Type</p>
                <p className="font-medium">{document.entityType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entity ID</p>
                <p className="font-mono text-sm">{document.entityId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Instrument_Sans'] flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Archive Document?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Are you sure you want to archive this document? The document will be
              marked as archived and will no longer appear in active listings.
            </p>
            
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-medium">This action can be reversed</p>
                <p className="text-sm">
                  Archived documents can be restored by an administrator if needed.
                </p>
              </div>
            </Alert>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Document: {document.title}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {document.id}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? "Archiving..." : "Archive Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
