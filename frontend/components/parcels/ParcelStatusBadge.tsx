import {
  ParcelStatus,
  PARCEL_STATUS_LABELS,
  PARCEL_STATUS_COLORS,
} from "@/lib/constants/parcels";
import { cn } from "@/lib/utils";

interface ParcelStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function ParcelStatusBadge({
  status,
  size = "md",
}: ParcelStatusBadgeProps) {
  const colors = PARCEL_STATUS_COLORS[status as ParcelStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  const label = PARCEL_STATUS_LABELS[status as ParcelStatus] || status;

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
