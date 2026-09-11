"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRRCase, useTransitionRRCase } from "@/hooks/useRR";
import { CanView, useCanDo } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { RRStatus, RR_STATUS_LABELS, RR_STATUS_DESCRIPTIONS } from "@/lib/constants/rr";
import { RRStatusBadge } from "@/components/rr/RRStatusBadge";
import { RREntitlements } from "@/components/rr/RREntitlements";
import { RRStatusTransition } from "@/components/rr/RRStatusTransition";
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
  Users,
  Building2,
  FileText,
  Calendar,
  CheckCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function RRCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);

  const { data: rrCase, isLoading, error } = useRRCase(id);
  const transitionMutation = useTransitionRRCase(id);
  const canApprove = useCanDo({ permission: Permission.RR_APPROVE });
  const canCreate = useCanDo({ permission: Permission.RR_CREATE });

  const handleStatusTransition = async (targetStatus: RRStatus) => {
    try {
      await transitionMutation.mutateAsync({ targetStatus });
      toast.success("Status transitioned successfully");
      setIsTransitionDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to transition status"
      );
    }
  };

  if (isLoading) {
    return <Loading text="Loading R&R case details..." />;
  }

  if (error || !rrCase) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/rr">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to R&R Cases
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load R&R case"
          message={error instanceof Error ? error.message : "Case not found"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/rr">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to R&R Cases
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Instrument_Sans']">
              R&R Case Details
            </h1>
            <p className="text-gray-600 mt-1">
              Rehabilitation & Resettlement case management
            </p>
          </div>
          {canApprove && (
            <Button
              onClick={() => setIsTransitionDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Transition Status
            </Button>
          )}
        </div>
      </div>

      {/* Case Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-['Instrument_Sans']">
              Case Overview
            </CardTitle>
            <RRStatusBadge status={rrCase.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span>Family ID</span>
                </div>
                <p className="font-mono text-sm">{rrCase.familyId}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span>Project ID</span>
                </div>
                <p className="font-mono text-sm">{rrCase.projectId}</p>
              </div>

              {rrCase.acquisitionCaseId && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FileText className="h-4 w-4" />
                    <span>Acquisition Case ID</span>
                  </div>
                  <p className="font-mono text-sm">{rrCase.acquisitionCaseId}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Applicable for R&R</p>
                <Badge
                  className={
                    rrCase.applicable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {rrCase.applicable ? "Yes" : "No"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <p className="text-sm mt-2">
                  {RR_STATUS_DESCRIPTIONS[rrCase.status as RRStatus]}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(rrCase.createdAt)}</span>
              </div>

              {rrCase.assessmentCompletedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-600">Assessment Completed:</span>
                  <span className="font-medium">
                    {formatDate(rrCase.assessmentCompletedAt)}
                  </span>
                </div>
              )}

              {rrCase.approvedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-600">Approved:</span>
                  <span className="font-medium">
                    {formatDate(rrCase.approvedAt)}
                  </span>
                </div>
              )}

              {rrCase.completedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">
                    {formatDate(rrCase.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entitlements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-['Instrument_Sans']">
            Entitlements
          </h2>
          {canCreate && (
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Entitlement
            </Button>
          )}
        </div>
        <RREntitlements entitlements={rrCase.entitlements || []} />
      </div>

      {/* Status Transition Dialog */}
      <RRStatusTransition
        currentStatus={rrCase.status as RRStatus}
        isOpen={isTransitionDialogOpen}
        onClose={() => setIsTransitionDialogOpen(false)}
        onTransition={handleStatusTransition}
        isLoading={transitionMutation.isPending}
      />
    </div>
  );
}
