"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Alert,
} from "@/components/ui";
import {
  ChecklistItemStatus,
  CHECKLIST_STATUS_LABELS,
  CHECKLIST_STATUS_COLORS,
  PossessionStatus,
} from "@/lib/constants/possession";
import {
  PossessionChecklistItem,
  useUpdatePossessionChecklistItem,
} from "@/hooks/usePossession";
import { CheckCircle, XCircle, Circle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PossessionChecklistProps {
  items: PossessionChecklistItem[];
  possessionStatus: string;
  readonly?: boolean;
}

export function PossessionChecklist({
  items,
  possessionStatus,
  readonly = false,
}: PossessionChecklistProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ChecklistItemStatus>(
    ChecklistItemStatus.PENDING
  );
  const [remarks, setRemarks] = useState("");

  const isRecorded = possessionStatus === PossessionStatus.RECORDED;
  const canEdit = !readonly && !isRecorded;

  const handleEdit = (item: PossessionChecklistItem) => {
    setEditingItemId(item.id);
    setSelectedStatus(item.status as ChecklistItemStatus);
    setRemarks(item.remarks || "");
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setSelectedStatus(ChecklistItemStatus.PENDING);
    setRemarks("");
  };

  const updateMutation = useUpdatePossessionChecklistItem(editingItemId || "");

  const handleSave = async () => {
    if (!editingItemId) return;

    try {
      await updateMutation.mutateAsync({
        status: selectedStatus,
        remarks: remarks || undefined,
      });
      toast.success("Checklist item updated");
      handleCancel();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update checklist item"
      );
    }
  };

  const completedCount = items.filter(
    (item) =>
      item.status === ChecklistItemStatus.PASS ||
      item.status === ChecklistItemStatus.NOT_APPLICABLE
  ).length;
  const totalCount = items.length;
  const allCompleted = completedCount === totalCount;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ChecklistItemStatus.PASS:
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case ChecklistItemStatus.FAIL:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case ChecklistItemStatus.NOT_APPLICABLE:
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Instrument_Sans']">
            Possession Checklist
          </CardTitle>
          <Badge
            className={cn(
              allCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {completedCount} / {totalCount} Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!allCompleted && !isRecorded && (
          <Alert variant="info" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p className="font-medium">Complete all checklist items</p>
              <p className="text-sm">
                All items must be marked as Pass or N/A before recording possession.
              </p>
            </div>
          </Alert>
        )}

        <div className="space-y-3">
          {items.map((item) => {
            const isEditing = editingItemId === item.id;
            const colors =
              CHECKLIST_STATUS_COLORS[item.status as ChecklistItemStatus];

            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors",
                  isEditing ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                )}
              >
                {isEditing ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <p className="font-medium">{item.checkName}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <div className="flex gap-2">
                        {Object.values(ChecklistItemStatus).map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={cn(
                              "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors",
                              selectedStatus === status
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {CHECKLIST_STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Remarks (optional)
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add any relevant notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {updateMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <p className="font-medium">{item.checkName}</p>
                          {item.remarks && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.remarks}
                            </p>
                          )}
                          {item.completedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Completed: {formatDate(item.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "border",
                            colors.bg,
                            colors.text,
                            colors.border
                          )}
                        >
                          {CHECKLIST_STATUS_LABELS[item.status as ChecklistItemStatus]}
                        </Badge>
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
