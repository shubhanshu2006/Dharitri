import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
} from "@/components/ui";
import { AcquisitionStatusBadge } from "./AcquisitionStatusBadge";
import { ArrowRight, User, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { StatusTransition } from "@/hooks/useAcquisition";

interface AcquisitionTimelineProps {
  transitions: StatusTransition[] | undefined;
  isLoading: boolean;
}

export function AcquisitionTimeline({
  transitions,
  isLoading,
}: AcquisitionTimelineProps) {
  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading status history..." />
        </CardContent>
      </Card>
    );
  }

  if (!transitions || transitions.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">No status transitions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-paper-line" />

          {/* Transitions */}
          <div className="space-y-6">
            {transitions.map((transition, index) => (
              <div key={transition.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow" />

                <div className="bg-paper-dim rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AcquisitionStatusBadge
                      status={transition.fromState}
                      size="sm"
                    />
                    <ArrowRight className="w-4 h-4 text-muted" />
                    <AcquisitionStatusBadge
                      status={transition.toState}
                      size="sm"
                    />
                  </div>

                  {transition.reason && (
                    <p className="text-sm text-text mb-2">
                      {transition.reason}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted">
                    {transition.actorName && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        <span>{transition.actorName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(transition.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
