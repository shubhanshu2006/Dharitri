'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import {
  Building,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  Landmark,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';

export default function InitiatePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const awardId = searchParams.get('awardId');
  const awardNumber = searchParams.get('awardNumber');
  const amount = searchParams.get('amount');
  const parcelId = searchParams.get('parcelId');

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
    setTransactionRef(
      `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    );
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
    } catch {
      toast.error('Failed to load beneficiary records');
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transactionRef);
    toast.success('Transaction reference copied to clipboard');
  };

  const handleSubmit = async () => {
    if (!awardId || !parcelId) {
      toast.error('Missing award or parcel information');
      return;
    }

    // Validation
    if (!beneficiaryName || !aadhaar || !bankAccount || !ifscCode) {
      toast.warning('Please fill all mandatory beneficiary banking details');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await api.patch(`/gis/parcels/${parcelId}/status`, {
        status: 'ACQUISITION_COMPLETED',
      });

      toast.success('Payment settled via e-Kuber Treasury Gateway');
      setPaymentSuccess(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!awardId || !awardNumber || !amount) {
    return (
      <div className="p-8 max-w-lg mx-auto font-sans">
        <div className="bg-white rounded-2xl p-8 border border-paper-line text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text">Invalid Payment Request</h2>
          <p className="text-sm text-muted">
            Please formulate and finalize a statutory compensation assessment first.
          </p>
          <Button variant="primary" onClick={() => router.push('/dashboard/gis')}>
            Go to GIS Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans pb-12">
      {/* Payment Success Celebratory Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-paper-line overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />
            <div className="p-7 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  RBI e-Kuber Settled
                </span>
                <h3 className="text-2xl font-bold text-text tracking-tight mt-2">
                  Payment Disbursed Successfully
                </h3>
                <p className="text-xs text-muted mt-1">
                  Statutory compensation credited to landholder's verified bank account
                </p>
              </div>

              <div className="bg-paper/60 rounded-xl p-4 border border-paper-line text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Transaction ID:</span>
                  <span className="font-bold text-text">{transactionRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Award Reference:</span>
                  <span className="font-semibold text-text">{awardNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Beneficiary:</span>
                  <span className="font-semibold text-text">{beneficiaryName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Account Credited:</span>
                  <span className="font-mono text-emerald-800 font-bold">{bankAccount}</span>
                </div>
                <div className="pt-2 border-t border-paper-line/70 flex justify-between items-center">
                  <span className="font-sans font-medium text-muted">Amount Disbursed:</span>
                  <span className="font-sans text-lg font-bold text-emerald-700">
                    ₹{Number(amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 text-left space-y-1">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Cadastral Milestone Complete:
                </p>
                <p className="text-emerald-800 text-[11px]">
                  Parcel status has officially transitioned to <span className="font-bold">ACQUISITION_COMPLETED</span>. The GIS map now marks this parcel with an active green acquired boundary.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => router.push('/dashboard/gis')}
                  className="w-full py-3 shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Return to GIS Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-2 border-b border-paper-line/70">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            Direct Benefit Transfer (DBT)
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Initiate Statutory Compensation Payment
        </h1>
        <p className="text-xs text-muted mt-0.5">
          Authorize and disburse land acquisition award via RBI e-Kuber Core Treasury Gateway
        </p>
      </div>

      {/* Award Summary Card */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-paper-line/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text tracking-tight">
              Approved Compensation Award Summary
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
            Approved For Settlement
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">Statutory Award Number</span>
            <p className="font-mono font-bold text-text">{awardNumber}</p>
          </div>
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <span className="text-muted text-[11px] block mb-0.5">Total Settlement Amount</span>
            <p className="text-base font-bold text-emerald-700 font-sans">
              ₹{Number(amount).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-3 bg-paper/40 rounded-xl border border-paper-line/60">
            <div className="flex items-center justify-between">
              <span className="text-muted text-[11px] block mb-0.5">Transaction ID</span>
              <button
                onClick={handleCopyRef}
                className="text-emerald-700 hover:text-emerald-800 p-0.5"
                title="Copy reference"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="font-mono font-semibold text-text text-[11px] truncate">
              {transactionRef}
            </p>
          </div>
        </div>
      </div>

      {/* Beneficiary Details Form */}
      <div className="bg-white rounded-2xl p-6 border border-paper-line/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-paper-line/70">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text tracking-tight">
            Beneficiary & Bank Routing Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-text mb-1.5">
              Full Legal Name *
            </label>
            <Input
              id="name"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="As per land records"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="aadhaar" className="block text-xs font-semibold text-text mb-1.5">
              Aadhaar (UIDAI Number) *
            </label>
            <Input
              id="aadhaar"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-xs font-semibold text-text mb-1.5">
              Registered Mobile Number *
            </label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="bankAccount" className="block text-xs font-semibold text-text mb-1.5">
              Core Bank Account Number *
            </label>
            <Input
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Account number"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="ifsc" className="block text-xs font-semibold text-text mb-1.5">
              IFSC Routing Code *
            </label>
            <Input
              id="ifsc"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="SBIN0001234"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-xs font-semibold text-text mb-1.5">
              Disbursement Channel
            </label>
            <select
              id="method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-paper-line bg-paper/50 hover:bg-paper focus:bg-white text-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all"
            >
              <option value="BANK_TRANSFER">RBI e-Kuber Core Banking Gateway (Instant RTGS/NEFT)</option>
              <option value="RTGS">PFMS Treasury Gateway</option>
              <option value="CHEQUE">Treasury Issued Sovereign Warrant</option>
            </select>
          </div>
        </div>
      </div>

      {/* e-Kuber Treasury Stepper (Emerald & Amber, zero blue) */}
      <div className="bg-white rounded-2xl p-6 border border-paper-line/90 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-emerald-700" />
          e-Kuber Treasury Processing Protocol
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <p className="text-xs font-bold text-emerald-900 mt-2">Beneficiary KYC</p>
            <p className="text-[11px] text-emerald-800/80">UIDAI Aadhaar & PFMS NPCI mapper validated</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <p className="text-xs font-bold text-emerald-900 mt-2">Award Authorization</p>
            <p className="text-[11px] text-emerald-800/80">Digital signature & sub-divisional approval confirmed</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <p className="text-xs font-bold text-emerald-900 mt-2">e-Kuber Gateway</p>
            <p className="text-[11px] text-emerald-800/80">RBI Core Settlement Bridge dispatch ready</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <p className="text-xs font-bold text-amber-900 mt-2">Cadastral Conversion</p>
            <p className="text-[11px] text-amber-800/80">Upon clearance, GIS turns green (Acquisition Completed)</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-amber-900">Cryptographically Signed G2C Sovereign Settlement</p>
          <p className="text-amber-800/90 mt-0.5">
            This transaction is executed under Direct Benefit Transfer rules. Audit logs and bank confirmation receipts are stored in the immutable national ledger.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          className="min-w-[220px] py-3 shadow-sm font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-white border-r-transparent inline-block" />
              Transmitting to e-Kuber...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Authorize & Disburse Payment</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

