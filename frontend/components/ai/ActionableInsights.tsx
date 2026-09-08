import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { Lightbulb, ArrowRight, Target } from "lucide-react";
import {
  generateSuggestedActions,
  type RiskFactor,
  type SuggestedAction,
} from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";

interface ActionableInsightsProps {
  factors: RiskFactor[];
  title?: string;
  className?: string;
}

export function ActionableInsights({
  factors,
  title = "Suggested Actions",
  className,
}: ActionableInsightsProps) {
  const actions = generateSuggestedActions(factors);

  if (actions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-emerald-900">
              All systems optimal
            </p>
            <p className="text-sm text-gray-600 mt-1">
              No immediate actions required
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityConfig = (priority: SuggestedAction["priority"]) => {
    switch (priority) {
      case "HIGH":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-300",
          label: "High Priority",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-300",
          label: "Medium Priority",
        };
      case "LOW":
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-300",
          label: "Low Priority",
        };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-['Instrument_Sans'] flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-amber-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          AI-recommended actions to mitigate identified risks
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action, index) => {
            const config = getPriorityConfig(action.priority);

            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={cn("text-xs", config.bg, config.text)}>
                        {config.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-700"
                      >
                        {action.category}
                      </Badge>
                    </div>

                    {/* Action */}
                    <h4 className={cn("font-semibold mb-2", config.text)}>
                      {action.action}
                    </h4>

                    {/* Impact */}
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                      <p>
                        <span className="font-medium">Expected Impact:</span>{" "}
                        {action.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-700">
                {actions.filter((a) => a.priority === "HIGH").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">
                {actions.filter((a) => a.priority === "MEDIUM").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Medium Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">
                {actions.filter((a) => a.priority === "LOW").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Low Priority</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
