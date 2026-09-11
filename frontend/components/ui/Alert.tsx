import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  X,
} from "lucide-react";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const icons = {
  success: CheckCircle,
  warning: AlertCircle,
  danger: XCircle,
  info: Info,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      dismissible = false,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const DefaultIcon = icons[variant];

    const variants = {
      success: "bg-emerald-50 border-emerald-200 text-emerald-800",
      warning: "bg-amber-50 border-amber-200 text-amber-800",
      danger: "bg-red-50 border-red-200 text-red-800",
      info: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
    };

    const iconColors = {
      success: "text-emerald-600",
      warning: "text-amber-600",
      danger: "text-red-600",
      info: "text-emerald-700",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative rounded-lg border p-4 flex items-start gap-3",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className={cn("shrink-0 mt-0.5", iconColors[variant])}>
          {icon || createElement(DefaultIcon, { className: "w-5 h-5" })}
        </div>
        <div className="flex-1 text-sm leading-relaxed">{children}</div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors",
              iconColors[variant]
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export const AlertTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold mb-1", className)}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm", className)} {...props} />
));

AlertDescription.displayName = "AlertDescription";
