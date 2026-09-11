"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useFieldVisit,
  useUpdateFieldChecklistItem,
  useSubmitFieldVisit,
} from "@/hooks/useField";
import { useUploadDocument } from "@/hooks/useDocuments";
import {
  FieldVisitStatus,
  FIELD_STATUS_LABELS,
  FIELD_STATUS_COLORS,
  FieldChecklistStatus,
  canSubmitFieldVisit,
  EvidenceType,
} from "@/lib/constants/field";
import { DocumentEntityType } from "@/lib/constants/documents";
import { saveFieldVisitOffline, savePhotoOffline } from "@/lib/offline/storage";
import { generateClientOperationId } from "@/lib/offline/sync";
import { CameraCapture } from "@/components/field/CameraCapture";
import { GPSCapture } from "@/components/field/GPSCapture";
import { FieldChecklist } from "@/components/field/FieldChecklist";
import { SyncIndicator } from "@/components/field/SyncIndicator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  ErrorMessage,
  Button,
  Badge,
  Alert,
} from "@/components/ui";
import {
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  Camera,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PhotoData {
  id: string;
  blob: Blob;
  preview: string;
  timestamp: number;
}

export default function FieldVisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [gpsLocation, setGPSLocation] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { data: visit, isLoading, error, refetch } = useFieldVisit(id);
  const updateChecklistMutation = useUpdateFieldChecklistItem();
  const submitMutation = useSubmitFieldVisit(id);
  const uploadDocument = useUploadDocument();

  const handlePhotoCapture = async (blob: Blob, preview: string) => {
    const photoData: PhotoData = {
      id: generateClientOperationId(),
      blob,
      preview,
      timestamp: Date.now(),
    };

    setPhotos((prev) => [...prev, photoData]);
    setShowCamera(false);

    // Save offline
    try {
      await savePhotoOffline({
        id: photoData.id,
        visitId: id,
        blob,
        metadata: {
          timestamp: photoData.timestamp,
          gps: gpsLocation,
        },
      });
      toast.success("Photo saved offline");
    } catch (err) {
      console.error("Failed to save photo offline:", err);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast.success("Photo removed");
  };

  const handleChecklistUpdate = async (
    itemId: string,
    status: FieldChecklistStatus
  ) => {
    try {
      await updateChecklistMutation.mutateAsync({
        checklistItemId: itemId,
        status,
      });
      toast.success("Checklist updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update checklist");
    }
  };

  const handleSaveOffline = async () => {
    if (!visit) return;

    setSaving(true);
    try {
      await saveFieldVisitOffline({
        ...visit,
        gpsLocation,
        photos: photos.map((p) => p.id),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Saved offline successfully");
    } catch (error) {
      toast.error("Failed to save offline");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!visit) return;

    const checklistItems = visit.checklistItems || [];
    const evidenceCount = (visit.evidence?.length || 0) + photos.length;
    const hasGPS = !!(gpsLocation || (visit.latitude && visit.longitude));

    const canSubmit = canSubmitFieldVisit(checklistItems, evidenceCount, hasGPS);

    if (!canSubmit.can) {
      toast.error(canSubmit.reason || "Cannot submit");
      return;
    }

    try {
      // Upload photos first
      for (const photo of photos) {
        const file = new File([photo.blob], `field-photo-${photo.id}.jpg`, {
          type: "image/jpeg",
        });
        
        await uploadDocument.mutateAsync({
          file,
          entityType: DocumentEntityType.CASE,
          entityId: visit.acquisitionCaseId || visit.projectId,
          title: `Field Photo ${formatDate(new Date(photo.timestamp))}`,
          documentType: "FIELD_PHOTO",
        });
      }

      // Submit visit
      await submitMutation.mutateAsync();
      toast.success("Field visit submitted successfully");
      router.push("/dashboard/field");
    } catch (error) {
      toast.error("Failed to submit field visit");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Loading text="Loading field visit..." />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Link href="/dashboard/field">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load field visit"
          message={error instanceof Error ? error.message : "Visit not found"}
        />
      </div>
    );
  }

  const statusColors = FIELD_STATUS_COLORS[visit.status as FieldVisitStatus];
  const checklistItems = visit.checklistItems || [];
  const evidenceCount = (visit.evidence?.length || 0) + photos.length;
  const hasGPS = !!(gpsLocation || (visit.latitude && visit.longitude));
  const submissionCheck = canSubmitFieldVisit(checklistItems, evidenceCount, hasGPS);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Mobile Header - Fixed */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/dashboard/field">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Badge
              className={cn(
                "text-sm",
                statusColors.bg,
                statusColors.text
              )}
            >
              {FIELD_STATUS_LABELS[visit.status as FieldVisitStatus]}
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-['Instrument_Sans']">
            Field Verification
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {visit.id.slice(0, 16)}...
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Sync Indicator */}
        <SyncIndicator onSyncComplete={refetch} />

        {/* Submission Status */}
        {!submissionCheck.can && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p className="font-medium">Cannot submit yet</p>
              <p className="text-sm">{submissionCheck.reason}</p>
            </div>
          </Alert>
        )}

        {/* GPS Capture */}
        <GPSCapture
          onLocationCaptured={setGPSLocation}
          currentLocation={
            visit.latitude && visit.longitude
              ? {
                  latitude: visit.latitude,
                  longitude: visit.longitude,
                  accuracy: visit.gpsAccuracyMeters || 0,
                  timestamp: new Date(visit.startedAt).getTime(),
                }
              : gpsLocation
          }
        />

        {/* Checklist */}
        {checklistItems.length > 0 && (
          <FieldChecklist
            items={checklistItems}
            onUpdateItem={handleChecklistUpdate}
            readonly={visit.status !== FieldVisitStatus.IN_PROGRESS}
          />
        )}

        {/* Photos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Photos
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-800 text-base px-3 py-1">
                {evidenceCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Evidence */}
            {visit.evidence && visit.evidence.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {visit.evidence.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Photos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.preview}
                      alt="Field photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Camera Button */}
            {!showCamera ? (
              <Button
                onClick={() => setShowCamera(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                style={{ minHeight: "56px" }}
                disabled={visit.status !== FieldVisitStatus.IN_PROGRESS}
              >
                <Camera className="h-6 w-6 mr-2" />
                Add Photo
              </Button>
            ) : (
              <CameraCapture
                onCapture={handlePhotoCapture}
                onCancel={() => setShowCamera(false)}
              />
            )}
          </CardContent>
        </Card>

        {/* Visit Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Project ID</p>
              <p className="text-sm font-mono">{visit.projectId}</p>
            </div>
            {visit.acquisitionCaseId && (
              <div>
                <p className="text-xs text-gray-500">Case ID</p>
                <p className="text-sm font-mono">{visit.acquisitionCaseId}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Started</p>
              <p className="text-sm">{formatDate(visit.startedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          {/* Save Offline - Large Button */}
          <Button
            onClick={handleSaveOffline}
            disabled={saving}
            variant="outline"
            className="h-14 flex flex-col items-center justify-center"
          >
            <Save className="h-6 w-6 mb-1" />
            <span className="text-xs">
              {saving ? "Saving..." : "Save Offline"}
            </span>
          </Button>

          {/* Submit - Large Button */}
          <Button
            onClick={handleSubmit}
            disabled={!submissionCheck.can || submitMutation.isPending}
            className="h-14 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="h-6 w-6 mb-1" />
            <span className="text-xs">
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
