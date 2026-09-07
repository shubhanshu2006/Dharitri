import { Card, CardHeader, CardTitle, CardContent, Loading, Badge } from "@/components/ui";
import { VerificationStatusBadge, SeverityBadge } from "./VerificationStatusBadge";
import { CheckCircle2, XCircle, AlertTriangle, Clock, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { VerificationResult } from "@/hooks/useVerification";

interface VerificationResultsProps {
  results: VerificationResult[] | undefined;
  isLoading: boolean;
}

export function VerificationResults({
  results,
  isLoading,
}: VerificationResultsProps) {
  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Verification Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading verification results..." />
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Verification Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">
              No verification checks have been run yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "FAIL":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // Group results by status for summary
  const summary = results.reduce(
    (acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Verification Results</CardTitle>
          <div className="flex items-center gap-2">
            {summary.PASS > 0 && (
              <Badge variant="success" size="sm">
                {summary.PASS} Passed
              </Badge>
            )}
            {summary.FAIL > 0 && (
              <Badge variant="danger" size="sm">
                {summary.FAIL} Failed
              </Badge>
            )}
            {summary.WARNING > 0 && (
              <Badge variant="warning" size="sm">
                {summary.WARNING} Warnings
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 bg-white rounded-lg border border-paper-line hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(result.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-text">
                        {result.checkName}
                      </h4>
                      <p className="text-xs text-muted mt-0.5">
                        Source: {result.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <VerificationStatusBadge
                        status={result.status}
                        size="sm"
                      />
                      {result.severity && (
                        <SeverityBadge severity={result.severity} size="sm" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-text mb-2">{result.message}</p>

                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>Checked: {formatDateTime(result.checkedAt)}</span>
                    <span>•</span>
                    <span>Rule Version: {result.ruleVersion}</span>
                    {result.evidenceDocumentId && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Evidence Attached</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
