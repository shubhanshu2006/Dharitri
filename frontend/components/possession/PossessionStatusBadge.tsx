"use client";

import { Badge } from "@/components/ui";
import {
  PossessionStatus,
  POSSESSION_STATUS_LABELS,
  POSSESSION_STATUS_COLORS,
} from "@/lib/constants/possession";
import { cn } from "@/lib/utils";

interface PossessionStatusBadgeProps {
  status: string;
  className?: string;
}

export function PossessionStatusBadge({
  status,
  className,
}: PossessionStatusBadgeProps) {
  const possessionStatus = status as PossessionStatus;
  const label = POSSESSION_STATUS_LABELS[possessionStatus] || status;
  const colors = POSSESSION_STATUS_COLORS[possessionStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  };

  return (
    <Badge
      className={cn(
        "font-medium border",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {label}
    </Badge>
  );
}
