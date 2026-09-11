"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useCompensationAssessment,
  useSubmitCompensationAssessment,
  useApproveCompensationAssessment,
  useRequestCompensationCorrection,
} from "@/hooks/useCompensation";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { CompensationStatusBadge } from "@/components/compensation/CompensationStatusBadge";
import { CompensationCalculation } from "@/components/compensation/CompensationCalculation";
import { CorrectionDialog } from "@/components/compensation/CorrectionDialog";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  ErrorMessage,
  Alert,
  ConfirmModal,
} from "@/components/ui";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Home,
} from "lucide-react";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default function CompensationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: assessment, isLoading, error } = useCompensationAssessment(id);

  const submitMutation = useSubmitCompensationAssessment(id);
  const approveMutation = useApproveCompensationAssessment(id);
  const correctionMutation = useRequestCompensationCorrection(id);

  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const handleConfirmSubmit = async () => {
    try {
      await submitMutation.mutateAsync();
      toast.success("Compensation assessment submitted for statutory review");
      setShowSubmitConfirm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit assessment");
    }
  };

  const handleConfirmApprove = async () => {
    try {
      await approveMutation.mutateAsync();
      toast.success("Compensation assessment successfully approved");
      setShowApproveConfirm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve assessment");
    }
  };

  const handleRequestCorrection = async (reason: string) => {
    try {
      await correctionMutation.mutateAsync({ reason });
      toast.success("Correction request dispatched to assessing officer");
      setShowCorrectionDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to request correction");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading compensation assessment..." size="lg" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/compensation">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Assessments
          </Button>
        </Link>
        <ErrorMessage
          title="Assessment not found"
          message="The compensation assessment you're looking for doesn't exist or you don't have access to it."
        />
      </div>
    );
  }

  const canSubmit = assessment.status === "DRAFT";
  const canApprove = assessment.status === "SUBMITTED";
  const canRequestCorrection =
    assessment.status === "SUBMITTED" || assessment.status === "UNDER_REVIEW";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/compensation">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Assessments
          </Button>
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
                Compensation Assessment
              </h1>
              <CompensationStatusBadge status={assessment.status} />
            </div>
            <p className="text-muted">Assessment ID: {assessment.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <CanView permission={Permission.COMPENSATION_SUBMIT}>
              {canSubmit && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-4 h-4" />}
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </CanView>

            <CanView permission={Permission.COMPENSATION_APPROVE}>
              {canApprove && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => setShowApproveConfirm(true)}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              )}
            </CanView>

            <CanView permission={Permission.COMPENSATION_APPROVE}>
              {canRequestCorrection && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  onClick={() => setShowCorrectionDialog(true)}
                >
                  Request Correction
                </Button>
              )}
            </CanView>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitMutation.isSuccess && (
        <Alert variant="success" dismissible onDismiss={() => submitMutation.reset()}>
          Assessment submitted successfully.
        </Alert>
      )}

      {submitMutation.isError && (
        <Alert variant="danger" dismissible onDismiss={() => submitMutation.reset()}>
          Failed to submit assessment. Please try again.
        </Alert>
      )}

      {approveMutation.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => approveMutation.reset()}
        >
          Assessment approved successfully.
        </Alert>
      )}

      {approveMutation.isError && (
        <Alert variant="danger" dismissible onDismiss={() => approveMutation.reset()}>
          Failed to approve assessment. Please try again.
        </Alert>
      )}

      {correctionMutation.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => correctionMutation.reset()}
        >
          Correction request submitted successfully.
        </Alert>
      )}

      {correctionMutation.isError && (
        <Alert
          variant="danger"
          dismissible
          onDismiss={() => correctionMutation.reset()}
        >
          Failed to submit correction request. Please try again.
        </Alert>
      )}

      {/* Assessment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Assessment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Assessment ID
                  </p>
                  <p className="text-base font-mono text-text text-sm">
                    {assessment.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">Status</p>
                  <CompensationStatusBadge status={assessment.status} />
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Acquisition Case
                  </p>
                  <Link
                    href={`/dashboard/acquisition/${assessment.acquisitionCaseId}`}
                    className="text-base text-emerald-600 hover:text-emerald-700 font-mono text-sm"
                  >
                    {assessment.acquisitionCaseId.slice(0, 12)}...
                  </Link>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Assessed By
                  </p>
                  <p className="text-base text-text">
                    {assessment.assessedByName || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Assessed At
                  </p>
                  <p className="text-base text-text">
                    {formatDateTime(assessment.assessedAt)}
                  </p>
                </div>

                {assessment.approvedByName && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Approved By
                    </p>
                    <p className="text-base text-text">
                      {assessment.approvedByName}
                    </p>
                  </div>
                )}

                {assessment.approvedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Approved At
                    </p>
                    <p className="text-base text-text">
                      {formatDateTime(assessment.approvedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compensation Calculation */}
          <CompensationCalculation
            landValue={assessment.landValue}
            solatium={assessment.solatium}
            interest={assessment.interest}
            otherComponents={assessment.otherComponents}
            deductions={assessment.deductions}
            totalAmount={assessment.totalAmount}
          />

          {/* Award Information */}
          {assessment.award && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Award Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Award Number
                    </p>
                    <p className="text-base font-mono text-text">
                      {assessment.award.awardNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Awarded Amount
                    </p>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatCurrency(assessment.award.awardedAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Award Status
                    </p>
                    <CompensationStatusBadge
                      status={assessment.award.status}
                      size="sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/acquisition/${assessment.acquisitionCaseId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Acquisition Case
                </Button>
              </Link>

              <CanView permission={Permission.PAYMENT_VIEW}>
                <Link href={`/dashboard/payments?assessment=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Payments
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.RR_VIEW}>
                <Link href={`/dashboard/rr?assessment=${id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    R&R Cases
                  </Button>
                </Link>
              </CanView>

              <CanView permission={Permission.DOCUMENT_VIEW}>
                <Link href={`/dashboard/documents?compensation=${id}`}>
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

      {/* Correction Dialog */}
      {showCorrectionDialog && (
        <CorrectionDialog
          onRequestCorrection={handleRequestCorrection}
          onClose={() => setShowCorrectionDialog(false)}
          isSubmitting={correctionMutation.isPending}
        />
      )}

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Assessment for Review"
        description="Are you sure you want to submit this compensation assessment for statutory supervisory review? Once submitted, values cannot be altered without a formal correction request."
        variant="emerald"
        confirmText="Submit for Review"
        isLoading={submitMutation.isPending}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleConfirmApprove}
        title="Approve Statutory Assessment"
        description="Are you sure you want to formally approve this compensation award? This will finalize the valuation and unlock treasury disbursement authorization."
        variant="emerald"
        confirmText="Approve Award"
        isLoading={approveMutation.isPending}
      />
    </div>
  );
}
