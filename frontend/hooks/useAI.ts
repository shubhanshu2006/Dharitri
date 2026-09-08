import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RiskScore, Anomaly } from "@/lib/constants/analytics";

// API endpoints
const aiApi = {
  getProjectRisk: (projectId: string) =>
    api.get<RiskScore>(`/ai/projects/${projectId}/risk`),
  getProjectAnomalies: (projectId: string) =>
    api.get<Anomaly[]>(`/ai/projects/${projectId}/anomalies`),
  getParcelVerificationRisk: (parcelId: string) =>
    api.get<RiskScore>(`/ai/parcels/${parcelId}/verification-risk`),
  getCompensationDelayRisk: (caseId: string) =>
    api.get<RiskScore>(`/ai/cases/${caseId}/compensation-risk`),
  getRRDelayRisk: (rrCaseId: string) =>
    api.get<RiskScore>(`/ai/rr/${rrCaseId}/delay-risk`),
  getPossessionDelayRisk: (possessionId: string) =>
    api.get<RiskScore>(`/ai/possession/${possessionId}/delay-risk`),
};

// Query Keys
export const aiKeys = {
  all: ["ai"] as const,
  projectRisk: (projectId: string) =>
    [...aiKeys.all, "project", projectId, "risk"] as const,
  projectAnomalies: (projectId: string) =>
    [...aiKeys.all, "project", projectId, "anomalies"] as const,
  parcelRisk: (parcelId: string) =>
    [...aiKeys.all, "parcel", parcelId, "risk"] as const,
  compensationRisk: (caseId: string) =>
    [...aiKeys.all, "case", caseId, "compensation-risk"] as const,
  rrRisk: (rrCaseId: string) =>
    [...aiKeys.all, "rr", rrCaseId, "risk"] as const,
  possessionRisk: (possessionId: string) =>
    [...aiKeys.all, "possession", possessionId, "risk"] as const,
};

// Hooks
export function useProjectRisk(projectId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.projectRisk(projectId),
    queryFn: () => aiApi.getProjectRisk(projectId),
    enabled: !!projectId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}

export function useProjectAnomalies(projectId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.projectAnomalies(projectId),
    queryFn: () => aiApi.getProjectAnomalies(projectId),
    enabled: !!projectId && enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useParcelVerificationRisk(parcelId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.parcelRisk(parcelId),
    queryFn: () => aiApi.getParcelVerificationRisk(parcelId),
    enabled: !!parcelId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompensationDelayRisk(caseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.compensationRisk(caseId),
    queryFn: () => aiApi.getCompensationDelayRisk(caseId),
    enabled: !!caseId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRRDelayRisk(rrCaseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.rrRisk(rrCaseId),
    queryFn: () => aiApi.getRRDelayRisk(rrCaseId),
    enabled: !!rrCaseId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePossessionDelayRisk(possessionId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: aiKeys.possessionRisk(possessionId),
    queryFn: () => aiApi.getPossessionDelayRisk(possessionId),
    enabled: !!possessionId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
