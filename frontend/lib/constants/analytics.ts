// Analytics & AI Constants and Types

// Risk Score Types
export interface RiskFactor {
  name: string;
  contribution: number;
  explanation: string;
}

export interface RiskScore {
  score: number;
  riskLevel: string;
  algorithmVersion: string;
  generatedAt: string;
  factors: RiskFactor[];
}

// Risk Levels
export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const RISK_LEVEL_CONFIG = {
  [RiskLevel.LOW]: {
    label: "Low Risk",
    color: "emerald",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-600",
    borderClass: "border-emerald-200",
    threshold: { min: 0, max: 30 },
  },
  [RiskLevel.MEDIUM]: {
    label: "Medium Risk",
    color: "amber",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    iconClass: "text-amber-600",
    borderClass: "border-amber-200",
    threshold: { min: 31, max: 60 },
  },
  [RiskLevel.HIGH]: {
    label: "High Risk",
    color: "red",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    iconClass: "text-red-600",
    borderClass: "border-red-200",
    threshold: { min: 61, max: 80 },
  },
  [RiskLevel.CRITICAL]: {
    label: "Critical Risk",
    color: "red",
    bgClass: "bg-red-100",
    textClass: "text-red-900",
    iconClass: "text-red-700",
    borderClass: "border-red-300",
    threshold: { min: 81, max: 100 },
  },
} as const;

// Anomaly Types
export interface Anomaly {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  detectedAt: string;
  entityType: string;
  entityId: string;
  recommendations: string[];
}

export const ANOMALY_TYPE_LABELS = {
  UNUSUAL_DELAY: "Unusual Delay",
  PAYMENT_PATTERN: "Payment Pattern Anomaly",
  DOCUMENT_ISSUE: "Document Issue",
  VERIFICATION_DELAY: "Verification Delay",
  COMPENSATION_OUTLIER: "Compensation Outlier",
  RR_DELAY: "R&R Delay",
  POSSESSION_DELAY: "Possession Delay",
} as const;

// Analytics Query Types
export interface AnalyticsQuery {
  projectId?: string;
  stateId?: string;
  districtId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
}

// Trend Data Types
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AcquisitionTrends {
  parcelsAcquired: TrendDataPoint[];
  landAcquired: TrendDataPoint[];
  casesCompleted: TrendDataPoint[];
}

export interface CompensationTrends {
  assessmentsCompleted: TrendDataPoint[];
  totalAmount: TrendDataPoint[];
  averageAmount: TrendDataPoint[];
}

export interface PaymentAnalytics {
  paymentsInitiated: TrendDataPoint[];
  paymentsCompleted: TrendDataPoint[];
  paymentsFailed: TrendDataPoint[];
  averageProcessingTime: TrendDataPoint[];
  successRate: TrendDataPoint[];
}

export interface RRTrends {
  casesCreated: TrendDataPoint[];
  casesCompleted: TrendDataPoint[];
  beneficiariesSupported: TrendDataPoint[];
}

export interface PossessionTrends {
  possessionRecorded: TrendDataPoint[];
  possessionPending: TrendDataPoint[];
}

// Bottleneck Types
export interface Bottleneck {
  stage: string;
  count: number;
  averageDelay: number;
  impact: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  recommendations: string[];
}

// Helper Functions
export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score <= 30) return RiskLevel.LOW;
  if (score <= 60) return RiskLevel.MEDIUM;
  if (score <= 80) return RiskLevel.HIGH;
  return RiskLevel.CRITICAL;
}

export function getRiskConfig(riskLevel: string) {
  return RISK_LEVEL_CONFIG[riskLevel as RiskLevel] || RISK_LEVEL_CONFIG[RiskLevel.LOW];
}

export function formatRiskScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function getAnomalySeverityColor(severity: string) {
  switch (severity) {
    case "HIGH":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      };
    case "MEDIUM":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case "LOW":
    default:
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
  }
}

// Risk Factor Categories
export const RISK_FACTOR_CATEGORIES = {
  timeline: {
    label: "Timeline Issues",
    icon: "Clock",
    factors: ["overdue_milestones", "verification_delay", "rr_delay", "possession_delay"],
  },
  financial: {
    label: "Financial Issues",
    icon: "DollarSign",
    factors: ["payment_failures", "compensation_pending"],
  },
  operational: {
    label: "Operational Issues",
    icon: "AlertTriangle",
    factors: ["verification_backlog", "document_corrections", "rr_backlog"],
  },
} as const;

// Suggested Actions
export interface SuggestedAction {
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
  impact: string;
  category: string;
}

export function generateSuggestedActions(factors: RiskFactor[]): SuggestedAction[] {
  const actions: SuggestedAction[] = [];

  factors.forEach((factor) => {
    switch (factor.name) {
      case "overdue_milestones":
        actions.push({
          priority: "HIGH",
          action: "Review and update project timeline with all stakeholders",
          impact: "Reduces project delay risk and improves coordination",
          category: "Timeline",
        });
        break;
      case "verification_backlog":
        actions.push({
          priority: "HIGH",
          action: "Allocate additional verification officers to clear backlog",
          impact: "Accelerates acquisition process",
          category: "Operational",
        });
        break;
      case "payment_failures":
        actions.push({
          priority: "HIGH",
          action: "Investigate payment failures and resolve beneficiary account issues",
          impact: "Improves beneficiary trust and payment success rate",
          category: "Financial",
        });
        break;
      case "rr_backlog":
        actions.push({
          priority: "MEDIUM",
          action: "Expedite R&R assessments and provision allocation",
          impact: "Ensures compliance and beneficiary satisfaction",
          category: "Operational",
        });
        break;
      case "document_corrections":
        actions.push({
          priority: "MEDIUM",
          action: "Provide clear guidelines to officers for document submission",
          impact: "Reduces rework and speeds up process",
          category: "Operational",
        });
        break;
      case "compensation_pending":
        actions.push({
          priority: "MEDIUM",
          action: "Complete compensation awards for assessed cases",
          impact: "Enables payment processing",
          category: "Financial",
        });
        break;
      case "possession_pending":
        actions.push({
          priority: "LOW",
          action: "Schedule field visits to record pending possession",
          impact: "Completes acquisition process",
          category: "Timeline",
        });
        break;
    }
  });

  // Sort by priority
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
