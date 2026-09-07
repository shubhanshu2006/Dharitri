import { Card, CardHeader, CardTitle, CardContent, Loading, Badge } from "@/components/ui";
import { FileText, MapPin, RefreshCw } from "lucide-react";
import { formatDate, formatArea } from "@/lib/utils";

interface LandRecord {
  id: string;
  parcelId: string;
  surveyNumber?: string;
  ulpin?: string;
  area?: number;
  areaUnit?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  landCategory?: string;
  recordStatus?: string;
  sourceSystem?: string;
  sourceRecordId?: string;
  retrievedAt?: string;
}

interface LandRecordDisplayProps {
  landRecord: LandRecord | undefined;
  isLoading: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function LandRecordDisplay({
  landRecord,
  isLoading,
  onSync,
  isSyncing,
}: LandRecordDisplayProps) {
  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Land Record</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading land record..." />
        </CardContent>
      </Card>
    );
  }

  if (!landRecord) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Land Record</CardTitle>
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                Sync from Source
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">No land record data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Land Record
          </CardTitle>
          {onSync && (
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              Sync
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted mb-1">Survey Number</p>
            <p className="text-base text-text">
              {landRecord.surveyNumber || "—"}
            </p>
          </div>

          {landRecord.ulpin && (
            <div>
              <p className="text-sm font-medium text-muted mb-1">ULPIN</p>
              <p className="text-base font-mono text-text text-sm">
                {landRecord.ulpin}
              </p>
            </div>
          )}

          {landRecord.area && (
            <div>
              <p className="text-sm font-medium text-muted mb-1">Area</p>
              <p className="text-base text-text">
                {formatArea(landRecord.area, landRecord.areaUnit || "sqm")}
              </p>
            </div>
          )}

          {landRecord.landCategory && (
            <div>
              <p className="text-sm font-medium text-muted mb-1">Land Category</p>
              <p className="text-base text-text">{landRecord.landCategory}</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="pt-4 border-t border-paper-line">
          <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted" />
            Location
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {landRecord.village && (
              <div>
                <p className="text-sm font-medium text-muted mb-1">Village</p>
                <p className="text-base text-text">{landRecord.village}</p>
              </div>
            )}

            {landRecord.tehsil && (
              <div>
                <p className="text-sm font-medium text-muted mb-1">Tehsil</p>
                <p className="text-base text-text">{landRecord.tehsil}</p>
              </div>
            )}

            {landRecord.district && (
              <div>
                <p className="text-sm font-medium text-muted mb-1">District</p>
                <p className="text-base text-text">{landRecord.district}</p>
              </div>
            )}

            {landRecord.state && (
              <div>
                <p className="text-sm font-medium text-muted mb-1">State</p>
                <p className="text-base text-text">{landRecord.state}</p>
              </div>
            )}
          </div>
        </div>

        {/* Source Info */}
        <div className="pt-4 border-t border-paper-line">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {landRecord.sourceSystem && (
              <div>
                <p className="text-muted mb-1">Source System</p>
                <Badge variant="default" size="sm">
                  {landRecord.sourceSystem}
                </Badge>
              </div>
            )}

            {landRecord.recordStatus && (
              <div>
                <p className="text-muted mb-1">Record Status</p>
                <Badge variant="success" size="sm">
                  {landRecord.recordStatus}
                </Badge>
              </div>
            )}

            {landRecord.sourceRecordId && (
              <div className="col-span-2">
                <p className="text-muted mb-1">Source Record ID</p>
                <p className="font-mono text-text">{landRecord.sourceRecordId}</p>
              </div>
            )}

            {landRecord.retrievedAt && (
              <div className="col-span-2">
                <p className="text-muted mb-1">Last Retrieved</p>
                <p className="text-text">{formatDate(landRecord.retrievedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
