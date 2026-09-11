'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import {
  Building2,
  Calculator,
  CheckCircle2,
  FileCheck,
  MapPin,
  Trees,
  Wheat,
  Scale,
  CreditCard,
  User,
  ArrowRight,
} from 'lucide-react';

interface ParcelInfo {
  id: string;
  parcelReference: string;
  surveyNumber: string;
  areaSqMeters: number;
  landCategory: string;
  ownerInfo: {
    name: string;
    aadhaar: string;
    mobile: string;
  };
  state: { name: string };
  district: { name: string };
  projectInfo?: {
    id: string;
    name: string;
  };
}

interface CompensationBreakdown {
  marketValue: number;
  multipliedValue: number;
  solatium: number;
  structureCompensation: number;
  treeCompensation: number;
  cropCompensation: number;
  interest: number;
  rrCompensation: number;
  totalCompensation: number;
  perSqMRate: number;
}

interface CreatedAwardModalData {
  id: string;
  awardNumber: string;
  totalAmount: number;
  parcelId: string;
  ownerName: string;
}

export default function NewCompensationAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelId = searchParams.get('parcelId');

  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [parcel, setParcel] = useState<ParcelInfo | null>(null);

  // Form state
  const [marketValuePerSqM, setMarketValuePerSqM] = useState<number>(15000);
  const [locationMultiplier, setLocationMultiplier] = useState<number>(2);
  const [structureValue, setStructureValue] = useState<number>(0);
  const [treeCount, setTreeCount] = useState<number>(0);
  const [cropValue, setCropValue] = useState<number>(0);
  const [familySize, setFamilySize] = useState<number>(5);
  const [isDisplaced, setIsDisplaced] = useState<boolean>(false);
  const [notificationMonths, setNotificationMonths] = useState<number>(6);

  const [breakdown, setBreakdown] = useState<CompensationBreakdown | null>(null);
  const [createdAward, setCreatedAward] = useState<CreatedAwardModalData | null>(null);

  useEffect(() => {
    if (parcelId) {
      fetchParcelDetails();
    }
  }, [parcelId]);

  const fetchParcelDetails = async () => {
    try {
      const response = await api.get(`/gis/parcels/${parcelId}`);
      setParcel(response);

      // Set suggested market rate based on land type
      const rates: Record<string, number> = {
        Agricultural: 15000,
        Residential: 50000,
        Commercial: 100000,
        Industrial: 35000,
      };
      setMarketValuePerSqM(rates[response.landCategory] || 15000);
    } catch {
      toast.error('Failed to load cadastral parcel details');
    }
  };

  const calculateCompensation = () => {
    if (!parcel) return;

    setCalculating(true);

    // Calculate based on RFCTLARR Act
    const landArea = parcel.areaSqMeters;

    // 1. Market Value
    const marketValue = landArea * marketValuePerSqM;

    // 2. Multiplied Value (2x for infrastructure)
    const multipliedValue = marketValue * locationMultiplier;

    // 3. Solatium (30%)
    const solatium = multipliedValue * 0.3;

    // 4. Structure
    const structureCompensation = structureValue;

    // 5. Trees (₹500/tree)
    const treeCompensation = treeCount * 500;

    // 6. Crops
    const cropCompensation = cropValue;

    // 7. Interest (12% p.a.)
    const interest = (marketValue * 0.12 * notificationMonths) / 12;

    // 8. R&R (if displaced)
    let rrCompensation = 0;
    if (isDisplaced) {
      const shiftingAllowance = 50000;
      const subsistenceGrant = 3000 * 12 * familySize;
      const houseGrant = structureValue > 0 ? 150000 : 0;
      const oneAcreSqM = 4047;
      const lumpSum = marketValuePerSqM * oneAcreSqM;
      const annuityValue = 2000 * 12 * 20 * familySize;

      rrCompensation =
        shiftingAllowance +
        subsistenceGrant +
        houseGrant +
        lumpSum +
        annuityValue;
    }

    // Total
    const totalCompensation =
      multipliedValue +
      solatium +
      structureCompensation +
      treeCompensation +
      cropCompensation +
      interest +
      rrCompensation;

    setBreakdown({
      marketValue,
      multipliedValue,
      solatium,
      structureCompensation,
      treeCompensation,
      cropCompensation,
      interest,
      rrCompensation,
      totalCompensation,
      perSqMRate: totalCompensation / landArea,
    });

    setCalculating(false);
    toast.success('RFCTLARR statutory compensation calculated successfully');
  };

  const handleSubmit = async () => {
    if (!breakdown || !parcel) {
      toast.warning('Please calculate compensation first before creating assessment');
      return;
    }

    if (!parcel.projectInfo?.id) {
      toast.error('Parcel is not associated with any active project');
      return;
    }

    setLoading(true);
    try {
      // Use the endpoint that creates acquisition case automatically
      const response = await api.post('/compensation/assessments/from-parcel', {
        parcelId: parcel.id,
        projectId: parcel.projectInfo.id,
        landValue: breakdown.multipliedValue,
        solatium: breakdown.solatium,
        interest: breakdown.interest,
        otherComponents:
          breakdown.structureCompensation +
          breakdown.treeCompensation +
          breakdown.cropCompensation +
          breakdown.rrCompensation,
        deductions: 0,
      });

      const { award } = response;

      toast.success(`Compensation Award ${award.awardNumber} created and approved!`);

      // Open interactive award success dialog instead of browser confirm()
      setCreatedAward({
        id: award.id,
        awardNumber: award.awardNumber,
        totalAmount: breakdown.totalCompensation,
        parcelId: parcel.id,
        ownerName: parcel.ownerInfo.name,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create compensation assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!createdAward) return;
    router.push(
      `/dashboard/payments/initiate?awardId=${createdAward.id}&awardNumber=${createdAward.awardNumber}&amount=${createdAward.totalAmount}&parcelId=${createdAward.parcelId}`
    );
  };

  if (!parcelId) {
    return (
      <div className="p-8 max-w-2xl mx-auto font-sans">
        <div className="bg-white rounded-2xl p-8 border border-paper-line text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text">No Parcel Selected</h2>
          <p className="text-sm text-muted">
            Please navigate to the GIS Map and select a cadastral parcel to formulate an assessment.
          </p>
          <Button variant="primary" onClick={() => router.push('/dashboard/gis')}>
            Go to GIS Map
          </Button>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="p-12 text-center font-sans">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-emerald-600 border-r-transparent mb-3" />
        <p className="text-sm text-muted">Retrieving land record and parcel details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl font-sans pb-12">
      {/* Award Created Success Modal */}
      {createdAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-paper-line overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />
            <div className="p-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  Statutory Award Approved
                </span>
                <h3 className="text-xl font-bold text-text tracking-tight mt-2">
                  Compensation Assessment Finalized
                </h3>
                <p className="text-xs text-muted mt-1">
                  Award successfully enrolled under RFCTLARR 2013 provisions
                </p>
              </div>

              {/* Award Details Card */}
              <div className="bg-paper/60 rounded-xl p-4 border border-paper-line text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">Award Serial:</span>
                  <span className="font-bold text-text">{createdAward.awardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Beneficiary:</span>
                  <span className="font-semibold text-text">{createdAward.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Demarcated Parcel:</span>
                  <span className="text-text">{parcel.surveyNumber || parcel.parcelReference}</span>
                </div>
                <div className="pt-2 border-t border-paper-line/70 flex justify-between items-center">
                  <span className="font-sans font-medium text-muted">Awarded Amount:</span>
                  <span className="font-sans text-base font-bold text-emerald-700">
                    ₹{createdAward.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 text-left">
                <strong>Next Milestone:</strong> Parcel status transitioned to{' '}
                <span className="font-bold">AWARD_STAGE</span>. You may now proceed directly to e-Kuber treasury disbursement.
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/gis')}
                  className="flex-1"
                >
                  Return to GIS Map
                </Button>
                <Button
                  variant="primary"
                  onClick={handleProceedToPayment}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <span>Initiate Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-paper-line/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              RFCTLARR Act 2013 (Sections 26-28)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Statutory Compensation Assessment
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Formulate statutory compensation valuation, solatium, and Schedule I R&R entitlements
          </p>
        </div>
      </div>

      {/* Cadastral Parcel Dossier */}
      <div className="bg-white rounded-2xl p-5 border border-paper-line/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-paper-line/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text tracking-tight">Demarcated Parcel Dossier</h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-paper border border-paper-line text-muted">
            Ref: {parcel.parcelReference}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">Survey Number</span>
            <p className="font-bold text-text">{parcel.surveyNumber || "N/A"}</p>
          </div>
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">Land Area</span>
            <p className="font-bold text-text font-mono">
              {parcel.areaSqMeters.toLocaleString()} sq.m
            </p>
          </div>
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">Landholder Name</span>
            <p className="font-bold text-text truncate">{parcel.ownerInfo.name}</p>
          </div>
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">District / State</span>
            <p className="font-bold text-text truncate">
              {parcel.district?.name}, {parcel.state?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Compensation Parameters Form */}
      <div className="bg-white rounded-2xl p-6 border border-paper-line/90 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-paper-line/70">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text tracking-tight">
            Valuation Parameters & Statutory Multipliers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="marketValue" className="block text-xs font-semibold text-text mb-1.5">
              Market Value Rate per sq.m (₹) *
            </label>
            <Input
              id="marketValue"
              type="number"
              value={marketValuePerSqM}
              onChange={(e) => setMarketValuePerSqM(Number(e.target.value))}
              placeholder="e.g. 15000"
              className="text-sm"
            />
            <p className="text-[11px] text-muted mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Suggested benchmark rate for {parcel.landCategory || "Land"}: ₹{marketValuePerSqM.toLocaleString()}
            </p>
          </div>

          <div>
            <label htmlFor="multiplier" className="block text-xs font-semibold text-text mb-1.5">
              Location Multiplier Factor (Section 26) *
            </label>
            <select
              id="multiplier"
              value={locationMultiplier}
              onChange={(e) => setLocationMultiplier(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-paper-line bg-paper/50 hover:bg-paper focus:bg-white text-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all"
            >
              <option value="1">1.0x — Urban Zone (Direct Market Value)</option>
              <option value="2">2.0x — Rural Infrastructure Corridor (Standard Multiplier)</option>
              <option value="4">4.0x — Statutory Urgent / Priority Expropriation</option>
            </select>
            <p className="text-[11px] text-muted mt-1.5">
              RFCTLARR Section 26 statutory multiplier based on distance from urban limits.
            </p>
          </div>

          <div>
            <label htmlFor="structure" className="block text-xs font-semibold text-text mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted" />
              Structure Valuation (₹)
            </label>
            <Input
              id="structure"
              type="number"
              value={structureValue}
              onChange={(e) => setStructureValue(Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-[11px] text-muted mt-1">PWD / valuer assessment for residential/commercial structures</p>
          </div>

          <div>
            <label htmlFor="trees" className="block text-xs font-semibold text-text mb-1.5 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-muted" />
              Timber & Fruit Bearing Trees Count
            </label>
            <Input
              id="trees"
              type="number"
              value={treeCount}
              onChange={(e) => setTreeCount(Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-[11px] text-muted mt-1">Forest department schedule rate @ ₹500/tree</p>
          </div>

          <div>
            <label htmlFor="crops" className="block text-xs font-semibold text-text mb-1.5 flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-muted" />
              Standing Crop Value (₹)
            </label>
            <Input
              id="crops"
              type="number"
              value={cropValue}
              onChange={(e) => setCropValue(Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-[11px] text-muted mt-1">Revenue authority agricultural crop assessment</p>
          </div>

          <div>
            <label htmlFor="months" className="block text-xs font-semibold text-text mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-muted" />
              Elapsed Months Since Preliminary Notification
            </label>
            <Input
              id="months"
              type="number"
              value={notificationMonths}
              onChange={(e) => setNotificationMonths(Number(e.target.value))}
              placeholder="6"
            />
            <p className="text-[11px] text-muted mt-1">Statutory interest entitlement @ 12% per annum (Section 28)</p>
          </div>
        </div>

        {/* Schedule I R&R Entitlement */}
        <div className="pt-4 border-t border-paper-line/70">
          <div className="p-4 rounded-xl bg-paper/40 border border-paper-line/70 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="displaced"
                checked={isDisplaced}
                onChange={(e) => setIsDisplaced(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <label htmlFor="displaced" className="text-xs font-bold text-text cursor-pointer block">
                  Family is Displaced — Schedule I R&R Entitlements Applicable
                </label>
                <p className="text-[11px] text-muted">
                  Includes statutory shifting allowance, 1-year subsistence grant, housing grant, and annuity
                </p>
              </div>
            </div>

            {isDisplaced && (
              <div className="pt-2 pl-7 max-w-xs">
                <label htmlFor="familySize" className="block text-xs font-medium text-text mb-1">
                  Displaced Family Members Count
                </label>
                <Input
                  id="familySize"
                  type="number"
                  value={familySize}
                  onChange={(e) => setFamilySize(Number(e.target.value))}
                  placeholder="5"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={calculateCompensation}
          disabled={calculating}
          variant="primary"
          className="w-full py-3 shadow-xs flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>{calculating ? 'Executing Statutory Formulation...' : 'Compute Statutory Breakdown'}</span>
        </Button>
      </div>

      {/* Itemized Financial Breakdown Ledger */}
      {breakdown && (
        <div className="bg-white rounded-2xl p-6 border border-emerald-200/90 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-paper-line/70">
            <div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Audited Financial Ledger
              </span>
              <h3 className="text-base font-bold text-text tracking-tight mt-1">
                Itemized Statutory Compensation Award
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted block">Effective Rate</span>
              <span className="text-xs font-mono font-bold text-emerald-800">
                ₹{Math.round(breakdown.perSqMRate).toLocaleString()}/sq.m
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Basic Land Value:</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.marketValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Multiplied Value (Section 26):</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.multipliedValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Solatium (Section 27, 30%):</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.solatium.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Statutory Interest (Section 28, 12% p.a.):</span>
              <span className="font-mono font-semibold text-text">
                ₹{Math.round(breakdown.interest).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Structure Compensation:</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.structureCompensation.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Timber & Tree Valuation:</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.treeCompensation.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-paper/40 border border-paper-line/50">
              <span className="text-muted">Crop Loss Valuation:</span>
              <span className="font-mono font-semibold text-text">
                ₹{breakdown.cropCompensation.toLocaleString()}
              </span>
            </div>
            {breakdown.rrCompensation > 0 && (
              <div className="flex justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-amber-900 font-medium">Schedule I R&R Entitlements:</span>
                <span className="font-mono font-bold text-amber-900">
                  ₹{breakdown.rrCompensation.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Total Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Total Statutory Award
              </span>
              <p className="text-xs text-muted">RFCTLARR 2013 Statutory Entitlement Total</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-bold text-emerald-950 font-sans tracking-tight">
                ₹{Math.round(breakdown.totalCompensation).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-line/70">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !breakdown}
          variant="primary"
          className="px-6 shadow-sm"
        >
          {loading ? 'Committing Award...' : 'Approve & Issue Statutory Award'}
        </Button>
      </div>
    </div>
  );
}
