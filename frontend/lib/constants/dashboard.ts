// Dashboard Constants and Types

export interface NationalMetrics {
  projects: {
    total: number;
    completed: number;
  };
  land: {
    proposedSquareMeters: number;
    acquiredSquareMeters: number;
    proposedAcres: number;
    acquiredAcres: number;
  };
  parcels: {
    total: number;
  };
  verification?: {
    verified: number;
  };
  compensation: {
    totalAssessments: number;
    totalAssessed: number;
  };
  payments: {
    totalPayments: number;
    initiatedAmount: number;
    creditedAmount: number;
    failedPayments: number;
  };
  rr: {
    totalCases: number;
    completed: number;
    inProgress: number;
  };
  possession: {
    totalRecords: number;
    recorded: number;
    pending: number;
  };
}

export interface StateMetrics extends NationalMetrics {
  stateId: string;
}

export interface DistrictMetrics extends NationalMetrics {
  districtId: string;
}

export interface ProjectMetrics {
  project: {
    id: string;
    name: string;
    status: string;
    state: string;
    district?: string;
  };
  land: {
    proposedSquareMeters: number;
    acquiredSquareMeters: number;
    proposedAcres: number;
    acquiredAcres: number;
  };
  parcels: {
    total: number;
  };
  cases: {
    total: number;
    draft: number;
    verificationPending: number;
    verified: number;
    completed: number;
  };
  compensation: {
    totalAssessments: number;
    totalAssessed: number;
  };
  payments: {
    totalPayments: number;
    initiatedAmount: number;
    creditedAmount: number;
    failedPayments: number;
  };
  rr: {
    totalCases: number;
    completed: number;
    inProgress: number;
  };
  possession: {
    totalRecords: number;
    recorded: number;
    pending: number;
  };
  milestones: {
    total: number;
    completed: number;
    overdue: number;
  };
}

// Dashboard Role Types
export enum DashboardRole {
  EXECUTIVE = "EXECUTIVE",
  STATE = "STATE",
  DISTRICT = "DISTRICT",
  PROJECT = "PROJECT",
}

// Metric Card Colors
export const METRIC_COLORS = {
  primary: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "text-blue-600",
    border: "border-blue-200",
  },
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "text-emerald-600",
    border: "border-emerald-200",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-600",
    border: "border-amber-200",
  },
  danger: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "text-red-600",
    border: "border-red-200",
  },
  info: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
  neutral: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    icon: "text-gray-600",
    border: "border-gray-200",
  },
} as const;

export type MetricColor = keyof typeof METRIC_COLORS;

// Helper Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatArea(sqMeters: number, unit: "sqm" | "acres" = "acres"): string {
  if (unit === "acres") {
    const acres = sqMeters / 4046.86;
    return `${formatNumber(Math.round(acres))} acres`;
  }
  return `${formatNumber(Math.round(sqMeters))} m²`;
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getProgressColor(percentage: number): MetricColor {
  if (percentage >= 90) return "success";
  if (percentage >= 70) return "primary";
  if (percentage >= 50) return "warning";
  return "danger";
}

export function getCompletionStatus(
  completed: number,
  total: number
): { percentage: number; color: MetricColor; label: string } {
  const percentage = calculatePercentage(completed, total);
  const color = getProgressColor(percentage);
  
  let label = "Low Progress";
  if (percentage >= 90) label = "Excellent Progress";
  else if (percentage >= 70) label = "Good Progress";
  else if (percentage >= 50) label = "Moderate Progress";
  
  return { percentage, color, label };
}

// Trend calculation
export interface TrendData {
  direction: "up" | "down" | "neutral";
  percentage: number;
  isPositive: boolean;
}

export function calculateTrend(
  current: number,
  previous: number,
  higherIsBetter: boolean = true
): TrendData {
  if (previous === 0) {
    return { direction: "neutral", percentage: 0, isPositive: true };
  }

  const percentageChange = ((current - previous) / previous) * 100;
  const direction =
    percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "neutral";
  const isPositive = higherIsBetter
    ? percentageChange >= 0
    : percentageChange <= 0;

  return {
    direction,
    percentage: Math.abs(Math.round(percentageChange)),
    isPositive,
  };
}
