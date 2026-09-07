import { Role, ROLE_COLORS, ROLE_DESCRIPTIONS } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md";
  showDescription?: boolean;
}

export function RoleBadge({ role, size = "md", showDescription = false }: RoleBadgeProps) {
  // Get color mapping or use default
  const colors = ROLE_COLORS[role as Role] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  // Format role name for display
  const displayName = role
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  const description = ROLE_DESCRIPTIONS[role as Role];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full border",
          colors.bg,
          colors.text,
          colors.border,
          sizeClasses[size]
        )}
      >
        {displayName}
      </span>
      {showDescription && description && (
        <span className="text-xs text-muted">{description}</span>
      )}
    </div>
  );
}
