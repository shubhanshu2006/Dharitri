import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline"
    | "emerald"
    | "amber";
  size?: "sm" | "md" | "lg";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap";

    const variants = {
      default: "bg-paper-dim text-text border border-paper-line",
      success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      warning: "bg-amber-100 text-amber-700 border border-amber-200",
      danger: "bg-red-100 text-red-700 border border-red-200",
      info: "bg-blue-100 text-blue-700 border border-blue-200",
      outline: "bg-transparent text-text border border-paper-line",
      emerald: "bg-emerald-600 text-white",
      amber: "bg-amber-500 text-white",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
