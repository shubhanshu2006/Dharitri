import { Badge } from "@/components/ui";
import { MapPin, Ruler, FileText, User, Phone, CreditCard } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ParcelPopupProps {
  parcel: {
    id: string;
    parcelReference?: string;
    referenceId?: string;
    surveyNumber?: string;
    area?: number;
    areaSqMeters?: number;
    areaUnit?: string;
    landCategory?: string;
    acquisitionStatus?: string;
    verificationStatus?: string;
    ownerInfo?: {
      name: string;
      aadhaar: string;
      mobile: string;
    };
  };
  onClose: () => void;
}

export function ParcelPopup({ parcel, onClose }: ParcelPopupProps) {
  const router = useRouter();
  const refId = parcel.parcelReference || parcel.referenceId;
  const area = parcel.areaSqMeters || parcel.area;

  const handleCreateAssessment = () => {
    router.push(`/dashboard/compensation/new?parcelId=${parcel.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-paper-line p-4 min-w-[320px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text text-sm">
            {parcel.surveyNumber || refId}
          </h3>
          <p className="text-xs text-muted mt-0.5">Parcel: {refId}</p>
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
        {area && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="w-4 h-4 text-muted" />
            <span className="text-text">
              {formatNumber(area)} {parcel.areaUnit || "sq.m"}
            </span>
          </div>
        )}

        {parcel.landCategory && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted" />
            <Badge variant="default" size="sm">
              {parcel.landCategory}
            </Badge>
          </div>
        )}

        {parcel.acquisitionStatus && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted" />
            <Badge variant="info" size="sm">
              {parcel.acquisitionStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        )}
      </div>

      {/* Owner Information */}
      {parcel.ownerInfo && (
        <div className="border-t pt-3 mb-3">
          <p className="text-xs font-semibold text-muted mb-2">Owner Information</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-3.5 h-3.5 text-muted" />
              <span className="text-text">{parcel.ownerInfo.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CreditCard className="w-3.5 h-3.5 text-muted" />
              <span className="text-muted">{parcel.ownerInfo.aadhaar}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-muted" />
              <span className="text-muted">{parcel.ownerInfo.mobile}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Link href={`/dashboard/parcels/${parcel.id}`} className="flex-1">
          <button className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
            View Details
          </button>
        </Link>
        <button 
          onClick={handleCreateAssessment}
          className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Create Assessment
        </button>
      </div>
    </div>
  );
}
