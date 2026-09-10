'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface AwardInfo {
  id: string;
  awardNumber: string;
  awardedAmount: number;
}

export default function InitiatePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const awardId = searchParams.get('awardId');
  const awardNumber = searchParams.get('awardNumber');
  const amount = searchParams.get('amount');
  const parcelId = searchParams.get('parcelId');

  const [loading, setLoading] = useState(false);
  
  // Beneficiary details (pre-filled from parcel owner)
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER');
  const [transactionRef, setTransactionRef] = useState('');

  useEffect(() => {
    if (parcelId) {
      fetchBeneficiaryDetails();
    }
    // Generate transaction reference
    setTransactionRef(`TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  }, [parcelId]);

  const fetchBeneficiaryDetails = async () => {
    try {
      const response = await api.get(`/gis/parcels/${parcelId}`);
      const owner = response.ownerInfo;
      setBeneficiaryName(owner.name);
      setAadhaar(owner.aadhaar);
      setMobile(owner.mobile);
      // Generate mock bank details
      const lastFour = owner.aadhaar.replace(/\D/g, '').slice(-4);
      setBankAccount(`12340000${lastFour}`);
      setIfscCode('SBIN0001234');
    } catch (error) {
      console.error('Failed to load beneficiary details');
    }
  };

  const handleSubmit = async () => {
    if (!awardId || !parcelId) {
      alert('Missing award or parcel information');
      return;
    }

    // Validation
    if (!beneficiaryName || !aadhaar || !bankAccount || !ifscCode) {
      alert('Please fill all beneficiary details');
      return;
    }

    setLoading(true);
    try {

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      await api.patch(`/gis/parcels/${parcelId}/status`, {
        status: 'ACQUISITION_COMPLETED',
      });

      alert(
        `✅ Payment Successful!\n\n` +
        `Transaction Ref: ${transactionRef}\n` +
        `Award Number: ${awardNumber}\n` +
        `Amount: ₹${Number(amount).toLocaleString()}\n` +
        `Beneficiary: ${beneficiaryName}\n\n` +
        `Payment completed successfully.\n` +
        `Parcel status updated to ACQUISITION_COMPLETED.`
      );

      router.push('/dashboard/gis');
    } catch (error: any) {
      alert(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!awardId || !awardNumber || !amount) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-center text-gray-600">
            Invalid payment request. Please create a compensation assessment first.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push('/dashboard/gis')}>
              Go to GIS Map
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Initiate Payment</h1>
        <p className="text-gray-600">
          Process compensation payment via e-Kuber gateway (Mock)
        </p>
      </div>

      {/* Award Summary */}
      <Card className="p-6 space-y-3 border-green-200 bg-green-50">
        <h3 className="font-semibold text-lg text-green-900">Approved Compensation Award</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Award Number</label>
            <p className="font-medium text-green-900">{awardNumber}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Awarded Amount</label>
            <p className="font-bold text-xl text-green-700">
              ₹{Number(amount).toLocaleString()}
            </p>
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Transaction Reference</label>
            <p className="font-mono text-sm bg-white px-3 py-2 rounded border border-green-200">
              {transactionRef}
            </p>
          </div>
        </div>
      </Card>

      {/* Beneficiary Details */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Beneficiary Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm mb-1 font-medium">Full Name *</label>
            <Input
              id="name"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="As per land records"
            />
          </div>

          <div>
            <label htmlFor="aadhaar" className="block text-sm mb-1 font-medium">Aadhaar Number *</label>
            <Input
              id="aadhaar"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm mb-1 font-medium">Mobile Number *</label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
            />
          </div>

          <div>
            <label htmlFor="bankAccount" className="block text-sm mb-1 font-medium">Bank Account Number *</label>
            <Input
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Account number"
            />
          </div>

          <div>
            <label htmlFor="ifsc" className="block text-sm mb-1 font-medium">IFSC Code *</label>
            <Input
              id="ifsc"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="ABCD0123456"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm mb-1 font-medium">Payment Method</label>
            <select 
              id="method"
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="BANK_TRANSFER">NEFT/RTGS (Recommended)</option>
              <option value="RTGS">RTGS (&gt;₹2 Lakh)</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payment Workflow Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold mb-3 text-blue-900">e-Kuber Payment Workflow (Mock)</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">Beneficiary Verification</p>
              <p className="text-sm text-blue-700">Aadhaar and bank account validation via PFMS</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">Payment Authorization</p>
              <p className="text-sm text-blue-700">Digital signature and approval workflow</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">e-Kuber Gateway</p>
              <p className="text-sm text-blue-700">Integrated with RBI core banking system</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">4</div>
            <div className="flex-1">
              <p className="font-medium text-gray-700">Payment Confirmation Pending</p>
              <p className="text-sm text-gray-600">The parcel turns green only after payment is confirmed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="font-medium text-amber-900">Secure Transaction</p>
            <p className="text-sm text-amber-700">
              This is a government-to-citizen (G2C) payment. All transactions are encrypted and logged for audit purposes.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="min-w-[200px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            '💳 Process Payment'
          )}
        </Button>
      </div>
    </div>
  );
}
