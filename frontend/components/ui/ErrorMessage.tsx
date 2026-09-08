import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Accessible Error Message Component
 * 
 * Displays errors with proper ARIA attributes for screen readers.
 */
export function ErrorMessage({
  title = "Error",
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg",
        className
      )}
    >
      <AlertCircle
        className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-red-900">{title}</h3>
        <p className="text-sm text-red-800 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
