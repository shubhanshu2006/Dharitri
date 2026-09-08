"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  usePossessionRecord,
  useRecordPossession,
  useIssuePossessionNotice,
  useMarkPossessionReady,
} from "@/hooks/usePossession";
import { CanView, useCanDo } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import {
  PossessionStatus,
  POSSESSION_STATUS_LABELS,
  POSSESSION_STATUS_DESCRIPTIONS,
  canIssueNotice,
  canMarkReady,
  canRecordPossession,
} from "@/lib/constants/possession";
import { PossessionStatusBadge } from "@/components/possession/PossessionStatusBadge";
import { PossessionChecklist } from "@/components/possession/PossessionChecklist";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import {
  ArrowLeft,
  Home,
  FileText,
  Calendar,
  MapPin,
  User,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function PossessionDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [possessionDate, setPossessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: possession, isLoading, error } = usePossessionRecord(caseId);
  const recordMutation = useRecordPossession(caseId);
  const issueMutation = useIssuePossessionNotice(caseId);
  const readyMutation = useMarkPossessionReady(possession?.id || "");

  const canUpdate = useCanDo({ permission: Permission.POSSESSION_UPDATE });
  const canRecord = useCanDo({ permission: Permission.POSSESSION_RECORD });

  const handleIssueNotice = async () => {
    try {
      await issueMutation.mutateAsync();
      toast.success("Possession notice issued successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to issue notice"
      );
    }
  };

  const handleMarkReady = async () => {
    try {
      await readyMutation.mutateAsync();
      toast.success("Possession marked as ready");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to mark ready"
      );
    }
  };

  const handleRecordPossession = async () => {
    try {
      await recordMutation.mutateAsync({
        possessionDate,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        remarks: remarks || undefined,
      });
      toast.success("Possession recorded successfully");
      setIsRecordDialogOpen(false);
      setPossessionDate(new Date().toISOString().split("T")[0]);
      setLatitude("");
      setLongitude("");
      setRemarks("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to record possession"
      );
    }
  };

  if (isLoading) {
    return <Loading text="Loading possession details..." />;
  }

  if (error || !possession) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/possession">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Possession Records
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load possession record"
          message={
            error instanceof Error
              ? error.message
              : "Possession record not found"
          }
        />
      </div>
    );
  }

  const possessionStatus = possession.status as PossessionStatus;
  const showIssueNotice = canUpdate && canIssueNotice(possessionStatus);
  const showMarkReady = canUpdate && canMarkReady(possessionStatus);
  const showRecordPossession = canRecord && canRecordPossession(possessionStatus);

  const completedItems =
    possession.checklistItems?.filter(
      (item) => item.status === "PASS" || item.status === "NOT_APPLICABLE"
    ).length || 0;
  const totalItems = possession.checklistItems?.length || 0;
  const allChecklistComplete = completedItems === totalItems && totalItems > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/possession">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Possession Records
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              Possession Details
            </h1>
            <p className="text-gray-600 mt-1">
              Land possession tracking and management
            </p>
          </div>
          <div className="flex gap-2">
            {showIssueNotice && (
              <Button
                onClick={handleIssueNotice}
                disabled={issueMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bell className="h-4 w-4 mr-2" />
                {issueMutation.isPending ? "Issuing..." : "Issue Notice"}
              </Button>
            )}
            {showMarkReady && (
              <Button
                onClick={handleMarkReady}
                disabled={readyMutation.isPending || !allChecklistComplete}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {readyMutation.isPending ? "Marking..." : "Mark Ready"}
              </Button>
            )}
            {showRecordPossession && (
              <Button
                onClick={() => setIsRecordDialogOpen(true)}
                disabled={!allChecklistComplete}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Record Possession
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {!allChecklistComplete && possessionStatus !== PossessionStatus.RECORDED && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="font-medium">Checklist incomplete</p>
            <p className="text-sm">
              Complete all checklist items to proceed with possession recording.
            </p>
          </div>
        </Alert>
      )}

      {/* Record Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-['Instrument_Sans']">
              Record Overview
            </CardTitle>
            <PossessionStatusBadge status={possession.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span>Acquisition Case ID</span>
                </div>
                <p className="font-mono text-sm">{possession.acquisitionCaseId}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Home className="h-4 w-4" />
                  <span>Parcel</span>
                </div>
                <p className="text-sm">
                  {/* @ts-ignore */}
                  {possession.acquisitionCase?.acquisitionParcel?.cadastralParcel
                    ?.parcelId || "N/A"}
                </p>
              </div>

              {possession.possessionDate && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Possession Date</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDate(possession.possessionDate)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <p className="text-sm mt-2">
                  {POSSESSION_STATUS_DESCRIPTIONS[possessionStatus]}
                </p>
              </div>

              {possession.latitude && possession.longitude && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>GPS Location</span>
                  </div>
                  <p className="font-mono text-sm">
                    {possession.latitude}, {possession.longitude}
                  </p>
                </div>
              )}

              {possession.recordedById && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span>Recorded By</span>
                  </div>
                  {/* @ts-ignore */}
                  <p className="text-sm">{possession.recordedBy?.name || "Unknown"}</p>
                </div>
              )}
            </div>
          </div>

          {possession.remarks && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-2">Remarks</h3>
              <p className="text-sm text-gray-700">{possession.remarks}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(possession.createdAt)}</span>
              </div>

              {possession.possessionDate && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-600">Possession Recorded:</span>
                  <span className="font-medium">
                    {formatDate(possession.possessionDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      {possession.checklistItems && possession.checklistItems.length > 0 && (
        <PossessionChecklist
          items={possession.checklistItems}
          possessionStatus={possession.status}
          readonly={!canUpdate}
        />
      )}

      {/* Record Possession Dialog */}
      <Dialog
        open={isRecordDialogOpen}
        onOpenChange={setIsRecordDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Instrument_Sans']">
              Record Possession
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Possession Date *
              </label>
              <input
                type="date"
                value={possessionDate}
                onChange={(e) => setPossessionDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="28.6139"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="77.2090"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any relevant notes about the possession..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRecordDialogOpen(false)}
              disabled={recordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecordPossession}
              disabled={recordMutation.isPending || !possessionDate}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {recordMutation.isPending ? "Recording..." : "Record Possession"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
