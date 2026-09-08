import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Clock, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import type { RiskFactor } from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";

interface RiskFactorListProps {
  factors: RiskFactor[];
  title?: string;
  className?: string;
}

const FACTOR_ICONS: Record<string, any> = {
  overdue_milestones: Clock,
  verification_delay: Clock,
  rr_delay: Clock,
  possession_delay: Clock,
  payment_failures: DollarSign,
  compensation_pending: DollarSign,
  verification_backlog: AlertTriangle,
  document_corrections: AlertTriangle,
  rr_backlog: AlertTriangle,
};

export function RiskFactorList({
  factors,
  title = "Risk Factors",
  className,
}: RiskFactorListProps) {
  if (factors.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-['Instrument_Sans']">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="h-12 w-12 text-emerald-600 mb-3" />
            <p className="text-lg font-semibold text-emerald-900">
              No Risk Factors Detected
            </p>
            <p className="text-sm text-gray-600 mt-1">
              All systems operating normally
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort factors by contribution (highest first)
  const sortedFactors = [...factors].sort((a, b) => b.contribution - a.contribution);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-['Instrument_Sans']">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {factors.length} factor{factors.length > 1 ? "s" : ""} contributing to risk
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFactors.map((factor, index) => {
            const Icon = FACTOR_ICONS[factor.name] || AlertTriangle;
            const contributionPercentage = factor.contribution;
            const isHigh = contributionPercentage >= 20;
            const isMedium = contributionPercentage >= 10;

            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-all hover:shadow-md",
                  isHigh
                    ? "bg-red-50 border-red-500"
                    : isMedium
                    ? "bg-amber-50 border-amber-500"
                    : "bg-blue-50 border-blue-500"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isHigh
                        ? "bg-red-100"
                        : isMedium
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isHigh
                          ? "text-red-600"
                          : isMedium
                          ? "text-amber-600"
                          : "text-blue-600"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4
                        className={cn(
                          "font-semibold text-sm",
                          isHigh
                            ? "text-red-900"
                            : isMedium
                            ? "text-amber-900"
                            : "text-blue-900"
                        )}
                      >
                        {factor.name
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </h4>
                      <span
                        className={cn(
                          "text-xl font-bold font-['Instrument_Sans']",
                          isHigh
                            ? "text-red-700"
                            : isMedium
                            ? "text-amber-700"
                            : "text-blue-700"
                        )}
                      >
                        +{Math.round(contributionPercentage)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        isHigh
                          ? "text-red-700"
                          : isMedium
                          ? "text-amber-700"
                          : "text-blue-700"
                      )}
                    >
                      {factor.explanation}
                    </p>

                    {/* Contribution bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            isHigh
                              ? "bg-red-600"
                              : isMedium
                              ? "bg-amber-600"
                              : "bg-blue-600"
                          )}
                          style={{ width: `${Math.min(contributionPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
