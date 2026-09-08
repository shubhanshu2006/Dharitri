"use client";

import { use } from "react";
import Link from "next/link";
import { useProjectRisk, useProjectAnomalies } from "@/hooks/useAI";
import {
  RiskScoreCard,
  RiskFactorList,
  ActionableInsights,
  AnomalyAlert,
} from "@/components/ai";
import { Loading, ErrorMessage, Button, Card, CardContent, Badge, Alert } from "@/components/ui";
import { ArrowLeft, Brain, RefreshCw, AlertCircle, Info } from "lucide-react";

export default function AIInsightsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  const {
    data: riskScore,
    isLoading: isLoadingRisk,
    error: riskError,
    refetch: refetchRisk,
  } = useProjectRisk(projectId);

  const {
    data: anomalies,
    isLoading: isLoadingAnomalies,
    error: anomaliesError,
    refetch: refetchAnomalies,
  } = useProjectAnomalies(projectId);

  const isLoading = isLoadingRisk || isLoadingAnomalies;
  const hasError = riskError || anomaliesError;

  const handleRefresh = () => {
    refetchRisk();
    refetchAnomalies();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading text="Analyzing project data..." />
      </div>
    );
  }

  if (hasError || !riskScore) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Link href={`/dashboard/projects/${projectId}`}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load AI insights"
          message={
            hasError
              ? "Unable to analyze project data"
              : "Risk assessment not available"
          }
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
              <h1 className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                AI Decision Support
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Risk analysis and anomaly detection powered by AI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-700 text-sm px-3 py-1">
                {riskScore.algorithmVersion}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                Refresh Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Explainability Notice */}
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <div>
            <p className="font-medium">About AI Decision Support</p>
            <p className="text-sm mt-1">
              This analysis is powered by rule-based AI algorithms. All risk scores
              include detailed explanations of contributing factors and recommended
              actions. The system continuously learns from project patterns to improve
              accuracy.
            </p>
          </div>
        </Alert>

        {/* Risk Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RiskScoreCard
              riskScore={riskScore}
              title="Overall Project Risk"
              showAlgorithmVersion={false}
            />
          </div>
          <div className="lg:col-span-2">
            <RiskFactorList
              factors={riskScore.factors}
              title="Why This Risk Score?"
            />
          </div>
        </div>

        {/* Actionable Insights */}
        <ActionableInsights factors={riskScore.factors} />

        {/* Anomalies */}
        <AnomalyAlert
          anomalies={anomalies || []}
          title="Detected Anomalies"
          showRecommendations
        />

        {/* Detailed Explanation Section */}
        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold font-['Instrument_Sans'] mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              How Risk Score is Calculated
            </h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Risk Factors</h4>
                <p className="mb-3">
                  The AI system analyzes multiple aspects of your project and assigns a
                  contribution score to each risk factor:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>
                      <strong>Overdue Milestones:</strong> Each overdue milestone adds up
                      to 5 points (max 25 points)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>
                      <strong>Verification Backlog:</strong> Each pending parcel adds up
                      to 2 points (max 20 points)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>
                      <strong>Payment Failures:</strong> Each failed payment adds up to 3
                      points (max 20 points)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      <strong>R&R Backlog:</strong> Each pending R&R case adds up to 2
                      points (max 15 points)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      <strong>Document Corrections:</strong> Each document requiring
                      correction adds up to 2 points (max 15 points)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Risk Levels</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-semibold text-emerald-700">Low Risk</p>
                    <p className="text-xs text-gray-600 mt-1">Score: 0-30</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="font-semibold text-amber-700">Medium Risk</p>
                    <p className="text-xs text-gray-600 mt-1">Score: 31-60</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-semibold text-red-700">High Risk</p>
                    <p className="text-xs text-gray-600 mt-1">Score: 61-80</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                    <p className="font-semibold text-red-900">Critical Risk</p>
                    <p className="text-xs text-gray-600 mt-1">Score: 81-100</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Anomaly Detection</h4>
                <p>
                  The AI system monitors patterns across all projects and flags unusual
                  deviations that may indicate issues requiring attention. Anomalies are
                  categorized by severity (HIGH, MEDIUM, LOW) based on their potential
                  impact on project timelines and outcomes.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <strong>Note:</strong> This AI system uses explainable rule-based
                  algorithms. All scores and recommendations are based on transparent
                  criteria and can be audited. The system is continuously monitored and
                  updated to improve accuracy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {riskScore.factors.length}
              </div>
              <p className="text-sm text-gray-600">Risk Factors Identified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">
                {anomalies?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Anomalies Detected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {riskScore.factors.reduce((sum, f) => sum + f.contribution, 0) <
                30
                  ? "Good"
                  : riskScore.factors.reduce((sum, f) => sum + f.contribution, 0) <
                    60
                  ? "Fair"
                  : "Action Needed"}
              </div>
              <p className="text-sm text-gray-600">Project Health Status</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
