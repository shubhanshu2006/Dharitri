import {
  VerificationStatus,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
  VerificationSeverity,
  VERIFICATION_SEVERITY_LABELS,
  VERIFICATION_SEVERITY_COLORS,
} from "@/lib/constants/verification";
import { cn } from "@/lib/utils";

interface VerificationStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function VerificationStatusBadge({
  status,
  size = "md",
}: VerificationStatusBadgeProps) {
  const colors = VERIFICATION_STATUS_COLORS[status as VerificationStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  const label = VERIFICATION_STATUS_LABELS[status as VerificationStatus] || status;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full border",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size]
      )}
    >
      {label}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: string;
  size?: "sm" | "md";
}

export function SeverityBadge({ severity, size = "sm" }: SeverityBadgeProps) {
  const colors = VERIFICATION_SEVERITY_COLORS[severity as VerificationSeverity] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  };

  const label =
    VERIFICATION_SEVERITY_LABELS[severity as VerificationSeverity] || severity;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full border",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size]
      )}
    >
      {label}
    </span>
  );
}
