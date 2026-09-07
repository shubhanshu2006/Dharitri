"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { X, AlertTriangle } from "lucide-react";

interface CorrectionDialogProps {
  onRequestCorrection: (reason: string) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function CorrectionDialog({
  onRequestCorrection,
  onClose,
  isSubmitting,
}: CorrectionDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for requesting correction");
      return;
    }

    await onRequestCorrection(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Request Correction
            </CardTitle>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Provide detailed feedback on what needs to be corrected in this
            compensation assessment.
          </p>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Correction Required <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="Describe what needs to be corrected and why..."
              className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-paper-line">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !reason.trim()}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Request Correction"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
