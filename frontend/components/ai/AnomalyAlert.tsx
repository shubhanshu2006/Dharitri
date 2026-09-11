import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from "@/components/ui";
import { AlertOctagon, CheckCircle, TrendingUp } from "lucide-react";
import {
  getAnomalySeverityColor,
  ANOMALY_TYPE_LABELS,
  type Anomaly,
} from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface AnomalyAlertProps {
  anomalies: Anomaly[];
  title?: string;
  showRecommendations?: boolean;
  className?: string;
}

export function AnomalyAlert({
  anomalies,
  title = "Detected Anomalies",
  showRecommendations = true,
  className,
}: AnomalyAlertProps) {
  if (anomalies.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="h-12 w-12 text-emerald-600 mb-3" />
            <p className="text-lg font-semibold text-emerald-900">
              No Anomalies Detected
            </p>
            <p className="text-sm text-gray-600 mt-1">
              All patterns within expected ranges
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by severity (HIGH > MEDIUM > LOW)
  const sortedAnomalies = [...anomalies].sort((a, b) => {
    const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const severityCounts = {
    HIGH: anomalies.filter((a) => a.severity === "HIGH").length,
    MEDIUM: anomalies.filter((a) => a.severity === "MEDIUM").length,
    LOW: anomalies.filter((a) => a.severity === "LOW").length,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
            <AlertOctagon className="h-6 w-6 text-red-600" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {severityCounts.HIGH > 0 && (
              <Badge className="bg-red-100 text-red-700">
                {severityCounts.HIGH} High
              </Badge>
            )}
            {severityCounts.MEDIUM > 0 && (
              <Badge className="bg-amber-100 text-amber-700">
                {severityCounts.MEDIUM} Medium
              </Badge>
            )}
            {severityCounts.LOW > 0 && (
              <Badge className="bg-emerald-100 text-emerald-800">
                {severityCounts.LOW} Low
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {anomalies.length} anomal{anomalies.length > 1 ? "ies" : "y"} requiring
          attention
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAnomalies.map((anomaly) => {
            const colors = getAnomalySeverityColor(anomaly.severity);
            const typeLabel =
              ANOMALY_TYPE_LABELS[
                anomaly.type as keyof typeof ANOMALY_TYPE_LABELS
              ] || anomaly.type;

            return (
              <Alert
                key={anomaly.id}
                variant={
                  anomaly.severity === "HIGH"
                    ? "danger"
                    : anomaly.severity === "MEDIUM"
                    ? "warning"
                    : "info"
                }
                className="p-4"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={cn("text-xs", colors.bg, colors.text)}
                        >
                          {anomaly.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300"
                        >
                          {typeLabel}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {anomaly.description}
                      </h4>
                    </div>
                  </div>

                  {/* Entity Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>
                      <span className="font-medium">Entity:</span>{" "}
                      {anomaly.entityType}
                    </span>
                    <span>
                      <span className="font-medium">ID:</span>{" "}
                      <span className="font-mono">{anomaly.entityId.slice(0, 8)}...</span>
                    </span>
                    <span>
                      <span className="font-medium">Detected:</span>{" "}
                      {formatDate(new Date(anomaly.detectedAt))}
                    </span>
                  </div>

                  {/* Recommendations */}
                  {showRecommendations && anomaly.recommendations.length > 0 && (
                    <div
                      className={cn(
                        "p-3 rounded-lg border-l-4",
                        colors.bg,
                        colors.border
                      )}
                    >
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Recommended Actions:
                      </p>
                      <ul className="space-y-1">
                        {anomaly.recommendations.map((rec, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className={colors.text}>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
