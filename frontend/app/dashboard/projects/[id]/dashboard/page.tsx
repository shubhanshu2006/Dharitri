"use client";

import { use } from "react";
import Link from "next/link";
import { useProjectDashboard } from "@/hooks/useDashboard";
import {
  formatCurrency,
  formatNumber,
  formatArea,
  calculatePercentage,
  getCompletionStatus,
} from "@/lib/constants/dashboard";
import {
  StatCard,
  MetricCard,
  ProgressBar,
  MultiProgressBar,
} from "@/components/dashboard";
import {
  Loading,
  ErrorMessage,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import {
  Building2,
  Map,
  IndianRupee,
  Users,
  Home,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Target,
} from "lucide-react";

export default function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const { data: metrics, isLoading, error, refetch } = useProjectDashboard(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Loading project dashboard..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Link href="/dashboard/executive">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load project dashboard"
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Calculate derived metrics
  const landAcquisitionPercentage = calculatePercentage(
    metrics.land.acquiredAcres,
    metrics.land.proposedAcres
  );

  const casesCompletionPercentage = calculatePercentage(
    metrics.cases.completed,
    metrics.cases.total
  );

  const milestoneCompletion = getCompletionStatus(
    metrics.milestones.completed,
    metrics.milestones.total
  );

  const paymentCompletion = calculatePercentage(
    metrics.payments.creditedAmount,
    metrics.compensation.totalAssessed
  );

  const rrCompletion = calculatePercentage(
    metrics.rr.completed,
    metrics.rr.totalCases
  );

  const possessionCompletion = calculatePercentage(
    metrics.possession.recorded,
    metrics.possession.totalRecords
  );

  // Determine overall project health
  const hasOverdueMilestones = metrics.milestones.overdue > 0;
  const hasFailedPayments = metrics.payments.failedPayments > 0;
  const lowAcquisitionProgress = landAcquisitionPercentage < 50;

  const riskLevel =
    hasOverdueMilestones && (hasFailedPayments || lowAcquisitionProgress)
      ? "HIGH"
      : hasOverdueMilestones || hasFailedPayments || lowAcquisitionProgress
      ? "MEDIUM"
      : "LOW";

  const riskColor =
    riskLevel === "HIGH" ? "danger" : riskLevel === "MEDIUM" ? "warning" : "success";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900">
                {metrics.project.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-sm text-gray-600">
                  {metrics.project.state}
                  {metrics.project.district && ` • ${metrics.project.district}`}
                </p>
                <Badge
                  className={
                    metrics.project.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700"
                      : metrics.project.status === "ACTIVE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {metrics.project.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Risk Level</p>
              <Badge
                className={
                  riskLevel === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : riskLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }
              >
                {riskLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Parcels"
            value={formatNumber(metrics.parcels.total)}
            subtitle="Under acquisition"
            icon={MapPin}
            color="primary"
          />

          <StatCard
            title="Land Target"
            value={formatArea(metrics.land.proposedSquareMeters)}
            subtitle={`${formatArea(metrics.land.acquiredSquareMeters)} acquired`}
            icon={Map}
            color="success"
          />

          <StatCard
            title="Total Cases"
            value={formatNumber(metrics.cases.total)}
            subtitle={`${metrics.cases.completed} completed`}
            icon={FileText}
            color="info"
          />

          <StatCard
            title="Milestones"
            value={`${metrics.milestones.completed}/${metrics.milestones.total}`}
            subtitle={
              metrics.milestones.overdue > 0
                ? `${metrics.milestones.overdue} overdue`
                : "On track"
            }
            icon={Target}
            color={metrics.milestones.overdue > 0 ? "danger" : "success"}
          />
        </div>

        {/* Case Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans']">
              Acquisition Case Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MultiProgressBar
              total={metrics.cases.total}
              segments={[
                {
                  label: "Completed",
                  value: metrics.cases.completed,
                  color: "success",
                },
                {
                  label: "Verified",
                  value: metrics.cases.verified,
                  color: "primary",
                },
                {
                  label: "Verification Pending",
                  value: metrics.cases.verificationPending,
                  color: "warning",
                },
                {
                  label: "Draft",
                  value: metrics.cases.draft,
                  color: "neutral",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Progress Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Acquisition Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressBar
                label="Land Acquisition"
                value={metrics.land.acquiredAcres}
                total={metrics.land.proposedAcres}
                color={landAcquisitionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="Cases Completed"
                value={metrics.cases.completed}
                total={metrics.cases.total}
                color={casesCompletionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="Milestones"
                value={metrics.milestones.completed}
                total={metrics.milestones.total}
                color={milestoneCompletion.color}
                showValues
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Compensation & Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Assessed</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatCurrency(metrics.compensation.totalAssessed)}
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-amber-600" />
              </div>

              <ProgressBar
                label="Payment Completion"
                value={metrics.payments.creditedAmount}
                total={metrics.compensation.totalAssessed}
                color={paymentCompletion >= 70 ? "success" : "danger"}
                showPercentage
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">In Progress</p>
                  <p className="text-lg font-bold text-blue-700">
                    {formatCurrency(metrics.payments.initiatedAmount)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Credited</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {formatCurrency(metrics.payments.creditedAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Case Breakdown"
            color="info"
            metrics={[
              {
                label: "Total Cases",
                value: formatNumber(metrics.cases.total),
                icon: FileText,
              },
              {
                label: "Completed",
                value: formatNumber(metrics.cases.completed),
                color: "success",
                icon: CheckCircle,
              },
              {
                label: "Verified",
                value: formatNumber(metrics.cases.verified),
                color: "primary",
              },
              {
                label: "Pending Verification",
                value: formatNumber(metrics.cases.verificationPending),
                color: "warning",
              },
            ]}
          />

          <MetricCard
            title="R&R Status"
            color="primary"
            metrics={[
              {
                label: "Total Cases",
                value: formatNumber(metrics.rr.totalCases),
                icon: Users,
              },
              {
                label: "Completed",
                value: formatNumber(metrics.rr.completed),
                color: "success",
                icon: CheckCircle,
              },
              {
                label: "In Progress",
                value: formatNumber(metrics.rr.inProgress),
                color: "warning",
                icon: Clock,
              },
            ]}
          />

          <MetricCard
            title="Possession"
            color="success"
            metrics={[
              {
                label: "Total Records",
                value: formatNumber(metrics.possession.totalRecords),
                icon: Home,
              },
              {
                label: "Recorded",
                value: formatNumber(metrics.possession.recorded),
                color: "success",
                icon: CheckCircle,
              },
              {
                label: "Pending",
                value: formatNumber(metrics.possession.pending),
                color: "warning",
                icon: Clock,
              },
            ]}
          />
        </div>

        {/* R&R and Possession Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                R&R Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar
                label="R&R Completion"
                value={metrics.rr.completed}
                total={metrics.rr.totalCases}
                color={rrCompletion >= 70 ? "success" : "warning"}
                showValues
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-gray-900">
                    {rrCompletion}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Possession Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar
                label="Possession Records"
                value={metrics.possession.recorded}
                total={metrics.possession.totalRecords}
                color={possessionCompletion >= 70 ? "success" : "danger"}
                showValues
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-gray-900">
                    {possessionCompletion}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk & Issues */}
        <Card
          className={`border-l-4 ${
            riskLevel === "HIGH"
              ? "border-red-500"
              : riskLevel === "MEDIUM"
              ? "border-amber-500"
              : "border-emerald-500"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
              {riskLevel === "HIGH" ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : riskLevel === "MEDIUM" ? (
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              )}
              Project Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Risk Indicators */}
              {metrics.milestones.overdue > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">
                      {metrics.milestones.overdue} Overdue Milestone
                      {metrics.milestones.overdue > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Critical: Immediate review and corrective action required
                    </p>
                  </div>
                </div>
              )}

              {hasFailedPayments && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">
                      {metrics.payments.failedPayments} Failed Payment Transaction
                      {metrics.payments.failedPayments > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Resolution required to maintain beneficiary trust
                    </p>
                  </div>
                </div>
              )}

              {lowAcquisitionProgress && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">
                      Low Land Acquisition Progress ({landAcquisitionPercentage}%)
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Review bottlenecks in acquisition process
                    </p>
                  </div>
                </div>
              )}

              {metrics.cases.verificationPending > 0 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      {metrics.cases.verificationPending} Case
                      {metrics.cases.verificationPending > 1 ? "s" : ""} Pending
                      Verification
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Accelerate verification to maintain project momentum
                    </p>
                  </div>
                </div>
              )}

              {/* Success Indicators */}
              {riskLevel === "LOW" && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      Project On Track
                    </p>
                    <p className="text-sm text-emerald-700 mt-1">
                      All key indicators within acceptable ranges. Continue
                      monitoring progress.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-['Instrument_Sans'] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{formatArea(metrics.land.acquiredSquareMeters)}</strong>{" "}
                    land successfully acquired
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{metrics.cases.completed}</strong> acquisition cases
                    completed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{formatCurrency(metrics.payments.creditedAmount)}</strong>{" "}
                    compensation disbursed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{metrics.milestones.completed}</strong> of{" "}
                    {metrics.milestones.total} milestones completed
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-['Instrument_Sans'] flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Next Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {metrics.cases.verificationPending > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Complete verification for {metrics.cases.verificationPending}{" "}
                      pending cases
                    </span>
                  </li>
                )}
                {metrics.rr.inProgress > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Monitor progress of {metrics.rr.inProgress} R&R cases
                    </span>
                  </li>
                )}
                {metrics.possession.pending > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Complete {metrics.possession.pending} pending possession records
                    </span>
                  </li>
                )}
                {metrics.milestones.total > metrics.milestones.completed && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Track remaining{" "}
                      {metrics.milestones.total - metrics.milestones.completed}{" "}
                      milestone(s)
                    </span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
