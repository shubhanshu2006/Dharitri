"use client";

import { useNationalDashboard } from "@/hooks/useDashboard";
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
  TrendChart,
} from "@/components/dashboard";
import { Loading, ErrorMessage, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import {
  Building2,
  Map,
  Users,
  IndianRupee,
  FileText,
  Home,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function ExecutiveDashboardPage() {
  const { data: metrics, isLoading, error, refetch } = useNationalDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Loading national dashboard..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <ErrorMessage
          title="Failed to load dashboard"
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

  const possessionPercentage = calculatePercentage(
    metrics.possession.recorded,
    metrics.possession.totalRecords
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900">
                Executive Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                National Land Acquisition Overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-600 font-medium">LIVE DATA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={formatNumber(metrics.projects.total)}
            subtitle={`${metrics.projects.completed} completed`}
            icon={Building2}
            color="primary"
            trend={{
              value: projectCompletion.percentage,
              isPositive: true,
              label: projectCompletion.label,
            }}
          />

          <StatCard
            title="Land Acquired"
            value={formatArea(metrics.land.acquiredSquareMeters)}
            subtitle={`of ${formatArea(metrics.land.proposedSquareMeters)}`}
            icon={Map}
            color="success"
            trend={{
              value: landAcquisitionPercentage,
              isPositive: landAcquisitionPercentage >= 70,
            }}
          />

          <StatCard
            title="Total Parcels"
            value={formatNumber(metrics.parcels.total)}
            subtitle="Under acquisition"
            icon={MapPin}
            color="info"
          />

          <StatCard
            title="Compensation Assessed"
            value={formatCurrency(metrics.compensation.totalAssessed)}
            subtitle={`${formatNumber(metrics.compensation.totalAssessments)} assessments`}
            icon={IndianRupee}
            color="warning"
          />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Acquisition Progress */}
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
                label="Land Acquired"
                value={metrics.land.acquiredAcres}
                total={metrics.land.proposedAcres}
                color={landAcquisitionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="R&R Cases Completed"
                value={metrics.rr.completed}
                total={metrics.rr.totalCases}
                color={rrCompletionPercentage >= 70 ? "success" : "warning"}
                showValues
              />

              <ProgressBar
                label="Possession Recorded"
                value={metrics.possession.recorded}
                total={metrics.possession.totalRecords}
                color={possessionPercentage >= 70 ? "success" : "danger"}
                showValues
              />
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <MetricCard
            title="Financial Overview"
            color="warning"
            metrics={[
              {
                label: "Total Assessed",
                value: formatCurrency(metrics.compensation.totalAssessed),
                icon: FileText,
                color: "info",
              },
              {
                label: "Payments Initiated",
                value: formatCurrency(metrics.payments.initiatedAmount),
                icon: TrendingUp,
                color: "primary",
              },
              {
                label: "Amount Credited",
                value: formatCurrency(metrics.payments.creditedAmount),
                icon: CheckCircle,
                color: "success",
              },
              {
                label: "Failed Payments",
                value: formatNumber(metrics.payments.failedPayments),
                icon: AlertTriangle,
                color: "danger",
              },
            ]}
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compensation & Payments */}
          <MetricCard
            title="Compensation & Payments"
            color="primary"
            metrics={[
              {
                label: "Assessments",
                value: formatNumber(metrics.compensation.totalAssessments),
              },
              {
                label: "Total Payments",
                value: formatNumber(metrics.payments.totalPayments),
              },
              {
                label: "Payment Success Rate",
                value: `${calculatePercentage(
                  metrics.payments.totalPayments - metrics.payments.failedPayments,
                  metrics.payments.totalPayments
                )}%`,
              },
            ]}
          />

          {/* R&R Status */}
          <MetricCard
            title="Resettlement & Rehabilitation"
            color="info"
            metrics={[
              {
                label: "Total Cases",
                value: formatNumber(metrics.rr.totalCases),
                icon: Users,
              },
              {
                label: "Completed",
                value: formatNumber(metrics.rr.completed),
                icon: CheckCircle,
                color: "success",
              },
              {
                label: "In Progress",
                value: formatNumber(metrics.rr.inProgress),
                icon: TrendingUp,
                color: "warning",
              },
            ]}
          />

          {/* Possession Status */}
          <MetricCard
            title="Possession Records"
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
                icon: CheckCircle,
                color: "success",
              },
              {
                label: "Pending",
                value: formatNumber(metrics.possession.pending),
                icon: AlertTriangle,
                color: "warning",
              },
            ]}
          />
        </div>

        {/* Payment Flow Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans']">
              Payment Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MultiProgressBar
              total={metrics.compensation.totalAssessed}
              segments={[
                {
                  label: "Credited",
                  value: metrics.payments.creditedAmount,
                  color: "success",
                },
                {
                  label: "In Progress",
                  value: metrics.payments.initiatedAmount,
                  color: "primary",
                },
                {
                  label: "Pending",
                  value:
                    metrics.compensation.totalAssessed -
                    metrics.payments.creditedAmount -
                    metrics.payments.initiatedAmount,
                  color: "warning",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-l-4 border-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg font-['Instrument_Sans'] flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{projectCompletion.percentage}%</strong> of projects
                    completed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>{formatCurrency(metrics.payments.creditedAmount)}</strong>{" "}
                    successfully disbursed to beneficiaries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    <strong>
                      {calculatePercentage(
                        metrics.payments.totalPayments - metrics.payments.failedPayments,
                        metrics.payments.totalPayments
                      )}
                      %
                    </strong>{" "}
                    payment success rate
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-amber-500">
            <CardHeader>
              <CardTitle className="text-lg font-['Instrument_Sans'] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Areas Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {metrics.payments.failedPayments > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>
                      <strong>{formatNumber(metrics.payments.failedPayments)}</strong>{" "}
                      failed payment transactions need resolution
                    </span>
                  </li>
                )}
                {metrics.possession.pending > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>
                      <strong>{formatNumber(metrics.possession.pending)}</strong>{" "}
                      possession records pending completion
                    </span>
                  </li>
                )}
                {metrics.rr.inProgress > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>
                      <strong>{formatNumber(metrics.rr.inProgress)}</strong> R&R cases
                      currently in progress
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
