import {
  AcquisitionStatus,
  ACQUISITION_STATUS_LABELS,
  ACQUISITION_STATUS_COLORS,
} from "@/lib/constants/acquisition";
import { cn } from "@/lib/utils";

interface AcquisitionStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function AcquisitionStatusBadge({
  status,
  size = "md",
}: AcquisitionStatusBadgeProps) {
  const colors = ACQUISITION_STATUS_COLORS[status as AcquisitionStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  const label =
    ACQUISITION_STATUS_LABELS[status as AcquisitionStatus] || status;

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
