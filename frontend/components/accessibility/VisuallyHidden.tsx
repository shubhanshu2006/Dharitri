import { createElement } from "react";
import { cn } from "@/lib/utils";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Visually Hidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers.
 * Use for labels, instructions, and descriptions that don't need to be visible.
 */
export function VisuallyHidden({
  children,
  className,
  as = "span",
}: VisuallyHiddenProps) {
  return createElement(
    as,
    { className: cn("sr-only", className) },
    children
  );
}
