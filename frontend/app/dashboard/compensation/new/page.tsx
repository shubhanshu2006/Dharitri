'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

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
        'Agricultural': 15000,
        'Residential': 50000,
        'Commercial': 100000,
        'Industrial': 35000,
      };
      setMarketValuePerSqM(rates[response.landCategory] || 15000);
    } catch (error) {
      alert('Failed to load parcel details');
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
    const solatium = multipliedValue * 0.30;
    
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
      
      rrCompensation = shiftingAllowance + subsistenceGrant + houseGrant + lumpSum + annuityValue;
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
      perSqMRate: totalCompensation / landArea
    });

    setCalculating(false);
    alert('Compensation calculated successfully');
  };

  const handleSubmit = async () => {
    if (!breakdown || !parcel) {
      alert('Please calculate compensation first');
      return;
    }

    if (!parcel.projectInfo?.id) {
      alert('Parcel is not associated with any project');
      return;
    }

    setLoading(true);
    try {
      // Use the new endpoint that creates acquisition case automatically
      const response = await api.post('/compensation/assessments/from-parcel', {
        parcelId: parcel.id,
        projectId: parcel.projectInfo.id,
        landValue: breakdown.multipliedValue,
        solatium: breakdown.solatium,
        interest: breakdown.interest,
        otherComponents: breakdown.structureCompensation + breakdown.treeCompensation + breakdown.cropCompensation + breakdown.rrCompensation,
        deductions: 0,
      });

      const { award } = response;

      // Show success with award details
      const proceed = confirm(
        `✅ Compensation Assessment Created & Approved!\n\n` +
        `Award Number: ${award.awardNumber}\n` +
        `Total Amount: ₹${breakdown.totalCompensation.toLocaleString()}\n\n` +
        `Parcel status updated to AWARD_STAGE (payment pending).\n\n` +
        `Click OK to initiate payment, or Cancel to return to map.`
      );

      if (proceed) {
        // Redirect to payment page with award details
        router.push(`/dashboard/payments/initiate?awardId=${award.id}&awardNumber=${award.awardNumber}&amount=${breakdown.totalCompensation}&parcelId=${parcel.id}`);
      } else {
        router.push('/dashboard/gis');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  if (!parcelId) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-center text-gray-600">
            No parcel selected. Please select a parcel from the GIS map.
          </p>
        </Card>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-center">Loading parcel details...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Compensation Assessment</h1>
        <p className="text-gray-600">
          Calculate compensation as per RFCTLARR Act 2013
        </p>
      </div>

      {/* Parcel Information */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Parcel Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Parcel Reference</label>
            <p className="font-medium">{parcel.parcelReference}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Survey Number</label>
            <p className="font-medium">{parcel.surveyNumber}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Owner Name</label>
            <p className="font-medium">{parcel.ownerInfo.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Aadhaar</label>
            <p className="font-medium">{parcel.ownerInfo.aadhaar}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Mobile</label>
            <p className="font-medium">{parcel.ownerInfo.mobile}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Land Area</label>
            <p className="font-medium">{parcel.areaSqMeters} sq.m</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Land Category</label>
            <p className="font-medium">{parcel.landCategory}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <p className="font-medium">{parcel.district.name}, {parcel.state.name}</p>
          </div>
        </div>
      </Card>

      {/* Compensation Parameters */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Compensation Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="marketValue" className="block text-sm mb-1">Market Value per sq.m (₹)</label>
            <Input
              id="marketValue"
              type="number"
              value={marketValuePerSqM}
              onChange={(e) => setMarketValuePerSqM(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Suggested: ₹{marketValuePerSqM.toLocaleString()}
            </p>
          </div>

          <div>
            <label htmlFor="multiplier" className="block text-sm mb-1">Location Multiplier</label>
            <select 
              id="multiplier"
              value={locationMultiplier} 
              onChange={(e) => setLocationMultiplier(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="1">1x (Urban - Market Value)</option>
              <option value="2">2x (Rural - Infrastructure)</option>
              <option value="4">4x (Urgent Cases)</option>
            </select>
          </div>

          <div>
            <label htmlFor="structure" className="block text-sm mb-1">Structure Value (₹)</label>
            <Input
              id="structure"
              type="number"
              value={structureValue}
              onChange={(e) => setStructureValue(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="trees" className="block text-sm mb-1">Number of Trees</label>
            <Input
              id="trees"
              type="number"
              value={treeCount}
              onChange={(e) => setTreeCount(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">@ ₹500 per tree</p>
          </div>

          <div>
            <label htmlFor="crops" className="block text-sm mb-1">Crop Value (₹)</label>
            <Input
              id="crops"
              type="number"
              value={cropValue}
              onChange={(e) => setCropValue(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="months" className="block text-sm mb-1">Months Since Notification</label>
            <Input
              id="months"
              type="number"
              value={notificationMonths}
              onChange={(e) => setNotificationMonths(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">Interest @ 12% p.a.</p>
          </div>
        </div>

        {/* R&R Section */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="displaced"
              checked={isDisplaced}
              onChange={(e) => setIsDisplaced(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="displaced" className="font-medium">
              Family is Displaced (Schedule I R&R Applicable)
            </label>
          </div>

          {isDisplaced && (
            <div>
              <label htmlFor="familySize" className="block text-sm mb-1">Family Size</label>
              <Input
                id="familySize"
                type="number"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>
          )}
        </div>

        <Button onClick={calculateCompensation} disabled={calculating} className="w-full">
          {calculating ? 'Calculating...' : 'Calculate Compensation'}
        </Button>
      </Card>

      {/* Compensation Breakdown */}
      {breakdown && (
        <Card className="p-6 space-y-3 border-green-200 bg-green-50">
          <h3 className="font-semibold text-lg text-green-900">Compensation Breakdown</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Market Value:</span>
              <span className="font-medium">₹{breakdown.marketValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Multiplied Value (Section 26):</span>
              <span className="font-medium">₹{breakdown.multipliedValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Solatium (Section 27, 30%):</span>
              <span className="font-medium">₹{breakdown.solatium.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest (Section 28, 12%):</span>
              <span className="font-medium">₹{breakdown.interest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Structure Compensation:</span>
              <span className="font-medium">₹{breakdown.structureCompensation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tree Compensation:</span>
              <span className="font-medium">₹{breakdown.treeCompensation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Crop Compensation:</span>
              <span className="font-medium">₹{breakdown.cropCompensation.toLocaleString()}</span>
            </div>
            {breakdown.rrCompensation > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">R&R Compensation (Schedule I):</span>
                <span className="font-medium">₹{breakdown.rrCompensation.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Compensation:</span>
              <span className="text-green-700">₹{breakdown.totalCompensation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Rate per sq.m:</span>
              <span>₹{breakdown.perSqMRate.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-600 italic mt-4">
            As per RFCTLARR Act 2013, Sections 26-28 & Schedule I
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !breakdown}>
          {loading ? 'Creating...' : 'Create Assessment'}
        </Button>
      </div>
    </div>
  );
}
