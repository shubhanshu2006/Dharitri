import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import {
  AlertTriangle,
  Shield,
  AlertCircle,
  Activity,
  RefreshCw,
} from "lucide-react";
import {
  getRiskConfig,
  formatRiskScore,
  type RiskScore,
} from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface RiskScoreCardProps {
  riskScore: RiskScore;
  title?: string;
  showAlgorithmVersion?: boolean;
  className?: string;
}

export function RiskScoreCard({
  riskScore,
  title = "Risk Assessment",
  showAlgorithmVersion = false,
  className,
}: RiskScoreCardProps) {
  const config = getRiskConfig(riskScore.riskLevel);

  const RiskIcon =
    riskScore.score >= 80
      ? AlertCircle
      : riskScore.score >= 60
      ? AlertTriangle
      : riskScore.score >= 30
      ? Activity
      : Shield;

  return (
    <Card className={cn("border-l-4", config.borderClass, className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-['Instrument_Sans']">
            {title}
          </CardTitle>
          <Badge className={cn("text-base px-4 py-1", config.bgClass, config.textClass)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Risk Score Display */}
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                config.bgClass
              )}
            >
              <RiskIcon className={cn("h-12 w-12", config.iconClass)} />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold font-['Instrument_Sans'] text-gray-900">
                  {Math.round(riskScore.score)}
                </span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <p className="text-sm text-gray-600">
                Risk Score •{" "}
                <span className={config.textClass}>
                  {config.label}
                </span>
              </p>
            </div>
          </div>

          {/* Risk Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
              <div className="w-[30%] bg-emerald-500" />
              <div className="w-[30%] bg-amber-500" />
              <div className="w-[20%] bg-red-500" />
              <div className="w-[20%] bg-red-700" />
            </div>
            <div className="relative h-6">
              <div
                className="absolute top-0 transition-all duration-500"
                style={{ left: `${riskScore.score}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-6 bg-gray-900" />
                <div className="w-3 h-3 bg-gray-900 rounded-full -mt-1.5 -ml-1.5" />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>Last updated: {formatDate(new Date(riskScore.generatedAt))}</span>
            </div>
            {showAlgorithmVersion && (
              <span className="font-mono">{riskScore.algorithmVersion}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
