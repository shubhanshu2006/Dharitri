"use client";

import { use } from "react";
import Link from "next/link";
import { useDistrictDashboard } from "@/hooks/useDashboard";
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
  FileText,
  Clock,
} from "lucide-react";

export default function DistrictDashboardPage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = use(params);
  const { data: metrics, isLoading, error, refetch } = useDistrictDashboard(districtId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Loading district dashboard..." />
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
          title="Failed to load district dashboard"
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

  const paymentSuccessRate = calculatePercentage(
    metrics.payments.totalPayments - metrics.payments.failedPayments,
    metrics.payments.totalPayments
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
                District Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-mono">
                District ID: {districtId}
              </p>
            </div>
            <Badge
              className={
                projectCompletion.percentage >= 70
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }
            >
              {projectCompletion.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Projects"
            value={formatNumber(metrics.projects.total)}
            subtitle={`${metrics.projects.completed} completed`}
            icon={Building2}
            color="primary"
          />

          <StatCard
            title="Total Parcels"
            value={formatNumber(metrics.parcels.total)}
            subtitle="Under acquisition"
            icon={Map}
            color="info"
          />

          <StatCard
            title="Payments Made"
            value={formatNumber(metrics.payments.totalPayments)}
            subtitle={`${paymentSuccessRate}% success`}
            icon={IndianRupee}
            color="success"
          />

          <StatCard
            title="R&R Cases"
            value={formatNumber(metrics.rr.totalCases)}
            subtitle={`${metrics.rr.completed} completed`}
            icon={Users}
            color="warning"
          />
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans']">
              District Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressBar
              label="Project Completion"
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
              label="Compensation Disbursed"
              value={metrics.payments.creditedAmount}
              total={metrics.compensation.totalAssessed}
              color={
                calculatePercentage(
                  metrics.payments.creditedAmount,
                  metrics.compensation.totalAssessed
                ) >= 70
                  ? "success"
                  : "danger"
              }
              showPercentage
            />

            <ProgressBar
              label="R&R Completion"
              value={metrics.rr.completed}
              total={metrics.rr.totalCases}
              color={
                calculatePercentage(metrics.rr.completed, metrics.rr.totalCases) >= 70
                  ? "success"
                  : "warning"
              }
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

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Land & Parcels"
            color="success"
            metrics={[
              {
                label: "Total Parcels",
                value: formatNumber(metrics.parcels.total),
                icon: Map,
              },
              {
                label: "Land Proposed",
                value: formatArea(metrics.land.proposedSquareMeters),
              },
              {
                label: "Land Acquired",
                value: formatArea(metrics.land.acquiredSquareMeters),
                color: "success",
              },
            ]}
          />

          <MetricCard
            title="Compensation"
            color="warning"
            metrics={[
              {
                label: "Assessments",
                value: formatNumber(metrics.compensation.totalAssessments),
                icon: FileText,
              },
              {
                label: "Total Assessed",
                value: formatCurrency(metrics.compensation.totalAssessed),
              },
              {
                label: "Credited",
                value: formatCurrency(metrics.payments.creditedAmount),
                color: "success",
              },
            ]}
          />

          <MetricCard
            title="Payment Status"
            color="primary"
            metrics={[
              {
                label: "Total Payments",
                value: formatNumber(metrics.payments.totalPayments),
              },
              {
                label: "In Progress",
                value: formatCurrency(metrics.payments.initiatedAmount),
                icon: Clock,
                color: "warning",
              },
              {
                label: "Failed",
                value: formatNumber(metrics.payments.failedPayments),
                icon: AlertCircle,
                color: "danger",
              },
            ]}
          />
        </div>

        {/* R&R and Possession */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Resettlement & Rehabilitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Cases</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatNumber(metrics.rr.totalCases)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatNumber(metrics.rr.completed)}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <p className="text-xs text-gray-600">In Progress</p>
                    </div>
                    <p className="text-xl font-bold text-amber-700">
                      {formatNumber(metrics.rr.inProgress)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-['Instrument_Sans']">
                Possession Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Home className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Records</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatNumber(metrics.possession.totalRecords)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs text-gray-600">Recorded</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatNumber(metrics.possession.recorded)}
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                    <p className="text-xl font-bold text-red-700">
                      {formatNumber(metrics.possession.pending)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.projects.total - metrics.projects.completed > 0 && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {metrics.projects.total - metrics.projects.completed} projects
                      in progress
                    </p>
                    <p className="text-sm text-gray-600">
                      Continue monitoring project milestones and deadlines
                    </p>
                  </div>
                </div>
              )}

              {metrics.payments.failedPayments > 0 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      {metrics.payments.failedPayments} failed payment transactions
                    </p>
                    <p className="text-sm text-red-700">
                      Immediate attention required to resolve payment issues
                    </p>
                  </div>
                </div>
              )}

              {metrics.rr.inProgress > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {metrics.rr.inProgress} R&R cases under assessment
                    </p>
                    <p className="text-sm text-blue-700">
                      Monitor rehabilitation progress and beneficiary satisfaction
                    </p>
                  </div>
                </div>
              )}

              {metrics.possession.pending > 0 && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <Home className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">
                      {metrics.possession.pending} possession records pending
                    </p>
                    <p className="text-sm text-amber-700">
                      Complete possession formalities and documentation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
