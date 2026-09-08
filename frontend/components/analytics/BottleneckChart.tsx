import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { AlertTriangle, ArrowRight, TrendingDown } from "lucide-react";
import type { Bottleneck } from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";

interface BottleneckChartProps {
  bottlenecks: Bottleneck[];
  title?: string;
  className?: string;
}

export function BottleneckChart({
  bottlenecks,
  title = "Process Bottlenecks",
  className,
}: BottleneckChartProps) {
  if (bottlenecks.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-['Instrument_Sans']">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingDown className="h-12 w-12 text-emerald-600 mb-3" />
            <p className="text-lg font-semibold text-emerald-900">
              No Bottlenecks Detected
            </p>
            <p className="text-sm text-gray-600 mt-1">
              All processes flowing smoothly
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by impact (HIGH > MEDIUM > LOW) and then by count
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    const impactOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    return impactDiff !== 0 ? impactDiff : b.count - a.count;
  });

  const maxCount = Math.max(...bottlenecks.map((b) => b.count));
  const maxDelay = Math.max(...bottlenecks.map((b) => b.averageDelay));

  const getImpactConfig = (impact: Bottleneck["impact"]) => {
    switch (impact) {
      case "HIGH":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-500",
          barBg: "bg-red-500",
          label: "High Impact",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-500",
          barBg: "bg-amber-500",
          label: "Medium Impact",
        };
      case "LOW":
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-500",
          barBg: "bg-blue-500",
          label: "Low Impact",
        };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            {title}
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-700">
            {bottlenecks.length} stage{bottlenecks.length > 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Stages with delays or backlogs requiring attention
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedBottlenecks.map((bottleneck, index) => {
            const config = getImpactConfig(bottleneck.impact);
            const countPercentage = (bottleneck.count / maxCount) * 100;

            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  config.bg,
                  config.border
                )}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs", config.bg, config.text)}>
                          {config.label}
                        </Badge>
                      </div>
                      <h4 className={cn("font-semibold text-lg", config.text)}>
                        {bottleneck.stage}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {bottleneck.description}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn("p-3 rounded-lg", config.bg)}>
                      <p className="text-xs text-gray-600 mb-1">Pending Items</p>
                      <p className={cn("text-2xl font-bold", config.text)}>
                        {bottleneck.count}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-lg", config.bg)}>
                      <p className="text-xs text-gray-600 mb-1">Avg. Delay</p>
                      <p className={cn("text-2xl font-bold", config.text)}>
                        {Math.round(bottleneck.averageDelay)} days
                      </p>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Workload</span>
                      <span>{Math.round(countPercentage)}% of max</span>
                    </div>
                    <div className="h-4 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all duration-500", config.barBg)}
                        style={{ width: `${Math.min(countPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendations */}
                  {bottleneck.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {bottleneck.recommendations.map((rec, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2 pl-4"
                          >
                            <span className={config.text}>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-700">
                {bottlenecks.filter((b) => b.impact === "HIGH").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">High Impact</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bottlenecks.reduce((sum, b) => sum + b.count, 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  bottlenecks.reduce((sum, b) => sum + b.averageDelay, 0) /
                    bottlenecks.length
                )}{" "}
                days
              </p>
              <p className="text-xs text-gray-600 mt-1">Avg. Delay</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
