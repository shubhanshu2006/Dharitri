"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useAcquisitionCase,
  useAcquisitionHistory,
  useTransitionAcquisition,
} from "@/hooks/useAcquisition";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { AcquisitionStatusBadge } from "@/components/acquisition/AcquisitionStatusBadge";
import { StatusTransitionDialog } from "@/components/acquisition/StatusTransitionDialog";
import { AcquisitionTimeline } from "@/components/acquisition/AcquisitionTimeline";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  ErrorMessage,
  Alert,
} from "@/components/ui";
import {
  ArrowLeft,
  RefreshCw,
  MapPin,
  FileText,
  CheckCircle2,
  DollarSign,
  Home,
  FlagTriangleRight,
} from "lucide-react";
import { formatDateTime, formatArea } from "@/lib/utils";

export default function AcquisitionCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: acquisitionCase, isLoading, error } = useAcquisitionCase(id);
  const { data: statusHistory, isLoading: historyLoading } =
    useAcquisitionHistory(id);

  const transitionMutation = useTransitionAcquisition(id);

  const [showTransitionDialog, setShowTransitionDialog] = useState(false);

  const handleTransition = async (toStatus: string, reason?: string) => {
    try {
      await transitionMutation.mutateAsync({ toStatus, reason });
      setShowTransitionDialog(false);
    } catch (error) {
      console.error("Failed to transition status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading acquisition case..." size="lg" />
      </div>
    );
  }

  if (error || !acquisitionCase) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/acquisition">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Acquisition Cases
          </Button>
        </Link>
        <ErrorMessage
          title="Acquisition case not found"
          message="The acquisition case you're looking for doesn't exist or you don't have access to it."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/acquisition">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Acquisition Cases
          </Button>
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
                Acquisition Case
              </h1>
              <AcquisitionStatusBadge status={acquisitionCase.status} />
            </div>
            <p className="text-muted">Case ID: {acquisitionCase.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <CanView permission={Permission.ACQUISITION_TRANSITION}>
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => setShowTransitionDialog(true)}
              >
                Change Status
              </Button>
            </CanView>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {transitionMutation.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => transitionMutation.reset()}
        >
          Status transition completed successfully.
        </Alert>
      )}

      {transitionMutation.isError && (
        <Alert
          variant="danger"
          dismissible
          onDismiss={() => transitionMutation.reset()}
        >
          Failed to transition status. Please try again.
        </Alert>
      )}

      {/* Case Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">Case ID</p>
                  <p className="text-base font-mono text-text text-sm">
                    {acquisitionCase.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">Status</p>
                  <AcquisitionStatusBadge status={acquisitionCase.status} />
                </div>

                {acquisitionCase.currentAssigneeName && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Assigned To
                    </p>
                    <p className="text-base text-text">
                      {acquisitionCase.currentAssigneeName}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted mb-1">Created</p>
                  <p className="text-base text-text">
                    {formatDateTime(acquisitionCase.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Last Updated
                  </p>
                  <p className="text-base text-text">
                    {formatDateTime(acquisitionCase.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcel Information */}
          {acquisitionCase.acquisitionParcel && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Parcel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Acquisition Reference
                    </p>
                    <p className="text-base text-text">
                      {acquisitionCase.acquisitionParcel.acquisitionReference}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Required Area
                    </p>
                    <p className="text-base text-text">
                      {formatArea(
                        acquisitionCase.acquisitionParcel.requiredAreaSqMeters,
                        "sqm"
                      )}
                    </p>
                  </div>

                  {acquisitionCase.acquisitionParcel.landCategory && (
                    <div>
                      <p className="text-sm font-medium text-muted mb-1">
                        Land Category
                      </p>
                      <p className="text-base text-text">
                        {acquisitionCase.acquisitionParcel.landCategory}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Parcel ID
                    </p>
                    <Link
                      href={`/dashboard/parcels/${acquisitionCase.acquisitionParcel.cadastralParcelId}`}
                      className="text-base text-emerald-600 hover:text-emerald-700 font-mono text-sm"
                    >
                      {acquisitionCase.acquisitionParcel.cadastralParcelId.slice(
                        0,
                        12
                      )}
                      ...
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status History */}
          <AcquisitionTimeline
            transitions={statusHistory}
            isLoading={historyLoading}
          />
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <CanView permission={Permission.PARCEL_VIEW}>
                {acquisitionCase.acquisitionParcel && (
                  <Link
                    href={`/dashboard/parcels/${acquisitionCase.acquisitionParcel.cadastralParcelId}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View Parcel
                    </Button>
                  </Link>
                )}
              </CanView>

              <CanView permission={Permission.VERIFICATION_VIEW}>
                <Link href={`/dashboard/verification?acquisition=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verification
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.COMPENSATION_VIEW}>
                <Link href={`/dashboard/compensation?acquisition=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Compensation
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.RR_VIEW}>
                <Link href={`/dashboard/rr?acquisition=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    R&R
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.POSSESSION_VIEW}>
                <Link href={`/dashboard/possession?acquisition=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FlagTriangleRight className="w-4 h-4 mr-2" />
                    Possession
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.DOCUMENT_VIEW}>
                <Link href={`/dashboard/documents?acquisition=${id}`}>
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
        </div>
      </div>

      {/* Status Transition Dialog */}
      {showTransitionDialog && (
        <StatusTransitionDialog
          currentStatus={acquisitionCase.status}
          onTransition={handleTransition}
          onClose={() => setShowTransitionDialog(false)}
          isTransitioning={transitionMutation.isPending}
        />
      )}
    </div>
  );
}
