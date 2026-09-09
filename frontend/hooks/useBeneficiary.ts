import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Beneficiary {
  id: string;
  displayName: string;
  externalReference?: string;
  verificationStatus: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiaryVerification {
  id: string;
  beneficiaryId: string;
  status: string;
  provider: string;
  providerReference?: string;
  verifiedAt?: string;
  failureReason?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface BeneficiaryListParams {
  verificationStatus?: string;
  search?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface BeneficiaryListResponse {
  data: Beneficiary[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

interface CreateBeneficiaryData {
  displayName: string;
  externalReference?: string;
}

interface UpdateBeneficiaryData {
  displayName?: string;
  externalReference?: string;
}

/**
 * Fetch list of beneficiaries with filters
 */
export function useBeneficiaries(params: BeneficiaryListParams = {}) {
  return useQuery({
    queryKey: ["beneficiaries", params],
    queryFn: () => api.get<BeneficiaryListResponse>("/beneficiaries", params),
  });
}

/**
 * Fetch single beneficiary by ID
 */
export function useBeneficiary(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: ["beneficiaries", beneficiaryId],
    queryFn: () => api.get<Beneficiary>(`/beneficiaries/${beneficiaryId}`),
    enabled: !!beneficiaryId,
  });
}

/**
 * Create a new beneficiary
 */
export function useCreateBeneficiary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBeneficiaryData) =>
      api.post<Beneficiary>("/beneficiaries", data),
    onSuccess: (beneficiary) => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      queryClient.setQueryData(["beneficiaries", beneficiary.id], beneficiary);
    },
  });
}

/**
 * Update an existing beneficiary
 */
export function useUpdateBeneficiary(beneficiaryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBeneficiaryData) =>
      api.patch<Beneficiary>(`/beneficiaries/${beneficiaryId}`, data),
    onSuccess: (beneficiary) => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries", beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      queryClient.setQueryData(["beneficiaries", beneficiary.id], beneficiary);
    },
  });
}

/**
 * Initiate beneficiary verification
 */
export function useVerifyBeneficiary(beneficiaryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<BeneficiaryVerification>(`/beneficiaries/${beneficiaryId}/verify`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries", beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["beneficiaries", beneficiaryId, "verification"] });
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
}

/**
 * Get beneficiary verification status
 */
export function useBeneficiaryVerification(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: ["beneficiaries", beneficiaryId, "verification"],
    queryFn: () =>
      api.get<BeneficiaryVerification>(`/beneficiaries/${beneficiaryId}/verification`),
    enabled: !!beneficiaryId,
  });
}

/**
 * Get beneficiaries by verification status
 */
export function useBeneficiariesByStatus(verificationStatus: string | undefined) {
  return useQuery({
    queryKey: ["beneficiaries", "status", verificationStatus],
    queryFn: () =>
      api.get<BeneficiaryListResponse>("/beneficiaries", { verificationStatus }),
    enabled: !!verificationStatus,
  });
}
