"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { METRIC_COLORS, type MetricColor } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: TrendDataPoint[];
  color?: MetricColor;
  showTrend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function TrendChart({
  title,
  data,
  color = "primary",
  showTrend = true,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}: TrendChartProps) {
  const colors = METRIC_COLORS[color];

  // Calculate trend
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const trendPercentage =
    firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;
  const isPositive = trendPercentage >= 0;

  // Calculate max value for normalization
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-['Instrument_Sans']">
            {title}
          </CardTitle>
          {showTrend && data.length > 1 && (
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : trendPercentage < 0 ? (
                <TrendingDown className="h-5 w-5 text-red-600" />
              ) : (
                <Minus className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  isPositive
                    ? "text-emerald-600"
                    : trendPercentage < 0
                    ? "text-red-600"
                    : "text-gray-600"
                )}
              >
                {trendPercentage > 0 ? "+" : ""}
                {trendPercentage}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {data.map((point, index) => {
            const heightPercentage =
              range > 0 ? ((point.value - minValue) / range) * 100 : 50;

            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600 truncate">
                  {point.label}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 flex items-center justify-end pr-2",
                        colors.bg.replace("50", "500")
                      )}
                      style={{ width: `${Math.max(heightPercentage, 5)}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {valueFormatter(point.value)}
                      </span>
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

// Simple Line Chart Component
interface LineChartProps {
  title: string;
  data: TrendDataPoint[];
  color?: MetricColor;
  height?: number;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function LineChart({
  title,
  data,
  color = "primary",
  height = 200,
  showValues = false,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}: LineChartProps) {
  const colors = METRIC_COLORS[color];

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-['Instrument_Sans']">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  });
  const path = `M ${points.join(" L ")}`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-['Instrument_Sans']">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Grid lines */}
            <line
              x1="0"
              y1="25"
              x2="100"
              y2="25"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="75"
              x2="100"
              y2="75"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />

            {/* Area under curve */}
            <path
              d={`${path} L 100,100 L 0,100 Z`}
              fill={colors.bg.replace("bg-", "")}
              fillOpacity="0.3"
            />

            {/* Line */}
            <path
              d={path}
              fill="none"
              stroke={colors.icon.replace("text-", "")}
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* Points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.value - minValue) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={colors.icon.replace("text-", "")}
                />
              );
            })}
          </svg>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          {data.map((point, index) => (
            <div key={index} className="text-center">
              <div>{point.label}</div>
              {showValues && (
                <div className="font-semibold text-gray-900 mt-1">
                  {valueFormatter(point.value)}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
