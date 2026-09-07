import { Card, CardHeader, CardTitle, CardContent, Loading } from "@/components/ui";
import { Clock, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  actorName?: string;
  metadata?: Record<string, any>;
}

interface ParcelTimelineProps {
  events: TimelineEvent[] | undefined;
  isLoading: boolean;
}

export function ParcelTimeline({ events, isLoading }: ParcelTimelineProps) {
  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading timeline..." />
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">No timeline events available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-paper-line" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow" />

                <div className="bg-paper-dim rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text">
                      {event.eventType.replace(/_/g, " ")}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(event.timestamp)}
                    </div>
                  </div>

                  <p className="text-sm text-text mb-2">{event.description}</p>

                  {event.actorName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <User className="w-3 h-3" />
                      <span>{event.actorName}</span>
                    </div>
                  )}

                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-paper-line">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted hover:text-text">
                          View details
                        </summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
