import { Badge } from "@/components/ui";
import { MapPin, Ruler, FileText } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface ParcelPopupProps {
  parcel: {
    id: string;
    referenceId: string;
    surveyNumber?: string;
    area?: number;
    areaUnit?: string;
    acquisitionStatus?: string;
    verificationStatus?: string;
  };
  onClose: () => void;
}

export function ParcelPopup({ parcel, onClose }: ParcelPopupProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl border border-paper-line p-4 min-w-[280px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text text-sm">
            {parcel.surveyNumber || parcel.referenceId}
          </h3>
          <p className="text-xs text-muted mt-0.5">Parcel ID: {parcel.referenceId}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-text transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {parcel.area && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="w-4 h-4 text-muted" />
            <span className="text-text">
              {formatNumber(parcel.area)} {parcel.areaUnit || "sq.m"}
            </span>
          </div>
        )}

        {parcel.acquisitionStatus && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted" />
            <Badge variant="default" size="sm">
              {parcel.acquisitionStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        )}

        {parcel.verificationStatus && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted" />
            <Badge variant="info" size="sm">
              {parcel.verificationStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        )}
      </div>

      <Link href={`/dashboard/parcels/${parcel.id}`}>
        <button className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
          View Details
        </button>
      </Link>
    </div>
  );
}
