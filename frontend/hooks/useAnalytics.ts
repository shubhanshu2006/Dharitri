import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AnalyticsQuery,
  AcquisitionTrends,
  CompensationTrends,
  PaymentAnalytics,
  RRTrends,
  PossessionTrends,
  Bottleneck,
} from "@/lib/constants/analytics";

// API endpoints
const analyticsApi = {
  getAcquisitionTrends: (params?: AnalyticsQuery) =>
    api.get<AcquisitionTrends>("/analytics/acquisition", params as any),
  getCompensationTrends: (params?: AnalyticsQuery) =>
    api.get<CompensationTrends>("/analytics/compensation", params as any),
  getPaymentAnalytics: (params?: AnalyticsQuery) =>
    api.get<PaymentAnalytics>("/analytics/payments", params as any),
  getRRTrends: (params?: AnalyticsQuery) =>
    api.get<RRTrends>("/analytics/rr", params as any),
  getPossessionTrends: (params?: AnalyticsQuery) =>
    api.get<PossessionTrends>("/analytics/possession", params as any),
  getBottlenecks: (params?: AnalyticsQuery) =>
    api.get<Bottleneck[]>("/analytics/bottlenecks", params as any),
};

// Query Keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  acquisition: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "acquisition", params] as const,
  compensation: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "compensation", params] as const,
  payments: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "payments", params] as const,
  rr: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "rr", params] as const,
  possession: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "possession", params] as const,
  bottlenecks: (params?: AnalyticsQuery) =>
    [...analyticsKeys.all, "bottlenecks", params] as const,
};

// Hooks
export function useAcquisitionTrends(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.acquisition(params),
    queryFn: () => analyticsApi.getAcquisitionTrends(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCompensationTrends(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.compensation(params),
    queryFn: () => analyticsApi.getCompensationTrends(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePaymentAnalytics(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.payments(params),
    queryFn: () => analyticsApi.getPaymentAnalytics(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRRTrends(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.rr(params),
    queryFn: () => analyticsApi.getRRTrends(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePossessionTrends(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.possession(params),
    queryFn: () => analyticsApi.getPossessionTrends(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBottlenecks(params?: AnalyticsQuery) {
  return useQuery({
    queryKey: analyticsKeys.bottlenecks(params),
    queryFn: () => analyticsApi.getBottlenecks(params),
    staleTime: 10 * 60 * 1000,
  });
}
