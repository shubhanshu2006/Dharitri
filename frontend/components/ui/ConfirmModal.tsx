"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, Trash2, CheckCircle2, X } from "lucide-react";
import { Button } from "./Button";

export type ConfirmVariant = "danger" | "emerald" | "amber" | "info";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "emerald",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-50 text-red-600 border border-red-200",
      icon: <Trash2 className="w-5 h-5" />,
      buttonVariant: "danger" as const,
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      icon: <CheckCircle2 className="w-5 h-5" />,
      buttonVariant: "primary" as const,
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600 border border-amber-200",
      icon: <AlertTriangle className="w-5 h-5" />,
      buttonVariant: "secondary" as const,
    },
    info: {
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: <Info className="w-5 h-5" />,
      buttonVariant: "primary" as const,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.emerald;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-paper-line overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          {/* Subtle top decorative glow */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${currentVariant.iconBg}`}
              >
                {currentVariant.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    id="confirm-dialog-title"
                    className="text-base font-semibold text-text tracking-tight font-sans"
                  >
                    {title}
                  </h3>
                  {!isLoading && (
                    <button
                      onClick={onClose}
                      className="text-muted hover:text-text rounded-lg p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-2 text-sm text-muted font-sans leading-relaxed">
                  {description}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-paper-line/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant={currentVariant.buttonVariant}
                size="sm"
                onClick={onConfirm}
                loading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
