export interface VerificationCheck {
  checkName: string;
  status: "PASS" | "FAIL" | "WARNING" | "PENDING";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationResult {
  entityType: string;
  entityId: string;
  checks: VerificationCheck[];
  overallStatus: "PASS" | "FAIL" | "WARNING" | "PENDING";
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  pendingChecks: number;
  verifiedAt: Date;
}

export interface RoutingDecision {
  targetLevel: "STATE" | "DISTRICT" | "TEHSIL" | "PROJECT";
  targetId: string;
  assigneeId?: string;
  reason: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}
