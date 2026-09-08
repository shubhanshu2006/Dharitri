import {
  RRStatus,
  RR_STATUS_LABELS,
  RR_STATUS_COLORS,
} from "@/lib/constants/rr";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface RRStatusBadgeProps {
  status: RRStatus | string;
  className?: string;
}

export function RRStatusBadge({ status, className }: RRStatusBadgeProps) {
  const rrStatus = status as RRStatus;
  const label = RR_STATUS_LABELS[rrStatus] || status;
  const colors = RR_STATUS_COLORS[rrStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <Badge
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        "border font-medium",
        className
      )}
    >
      {label}
    </Badge>
  );
}
