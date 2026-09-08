import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PaymentTransaction {
  id: string;
  awardId: string;
  beneficiaryId: string;
  acquisitionCaseId?: string;
  amount: string;
  currency: string;
  status: string;
  externalReference?: string;
  provider: string;
  idempotencyKey: string;
  failureReason?: string;
  initiatedAt?: string;
  creditedAt?: string;
  lastProviderSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentListParams {
  awardId?: string;
  beneficiaryId?: string;
  status?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface PaymentListResponse {
  data: PaymentTransaction[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

interface InitiatePaymentData {
  awardId: string;
  beneficiaryId: string;
  amount: number;
  idempotencyKey: string;
}

/**
 * Fetch list of payments with filters
 */
export function usePayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => api.get<PaymentListResponse>("/payment", params),
  });
}

/**
 * Fetch single payment transaction by ID
 */
export function usePayment(paymentId: string | undefined) {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => api.get<PaymentTransaction>(`/payment/${paymentId}`),
    enabled: !!paymentId,
  });
}

/**
 * Initiate a new payment transaction
 */
export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitiatePaymentData) =>
      api.post<PaymentTransaction>("/payment", data),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.setQueryData(["payments", payment.id], payment);
    },
  });
}

/**
 * Sync payment status with provider
 */
export function useSyncPaymentStatus(paymentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<PaymentTransaction>(`/payment/${paymentId}/sync`),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ["payments", paymentId] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.setQueryData(["payments", payment.id], payment);
    },
  });
}

/**
 * Get payments by award ID
 */
export function usePaymentsByAward(awardId: string | undefined) {
  return useQuery({
    queryKey: ["payments", "award", awardId],
    queryFn: () =>
      api.get<PaymentListResponse>("/payment", { awardId }),
    enabled: !!awardId,
  });
}

/**
 * Get payments by beneficiary ID
 */
export function usePaymentsByBeneficiary(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: ["payments", "beneficiary", beneficiaryId],
    queryFn: () =>
      api.get<PaymentListResponse>("/payment", { beneficiaryId }),
    enabled: !!beneficiaryId,
  });
}
