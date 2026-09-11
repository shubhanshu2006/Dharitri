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
    <div className="bg-white rounded-2xl shadow-xl border border-paper-line/90 p-4.5 min-w-[320px] font-sans">
      <div className="flex items-start justify-between mb-3.5 pb-2.5 border-b border-paper-line/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            Cadastral Record
          </span>
          <h3 className="font-bold text-text text-base mt-1 tracking-tight">
            {parcel.surveyNumber ? `Survey #${parcel.surveyNumber}` : refId}
          </h3>
          <p className="text-[11px] font-mono text-muted mt-0.5">ID: {refId}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-text p-1 rounded-lg hover:bg-paper-dim transition-colors"
          aria-label="Close parcel popup"
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

      <div className="grid grid-cols-2 gap-2 mb-3.5">
        {area && (
          <div className="bg-paper/60 p-2.5 rounded-xl border border-paper-line/60">
            <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-0.5">
              Demarcated Area
            </span>
            <span className="text-xs font-bold text-text font-mono">
              {formatNumber(area)} {parcel.areaUnit || "sq.m"}
            </span>
          </div>
        )}

        <div className="bg-paper/60 p-2.5 rounded-xl border border-paper-line/60">
          <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-0.5">
            Category
          </span>
          <span className="text-xs font-semibold text-emerald-900">
            {parcel.landCategory || "Standard"}
          </span>
        </div>
      </div>

      {parcel.acquisitionStatus && (
        <div className="mb-3.5">
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-muted text-[11px] font-medium">Acquisition Status:</span>
            <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">
              {parcel.acquisitionStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      )}

      {/* Owner Information */}
      {parcel.ownerInfo && (
        <div className="bg-paper/40 rounded-xl p-3 border border-paper-line/70 mb-3.5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Verified Landholder
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-semibold text-text">{parcel.ownerInfo.name}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted font-mono pt-1">
              <span>UID: {parcel.ownerInfo.aadhaar}</span>
              <span>Ph: {parcel.ownerInfo.mobile}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Link href={`/dashboard/parcels/${parcel.id}`} className="flex-1">
          <button className="w-full px-3 py-2 bg-paper-dim/80 hover:bg-paper-dim text-text text-xs font-semibold rounded-xl border border-paper-line transition-all">
            Inspect Record
          </button>
        </Link>
        <button
          onClick={handleCreateAssessment}
          className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <span>Calculate Award</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
