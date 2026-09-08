"use client";

import { useState } from "react";
import {
  RRStatus,
  RR_STATUS_LABELS,
  RR_STATUS_TRANSITIONS,
  RR_STATUS_DESCRIPTIONS,
} from "@/lib/constants/rr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Alert,
} from "@/components/ui";
import { AlertCircle, ArrowRight } from "lucide-react";

interface RRStatusTransitionProps {
  currentStatus: RRStatus;
  isOpen: boolean;
  onClose: () => void;
  onTransition: (targetStatus: RRStatus) => void;
  isLoading?: boolean;
}

export function RRStatusTransition({
  currentStatus,
  isOpen,
  onClose,
  onTransition,
  isLoading = false,
}: RRStatusTransitionProps) {
  const [selectedStatus, setSelectedStatus] = useState<RRStatus | null>(null);

  const availableTransitions = RR_STATUS_TRANSITIONS[currentStatus] || [];

  const handleTransition = () => {
    if (selectedStatus) {
      onTransition(selectedStatus);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-['Instrument_Sans']">
            Transition R&R Case Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Status</p>
            <p className="font-medium text-lg">
              {RR_STATUS_LABELS[currentStatus]}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {RR_STATUS_DESCRIPTIONS[currentStatus]}
            </p>
          </div>

          {/* Available Transitions */}
          {availableTransitions.length === 0 ? (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-medium">No transitions available</p>
                <p className="text-sm">
                  The current status does not allow any status transitions.
                </p>
              </div>
            </Alert>
          ) : (
            <div>
              <p className="text-sm font-medium mb-3">
                Select target status:
              </p>
              <div className="space-y-2">
                {availableTransitions.map((targetStatus) => (
                  <button
                    key={targetStatus}
                    onClick={() => setSelectedStatus(targetStatus)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      selectedStatus === targetStatus
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {RR_STATUS_LABELS[targetStatus]}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {RR_STATUS_DESCRIPTIONS[targetStatus]}
                        </p>
                      </div>
                      <ArrowRight
                        className={`h-5 w-5 ml-4 ${
                          selectedStatus === targetStatus
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleTransition}
            disabled={!selectedStatus || isLoading || availableTransitions.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Transitioning..." : "Confirm Transition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
