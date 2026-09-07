"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useVerificationCase,
  useRunVerification,
  useApproveVerification,
  useRequestCorrection,
} from "@/hooks/useVerification";
import { CanView } from "@/components/auth";
import { Permission } from "@/lib/constants/permissions";
import { VerificationStatusBadge } from "@/components/verification/VerificationStatusBadge";
import { VerificationResults } from "@/components/verification/VerificationResults";
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
import { ArrowLeft, Play, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function VerificationCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: verificationCase, isLoading, error } = useVerificationCase(id);

  const runVerification = useRunVerification(id);
  const approveVerification = useApproveVerification(id);
  const requestCorrection = useRequestCorrection(id);

  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");

  const handleRunVerification = async () => {
    try {
      await runVerification.mutateAsync();
    } catch (error) {
      console.error("Failed to run verification:", error);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this verification case?"))
      return;

    try {
      await approveVerification.mutateAsync();
    } catch (error) {
      console.error("Failed to approve verification:", error);
    }
  };

  const handleRequestCorrection = async () => {
    if (!correctionReason.trim()) {
      alert("Please provide a reason for requesting correction");
      return;
    }

    try {
      await requestCorrection.mutateAsync({ reason: correctionReason });
      setShowCorrectionDialog(false);
      setCorrectionReason("");
    } catch (error) {
      console.error("Failed to request correction:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading verification case..." size="lg" />
      </div>
    );
  }

  if (error || !verificationCase) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/verification">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Verification Cases
          </Button>
        </Link>
        <ErrorMessage
          title="Verification case not found"
          message="The verification case you're looking for doesn't exist or you don't have access to it."
        />
      </div>
    );
  }

  const canRunVerification =
    verificationCase.status === "PENDING" ||
    verificationCase.status === "IN_PROGRESS";
  const canApprove = verificationCase.status === "PASS";
  const canRequestCorrection =
    verificationCase.status === "FAIL" ||
    verificationCase.status === "WARNING";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/verification">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Verification Cases
          </Button>
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)]">
                Verification Case
              </h1>
              <VerificationStatusBadge status={verificationCase.status} />
            </div>
            <p className="text-muted">Case ID: {verificationCase.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <CanView permission={Permission.VERIFICATION_RUN}>
              {canRunVerification && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-4 h-4" />}
                  onClick={handleRunVerification}
                  disabled={runVerification.isPending}
                >
                  {runVerification.isPending ? "Running..." : "Run Checks"}
                </Button>
              )}
            </CanView>

            <CanView permission={Permission.VERIFICATION_APPROVE}>
              {canApprove && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleApprove}
                  disabled={approveVerification.isPending}
                >
                  {approveVerification.isPending ? "Approving..." : "Approve"}
                </Button>
              )}
            </CanView>

            <CanView permission={Permission.VERIFICATION_REQUEST_CORRECTION}>
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
      {runVerification.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => runVerification.reset()}
        >
          Verification checks completed successfully.
        </Alert>
      )}

      {runVerification.isError && (
        <Alert variant="danger" dismissible onDismiss={() => runVerification.reset()}>
          Failed to run verification checks. Please try again.
        </Alert>
      )}

      {approveVerification.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => approveVerification.reset()}
        >
          Verification case approved successfully.
        </Alert>
      )}

      {approveVerification.isError && (
        <Alert
          variant="danger"
          dismissible
          onDismiss={() => approveVerification.reset()}
        >
          Failed to approve verification case. Please try again.
        </Alert>
      )}

      {requestCorrection.isSuccess && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => requestCorrection.reset()}
        >
          Correction request submitted successfully.
        </Alert>
      )}

      {requestCorrection.isError && (
        <Alert
          variant="danger"
          dismissible
          onDismiss={() => requestCorrection.reset()}
        >
          Failed to submit correction request. Please try again.
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
                    {verificationCase.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted mb-1">
                    Acquisition Case
                  </p>
                  <Link
                    href={`/dashboard/acquisition/${verificationCase.acquisitionCaseId}`}
                    className="text-base text-emerald-600 hover:text-emerald-700 font-mono text-sm"
                  >
                    {verificationCase.acquisitionCaseId.slice(0, 12)}...
                  </Link>
                </div>

                {verificationCase.assignedUserName && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Assigned To
                    </p>
                    <p className="text-base text-text">
                      {verificationCase.assignedUserName}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted mb-1">Created</p>
                  <p className="text-base text-text">
                    {formatDateTime(verificationCase.createdAt)}
                  </p>
                </div>

                {verificationCase.startedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Started</p>
                    <p className="text-base text-text">
                      {formatDateTime(verificationCase.startedAt)}
                    </p>
                  </div>
                )}

                {verificationCase.completedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">
                      Completed
                    </p>
                    <p className="text-base text-text">
                      {formatDateTime(verificationCase.completedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Results */}
          <VerificationResults
            results={verificationCase.results}
            isLoading={false}
          />
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/dashboard/acquisition/${verificationCase.acquisitionCaseId}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  View Acquisition Case
                </Button>
              </Link>

              <CanView permission={Permission.DOCUMENT_VIEW}>
                <Link
                  href={`/dashboard/documents?verification=${verificationCase.id}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    View Documents
                  </Button>
                </Link>
              </CanView>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Correction Dialog */}
      {showCorrectionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Request Correction</CardTitle>
                <button
                  onClick={() => setShowCorrectionDialog(false)}
                  className="text-muted hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Reason for Correction
                </label>
                <textarea
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  rows={4}
                  placeholder="Describe what needs to be corrected..."
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestCorrection}
                  disabled={requestCorrection.isPending || !correctionReason.trim()}
                  className="flex-1"
                >
                  {requestCorrection.isPending
                    ? "Submitting..."
                    : "Submit Request"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCorrectionDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
