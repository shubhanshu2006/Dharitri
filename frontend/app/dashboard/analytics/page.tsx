"use client";

import { useState } from "react";
import {
  useAcquisitionTrends,
  useCompensationTrends,
  usePaymentAnalytics,
  useRRTrends,
  usePossessionTrends,
  useBottlenecks,
} from "@/hooks/useAnalytics";
import { TrendAnalysis, BottleneckChart } from "@/components/analytics";
import { Loading, ErrorMessage, Card, CardContent, Button, Badge } from "@/components/ui";
import { BarChart3, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import { formatCurrency, formatNumber, formatArea } from "@/lib/constants/dashboard";
import type { AnalyticsQuery } from "@/lib/constants/analytics";

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");
  const [query, setQuery] = useState<AnalyticsQuery>({
    groupBy: "week",
  });

  // Fetch all analytics data
  const {
    data: acquisitionData,
    isLoading: isLoadingAcquisition,
    error: acquisitionError,
    refetch: refetchAcquisition,
  } = useAcquisitionTrends(query);

  const {
    data: compensationData,
    isLoading: isLoadingCompensation,
    error: compensationError,
    refetch: refetchCompensation,
  } = useCompensationTrends(query);

  const {
    data: paymentData,
    isLoading: isLoadingPayments,
    error: paymentError,
    refetch: refetchPayments,
  } = usePaymentAnalytics(query);

  const {
    data: rrData,
    isLoading: isLoadingRR,
    error: rrError,
    refetch: refetchRR,
  } = useRRTrends(query);

  const {
    data: possessionData,
    isLoading: isLoadingPossession,
    error: possessionError,
    refetch: refetchPossession,
  } = usePossessionTrends(query);

  const {
    data: bottlenecks,
    isLoading: isLoadingBottlenecks,
    error: bottlenecksError,
    refetch: refetchBottlenecks,
  } = useBottlenecks(query);

  const isLoading =
    isLoadingAcquisition ||
    isLoadingCompensation ||
    isLoadingPayments ||
    isLoadingRR ||
    isLoadingPossession ||
    isLoadingBottlenecks;

  const hasError =
    acquisitionError ||
    compensationError ||
    paymentError ||
    rrError ||
    possessionError ||
    bottlenecksError;

  const handleRefresh = () => {
    refetchAcquisition();
    refetchCompensation();
    refetchPayments();
    refetchRR();
    refetchPossession();
    refetchBottlenecks();
  };

  const handleTimeRangeChange = (range: "week" | "month" | "quarter") => {
    setTimeRange(range);
    setQuery({
      groupBy: range === "week" ? "day" : range === "month" ? "week" : "month",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Loading analytics..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <ErrorMessage
          title="Failed to load analytics"
          message="Unable to fetch analytics data"
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Trend analysis and performance insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Time Range Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Time Range:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={timeRange === "week" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleTimeRangeChange("week")}
                >
                  Last Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleTimeRangeChange("month")}
                >
                  Last Month
                </Button>
                <Button
                  variant={timeRange === "quarter" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleTimeRangeChange("quarter")}
                >
                  Last Quarter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              Acquisition Trends
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="Parcels Acquired"
              data={acquisitionData?.parcelsAcquired || []}
              color="emerald"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="Land Acquired"
              data={acquisitionData?.landAcquired || []}
              color="emerald"
              valueFormatter={(v) => formatArea(v)}
            />
          </div>
          <TrendAnalysis
            title="Cases Completed"
            data={acquisitionData?.casesCompleted || []}
            color="blue"
            valueFormatter={formatNumber}
          />
        </div>

        {/* Compensation Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              Compensation Trends
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="Assessments Completed"
              data={compensationData?.assessmentsCompleted || []}
              color="amber"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="Total Amount Assessed"
              data={compensationData?.totalAmount || []}
              color="amber"
              valueFormatter={formatCurrency}
            />
          </div>
        </div>

        {/* Payment Analytics */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              Payment Analytics
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="Payments Completed"
              data={paymentData?.paymentsCompleted || []}
              color="purple"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="Payment Success Rate"
              data={paymentData?.successRate || []}
              color="emerald"
              valueFormatter={(v) => `${v}%`}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="Payments Initiated"
              data={paymentData?.paymentsInitiated || []}
              color="blue"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="Payment Failures"
              data={paymentData?.paymentsFailed || []}
              color="red"
              valueFormatter={formatNumber}
            />
          </div>
        </div>

        {/* R&R Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              R&R Trends
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="R&R Cases Created"
              data={rrData?.casesCreated || []}
              color="blue"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="R&R Cases Completed"
              data={rrData?.casesCompleted || []}
              color="emerald"
              valueFormatter={formatNumber}
            />
          </div>
        </div>

        {/* Possession Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              Possession Trends
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="Possession Recorded"
              data={possessionData?.possessionRecorded || []}
              color="emerald"
              valueFormatter={formatNumber}
            />
            <TrendAnalysis
              title="Possession Pending"
              data={possessionData?.possessionPending || []}
              color="amber"
              valueFormatter={formatNumber}
            />
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold font-['Instrument_Sans']">
              Process Bottlenecks
            </h2>
          </div>
          <BottleneckChart bottlenecks={bottlenecks || []} />
        </div>
      </div>
    </div>
  );
}
