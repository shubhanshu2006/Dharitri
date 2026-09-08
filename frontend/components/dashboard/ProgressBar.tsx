import { METRIC_COLORS, type MetricColor } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color?: MetricColor;
  showPercentage?: boolean;
  showValues?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  label,
  value,
  total,
  color = "primary",
  showPercentage = true,
  showValues = false,
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const colors = METRIC_COLORS[color];

  const heightClass = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }[size];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {showValues && (
            <span className="text-sm text-gray-600">
              {value.toLocaleString()} / {total.toLocaleString()}
            </span>
          )}
          {showPercentage && (
            <span className={cn("text-sm font-semibold", colors.text)}>
              {percentage}%
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "transition-all duration-500 ease-out rounded-full",
            heightClass,
            colors.bg.replace("50", "500")
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface MultiProgressBarProps {
  segments: Array<{
    label: string;
    value: number;
    color: MetricColor;
  }>;
  total: number;
  showLegend?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MultiProgressBar({
  segments,
  total,
  showLegend = true,
  size = "md",
  className,
}: MultiProgressBarProps) {
  const heightClass = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }[size];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden flex">
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total) * 100 : 0;
          const colors = METRIC_COLORS[segment.color];

          return (
            <div
              key={index}
              className={cn(
                "transition-all duration-500 ease-out",
                heightClass,
                colors.bg.replace("50", "500")
              )}
              style={{ width: `${percentage}%` }}
              title={`${segment.label}: ${segment.value}`}
            />
          );
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-4">
          {segments.map((segment, index) => {
            const percentage = total > 0 ? Math.round((segment.value / total) * 100) : 0;
            const colors = METRIC_COLORS[segment.color];

            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={cn("w-3 h-3 rounded-full", colors.bg.replace("50", "500"))}
                />
                <span className="text-sm text-gray-600">
                  {segment.label}: {segment.value.toLocaleString()} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
