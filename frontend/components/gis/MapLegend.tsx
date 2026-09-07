import { Card, CardContent } from "@/components/ui";

interface LegendItem {
  label: string;
  color: string;
}

const PARCEL_LEGEND: LegendItem[] = [
  { label: "Acquired", color: "#10b981" },
  { label: "In Acquisition", color: "#f59e0b" },
  { label: "Identified", color: "#06b6d4" },
  { label: "Disputed", color: "#ef4444" },
  { label: "Other", color: "#94a3b8" },
];

export function MapLegend() {
  return (
    <Card className="absolute bottom-20 left-4 z-10">
      <CardContent className="p-3">
        <h4 className="text-xs font-semibold text-text mb-2">Parcel Status</h4>
        <div className="space-y-1.5">
          {PARCEL_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-white/50"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-paper-line">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-4 h-1 border-2 border-emerald-600 border-dashed" />
            <span className="text-xs text-muted">Project Boundary</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
