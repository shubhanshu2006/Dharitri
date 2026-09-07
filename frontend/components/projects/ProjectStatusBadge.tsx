import {
  ProjectStatus,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from "@/lib/constants/projects";
import { cn } from "@/lib/utils";

interface ProjectStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function ProjectStatusBadge({
  status,
  size = "md",
}: ProjectStatusBadgeProps) {
  const colors = PROJECT_STATUS_COLORS[status as ProjectStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  const label = PROJECT_STATUS_LABELS[status as ProjectStatus] || status;

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
