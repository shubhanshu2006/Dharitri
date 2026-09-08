"use client";

import { use } from "react";
import Link from "next/link";
import { useStateDashboard } from "@/hooks/useDashboard";
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
  TrendChart,
} from "@/components/dashboard";
import {
  Loading,
  ErrorMessage,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "@/components/ui";
import {
  Building2,
  Map,
  IndianRupee,
  Users,
  Home,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function StateDashboardPage({
  params,
}: {
  params: Promise<{ stateId: string }>;
}) {
  const { stateId } = use(params);
  const { data: metrics, isLoading, error, refetch } = useStateDashboard(stateId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Loading state dashboard..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Link href="/dashboard/executive">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Executive Dashboard
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load state dashboard"
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Calculate derived metrics
  const projectCompletion = getCompletionStatus(
    metrics.projects.completed,
    metrics.projects.total
  );

  const landAcquisitionPercentage = calculatePercentage(
    metrics.land.acquiredAcres,
    metrics.land.proposedAcres
  );

  const compensationPaidPercentage = calculatePercentage(
    metrics.payments.creditedAmount,
    metrics.compensation.totalAssessed
  );

  const rrCompletionPercentage = calculatePercentage(
    metrics.rr.completed,
    metrics.rr.totalCases
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/executive">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900">
                State Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-mono">
                State ID: {stateId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Projects"
            value={formatNumber(metrics.projects.total)}
            subtitle={`${metrics.projects.completed} completed`}
            icon={Building2}
            color="primary"
          />

          <StatCard
            title="Land Acquired"
            value={formatArea(metrics.land.acquiredSquareMeters)}
            subtitle={`${landAcquisitionPercentage}% of target`}
            icon={Map}
            color="success"
          />

          <StatCard
            title="Compensation"
            value={formatCurrency(metrics.compensation.totalAssessed)}
            subtitle={`${formatNumber(metrics.compensation.totalAssessments)} assessments`}
            icon={IndianRupee}
            color="warning"
          />

          <StatCard
            title="R&R Cases"
            value={formatNumber(metrics.rr.totalCases)}
            subtitle={`${metrics.rr.completed} completed`}
            icon={Users}
            color="info"
          />
        </div>

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
                label="Projects Completed"
                value={metrics.projects.completed}
                total={metrics.projects.total}
                color={projectCompletion.color}
                showValues
              />

              <ProgressBar
                label="Land Acquisition"
                value={metrics.land.acquiredAcres}
                total={metrics.land.proposedAcres}
                color={landAcquisitionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="R&R Completion"
                value={metrics.rr.completed}
                total={metrics.rr.totalCases}
                color={rrCompletionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="Possession Records"
                value={metrics.possession.recorded}
                total={metrics.possession.totalRecords}
                color={
                  calculatePercentage(
                    metrics.possession.recorded,
                    metrics.possession.totalRecords
                  ) >= 70
                    ? "success"
                    : "danger"
                }
                showValues
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatNumber(metrics.payments.totalPayments)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Credited</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(metrics.payments.creditedAmount)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>

              {metrics.payments.failedPayments > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
                    <p className="text-2xl font-bold text-red-700">
                      {formatNumber(metrics.payments.failedPayments)}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              )}

              <ProgressBar
                label="Payment Completion"
                value={metrics.payments.creditedAmount}
                total={metrics.compensation.totalAssessed}
                color={compensationPaidPercentage >= 80 ? "success" : "warning"}
                showPercentage
              />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Land Metrics"
            color="success"
            metrics={[
              {
                label: "Total Parcels",
                value: formatNumber(metrics.parcels.total),
              },
              {
                label: "Proposed",
                value: formatArea(metrics.land.proposedSquareMeters),
              },
              {
                label: "Acquired",
                value: formatArea(metrics.land.acquiredSquareMeters),
              },
            ]}
          />

          <MetricCard
            title="Financial Summary"
            color="warning"
            metrics={[
              {
                label: "Assessed",
                value: formatCurrency(metrics.compensation.totalAssessed),
              },
              {
                label: "Disbursed",
                value: formatCurrency(metrics.payments.creditedAmount),
              },
              {
                label: "In Progress",
                value: formatCurrency(metrics.payments.initiatedAmount),
              },
            ]}
          />

          <MetricCard
            title="R&R & Possession"
            color="info"
            metrics={[
              {
                label: "R&R Total",
                value: formatNumber(metrics.rr.totalCases),
              },
              {
                label: "R&R Completed",
                value: formatNumber(metrics.rr.completed),
                color: "success",
              },
              {
                label: "Possession Recorded",
                value: formatNumber(metrics.possession.recorded),
                color: "success",
              },
            ]}
          />
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans']">
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Achievements
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • {metrics.projects.completed} of {metrics.projects.total} projects
                    completed ({projectCompletion.percentage}%)
                  </li>
                  <li>
                    • {formatArea(metrics.land.acquiredSquareMeters)} land acquired
                  </li>
                  <li>
                    • {formatCurrency(metrics.payments.creditedAmount)} disbursed
                  </li>
                  <li>
                    • {metrics.rr.completed} R&R cases completed
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Pending Actions
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • {metrics.projects.total - metrics.projects.completed} projects
                    in progress
                  </li>
                  <li>
                    • {metrics.rr.inProgress} R&R cases under assessment
                  </li>
                  <li>
                    • {metrics.possession.pending} possession records pending
                  </li>
                  {metrics.payments.failedPayments > 0 && (
                    <li className="text-red-600 font-medium">
                      • {metrics.payments.failedPayments} failed payments need attention
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
