"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendDataPoint } from "@/lib/constants/analytics";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/constants/dashboard";

interface TrendAnalysisProps {
  title: string;
  data: TrendDataPoint[];
  color?: "blue" | "emerald" | "amber" | "red" | "purple";
  valueFormatter?: (value: number) => string;
  showTrend?: boolean;
  className?: string;
}

const COLOR_CONFIGS = {
  blue: {
    line: "stroke-emerald-600",
    area: "fill-emerald-500/20",
    dot: "fill-emerald-600",
    bg: "bg-emerald-500",
  },
  emerald: {
    line: "stroke-emerald-600",
    area: "fill-emerald-500/20",
    dot: "fill-emerald-600",
    bg: "bg-emerald-500",
  },
  amber: {
    line: "stroke-amber-600",
    area: "fill-amber-500/20",
    dot: "fill-amber-600",
    bg: "bg-amber-500",
  },
  red: {
    line: "stroke-red-600",
    area: "fill-red-500/20",
    dot: "fill-red-600",
    bg: "bg-red-500",
  },
  purple: {
    line: "stroke-emerald-700",
    area: "fill-emerald-600/20",
    dot: "fill-emerald-700",
    bg: "bg-emerald-700",
  },
};

export function TrendAnalysis({
  title,
  data,
  color = "emerald",
  valueFormatter = (v) => formatNumber(v),
  showTrend = true,
  className,
}: TrendAnalysisProps) {
  const colors = COLOR_CONFIGS[color];

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-['Instrument_Sans']">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-400">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const trendPercentage =
    firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;
  const isPositive = trendPercentage >= 0;

  // Calculate chart dimensions
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const width = 100;
  const height = 100;
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((point.value - minValue) / range) * height;
    return `${x},${y}`;
  });
  const path = `M ${points.join(" L ")}`;
  const areaPath = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-['Instrument_Sans']">{title}</CardTitle>
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
        <div className="space-y-6">
          {/* Current Value */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-['Instrument_Sans'] text-gray-900">
              {valueFormatter(lastValue)}
            </span>
            <span className="text-sm text-gray-500">current</span>
          </div>

          {/* SVG Chart */}
          <div className="relative h-48">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {/* Grid lines */}
              <line
                x1="0"
                y1="25"
                x2={width}
                y2="25"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="50"
                x2={width}
                y2="50"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="75"
                x2={width}
                y2="75"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />

              {/* Area under curve */}
              <path d={areaPath} className={colors.area} />

              {/* Line */}
              <path
                d={path}
                fill="none"
                className={colors.line}
                strokeWidth="2"
              />

              {/* Data points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * width;
                const y = height - ((point.value - minValue) / range) * height;
                return (
                  <circle key={index} cx={x} cy={y} r="2" className={colors.dot} />
                );
              })}
            </svg>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-600">
            {data.length <= 7
              ? data.map((point, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium">{point.label || point.date}</div>
                    <div className="text-gray-500 mt-1">
                      {valueFormatter(point.value)}
                    </div>
                  </div>
                ))
              : [0, Math.floor(data.length / 2), data.length - 1].map((index) => {
                  const point = data[index];
                  return (
                    <div key={index} className="text-center">
                      <div className="font-medium">{point.label || point.date}</div>
                      <div className="text-gray-500 mt-1">
                        {valueFormatter(point.value)}
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Minimum</p>
              <p className="text-lg font-semibold text-gray-900">
                {valueFormatter(minValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Average</p>
              <p className="text-lg font-semibold text-gray-900">
                {valueFormatter(
                  Math.round(
                    data.reduce((sum, d) => sum + d.value, 0) / data.length
                  )
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Maximum</p>
              <p className="text-lg font-semibold text-gray-900">
                {valueFormatter(maxValue)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
