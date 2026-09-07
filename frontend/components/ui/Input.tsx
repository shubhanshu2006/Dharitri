import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, icon, id, type = "text", ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
            {props.required && <span className="text-clay-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-all duration-200",
              "bg-white text-text placeholder:text-muted",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
              error
                ? "border-clay-500 focus:ring-clay-500"
                : "border-paper-line hover:border-emerald-400",
              icon && "pl-10",
              props.disabled && "bg-paper-dim cursor-not-allowed opacity-60",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-clay-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-clay-500" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
