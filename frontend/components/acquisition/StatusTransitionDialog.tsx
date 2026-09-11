"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  AcquisitionStatus,
  ACQUISITION_STATUS_LABELS,
  ACQUISITION_STATUS_TRANSITIONS,
  ACQUISITION_STATUS_DESCRIPTIONS,
} from "@/lib/constants/acquisition";
import { AcquisitionStatusBadge } from "./AcquisitionStatusBadge";

interface StatusTransitionDialogProps {
  currentStatus: string;
  onTransition: (toStatus: string, reason?: string) => Promise<void>;
  onClose: () => void;
  isTransitioning: boolean;
}

export function StatusTransitionDialog({
  currentStatus,
  onTransition,
  onClose,
  isTransitioning,
}: StatusTransitionDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [reason, setReason] = useState("");

  const allowedTransitions =
    ACQUISITION_STATUS_TRANSITIONS[currentStatus as AcquisitionStatus] || [];

  const handleTransition = async () => {
    if (!selectedStatus) {
      toast.warning("Please select a status to transition to");
      return;
    }

    if (!reason.trim()) {
      toast.warning("Please provide a reason for this transition");
      return;
    }

    await onTransition(selectedStatus, reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Change Status</CardTitle>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors"
              disabled={isTransitioning}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Current Status
            </label>
            <div className="flex items-center gap-2">
              <AcquisitionStatusBadge status={currentStatus} />
              <span className="text-sm text-muted">
                {ACQUISITION_STATUS_DESCRIPTIONS[currentStatus as AcquisitionStatus]}
              </span>
            </div>
          </div>

          {/* Available Transitions */}
          {allowedTransitions.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">
                No status transitions are available from the current status.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-text mb-3">
                  Select New Status
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {allowedTransitions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedStatus === status
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-paper-line hover:border-emerald-300 bg-white"
                      }`}
                      disabled={isTransitioning}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                        <AcquisitionStatusBadge status={status} size="sm" />
                      </div>
                      <p className="text-xs text-muted pl-7">
                        {ACQUISITION_STATUS_DESCRIPTIONS[status as AcquisitionStatus]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Reason for Transition <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Describe the reason for this status change..."
                  className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
                  disabled={isTransitioning}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-paper-line">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTransition}
                  disabled={
                    isTransitioning || !selectedStatus || !reason.trim()
                  }
                  className="flex-1"
                >
                  {isTransitioning ? "Transitioning..." : "Confirm Transition"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isTransitioning}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
