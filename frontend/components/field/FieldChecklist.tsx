"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import {
  FieldChecklistStatus,
  CHECKLIST_STATUS_LABELS,
  CHECKLIST_STATUS_COLORS,
} from "@/lib/constants/field";
import { CheckCircle, XCircle, Circle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  checkName: string;
  status: string;
  remarks?: string;
}

interface FieldChecklistProps {
  items: ChecklistItem[];
  onUpdateItem: (itemId: string, status: FieldChecklistStatus) => void;
  readonly?: boolean;
  className?: string;
}

export function FieldChecklist({
  items,
  onUpdateItem,
  readonly = false,
  className,
}: FieldChecklistProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const completedCount = items.filter(
    (item) =>
      item.status === FieldChecklistStatus.PASS ||
      item.status === FieldChecklistStatus.NOT_APPLICABLE
  ).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case FieldChecklistStatus.PASS:
        return <CheckCircle className="h-8 w-8 text-emerald-600" />;
      case FieldChecklistStatus.FAIL:
        return <XCircle className="h-8 w-8 text-red-600" />;
      case FieldChecklistStatus.NOT_APPLICABLE:
        return <MinusCircle className="h-8 w-8 text-gray-400" />;
      default:
        return <Circle className="h-8 w-8 text-gray-300" />;
    }
  };

  const handleStatusChange = (itemId: string, status: FieldChecklistStatus) => {
    onUpdateItem(itemId, status);
    setSelectedItemId(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-['Instrument_Sans']">
            Checklist
          </CardTitle>
          <Badge
            className={cn(
              "text-base px-3 py-1",
              completedCount === items.length
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {completedCount}/{items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;
          const statusColors =
            CHECKLIST_STATUS_COLORS[item.status as FieldChecklistStatus];

          return (
            <div
              key={item.id}
              className={cn(
                "border-2 rounded-lg transition-all",
                isSelected ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
              )}
            >
              {/* Item Header - Large Touch Target */}
              <button
                onClick={() =>
                  !readonly && setSelectedItemId(isSelected ? null : item.id)
                }
                className="w-full p-4 flex items-start gap-4 text-left"
                style={{ minHeight: "64px" }}
                disabled={readonly}
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 leading-snug">
                    {item.checkName}
                  </p>
                  {item.remarks && (
                    <p className="text-sm text-gray-600 mt-1">{item.remarks}</p>
                  )}
                </div>
                <Badge
                  className={cn(
                    "ml-2 flex-shrink-0",
                    statusColors.bg,
                    statusColors.text
                  )}
                >
                  {CHECKLIST_STATUS_LABELS[item.status as FieldChecklistStatus]}
                </Badge>
              </button>

              {/* Status Selection - Large Buttons */}
              {isSelected && !readonly && (
                <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusChange(item.id, FieldChecklistStatus.PASS)}
                    className={cn(
                      "h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-colors font-medium",
                      item.status === FieldChecklistStatus.PASS
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    )}
                  >
                    <CheckCircle className="h-6 w-6 mb-1" />
                    <span className="text-sm">Pass</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(item.id, FieldChecklistStatus.FAIL)}
                    className={cn(
                      "h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-colors font-medium",
                      item.status === FieldChecklistStatus.FAIL
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 hover:border-red-300 hover:bg-red-50"
                    )}
                  >
                    <XCircle className="h-6 w-6 mb-1" />
                    <span className="text-sm">Fail</span>
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(item.id, FieldChecklistStatus.NOT_APPLICABLE)
                    }
                    className={cn(
                      "h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-colors font-medium col-span-2",
                      item.status === FieldChecklistStatus.NOT_APPLICABLE
                        ? "border-gray-400 bg-gray-50 text-gray-700"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    )}
                  >
                    <MinusCircle className="h-6 w-6 mb-1" />
                    <span className="text-sm">Not Applicable</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
