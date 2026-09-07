"use client";

import { use } from "react";
import Link from "next/link";
import {
  useParcel,
  useParcelTimeline,
  useParcelLandRecord,
  useSyncParcel,
} from "@/hooks/useParcels";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import { ParcelTimeline } from "@/components/parcels/ParcelTimeline";
import { LandRecordDisplay } from "@/components/parcels/LandRecordDisplay";
import { ParcelDocuments } from "@/components/parcels/ParcelDocuments";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  ErrorMessage,
  Badge,
  Alert,
} from "@/components/ui";
import {
  ArrowLeft,
  MapPin,
  Ruler,
  FileText,
  Map as MapIcon,
  Building2,
} from "lucide-react";
import { formatDate, formatArea } from "@/lib/utils";
import {
  ACQUISITION_STATUS_LABELS,
  AcquisitionStatus,
} from "@/lib/constants/parcels";

export default function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: parcel, isLoading, error } = useParcel(id);
  const { data: timeline, isLoading: timelineLoading } = useParcelTimeline(id);
  const { data: landRecord, isLoading: landRecordLoading } =
    useParcelLandRecord(id);

  const syncParcel = useSyncParcel(id);

  const handleSync = async () => {
    try {
      await syncParcel.mutateAsync();
    } catch (error) {
      console.error("Failed to sync parcel:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading parcel details..." size="lg" />
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/parcels">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Parcels
          </Button>
        </Link>
        <ErrorMessage
          title="Parcel not found"
          message="The parcel you're looking for doesn't exist or you don't have access to it."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/parcels">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Parcels
          </Button>
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
                {parcel.surveyNumber || parcel.referenceId}
              </h1>
              <ParcelStatusBadge status={parcel.status} />
            </div>
            <p className="text-muted">Parcel ID: {parcel.referenceId}</p>
          </div>

          <div className="flex items-center gap-2">
            <CanView permission={Permission.GIS_VIEW}>
              <Link href={`/dashboard/gis?parcel=${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<MapIcon className="w-4 h-4" />}
                >
                  View on Map
                </Button>
              </Link>
            </CanView>
          </div>
        </div>
      </div>

      {/* Sync Success */}
      {syncParcel.isSuccess && (
        <Alert variant="success" dismissible onDismiss={() => syncParcel.reset()}>
          Parcel data synced successfully from source system.
        </Alert>
      )}

      {/* Sync Error */}
      {syncParcel.isError && (
        <Alert variant="danger" dismissible onDismiss={() => syncParcel.reset()}>
          Failed to sync parcel data. Please try again.
        </Alert>
      )}

      {/* Parcel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Parcel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Reference ID
                  </p>
                  <p className="text-base font-mono text-text">
                    {parcel.referenceId}
                  </p>
                </div>

                {parcel.surveyNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Survey Number
                    </p>
                    <p className="text-base text-text">{parcel.surveyNumber}</p>
                  </div>
                )}

                {parcel.ulpin && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">ULPIN</p>
                    <p className="text-base font-mono text-text text-sm">
                      {parcel.ulpin}
                    </p>
                  </div>
                )}

                {parcel.area && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Area</p>
                    <p className="text-2xl font-bold text-text">
                      {formatArea(parcel.area, parcel.areaUnit || "sqm")}
                    </p>
                  </div>
                )}

                {parcel.landCategory && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Land Category
                    </p>
                    <p className="text-base text-text">{parcel.landCategory}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Workflow Status */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {parcel.verificationStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Verification
                    </p>
                    <Badge variant="info">
                      {parcel.verificationStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}

                {parcel.acquisitionStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Acquisition
                    </p>
                    <Badge variant="default">
                      {ACQUISITION_STATUS_LABELS[
                        parcel.acquisitionStatus as AcquisitionStatus
                      ] || parcel.acquisitionStatus}
                    </Badge>
                  </div>
                )}

                {parcel.compensationStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Compensation
                    </p>
                    <Badge variant="default">
                      {parcel.compensationStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}

                {parcel.paymentStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Payment</p>
                    <Badge variant="default">
                      {parcel.paymentStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}

                {parcel.rrStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">R&R</p>
                    <Badge variant="default">
                      {parcel.rrStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}

                {parcel.possessionStatus && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Possession
                    </p>
                    <Badge variant="default">
                      {parcel.possessionStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted mb-1">Created</p>
                  <p className="text-text">{formatDate(parcel.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted mb-1">Last Updated</p>
                  <p className="text-text">{formatDate(parcel.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <ParcelTimeline events={timeline} isLoading={timelineLoading} />

          {/* Documents */}
          <CanView permission={Permission.DOCUMENT_VIEW}>
            <ParcelDocuments parcelId={id} />
          </CanView>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <CanView permission={Permission.VERIFICATION_VIEW}>
                <Link href={`/dashboard/verification?parcel=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Verification
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.COMPENSATION_VIEW}>
                <Link href={`/dashboard/compensation?parcel=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Compensation
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.DOCUMENT_VIEW}>
                <Link href={`/dashboard/documents?parcel=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                </Link>
              </CanView>
            </CardContent>
          </Card>

          {/* Land Record */}
          <LandRecordDisplay
            landRecord={landRecord}
            isLoading={landRecordLoading}
            onSync={handleSync}
            isSyncing={syncParcel.isPending}
          />
        </div>
      </div>
    </div>
  );
}
