import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({
  size = "md",
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-emerald-600",
          sizes[size]
        )}
      />
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-paper/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-paper-dim",
        className
      )}
      {...props}
    />
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl border border-paper-line p-6 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-4 w-1/3" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-paper-line overflow-hidden">
      <div className="p-4 border-b border-paper-line">
        <LoadingSkeleton className="h-6 w-1/4" />
      </div>
      <div className="divide-y divide-paper-line">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-1/6" />
            <LoadingSkeleton className="h-4 w-1/5" />
            <LoadingSkeleton className="h-4 w-1/6" />
            <LoadingSkeleton className="h-8 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
