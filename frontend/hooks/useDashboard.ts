import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  NationalMetrics,
  StateMetrics,
  DistrictMetrics,
  ProjectMetrics,
} from "@/lib/constants/dashboard";

// API endpoints
const dashboardApi = {
  getNational: () => api.get<NationalMetrics>("/dashboard/national"),
  getState: (stateId: string) =>
    api.get<StateMetrics>(`/dashboard/states/${stateId}`),
  getDistrict: (districtId: string) =>
    api.get<DistrictMetrics>(`/dashboard/districts/${districtId}`),
  getProject: (projectId: string) =>
    api.get<ProjectMetrics>(`/dashboard/projects/${projectId}`),
};

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  national: () => [...dashboardKeys.all, "national"] as const,
  state: (stateId: string) => [...dashboardKeys.all, "state", stateId] as const,
  district: (districtId: string) =>
    [...dashboardKeys.all, "district", districtId] as const,
  project: (projectId: string) =>
    [...dashboardKeys.all, "project", projectId] as const,
};

// Hooks
export function useNationalDashboard() {
  return useQuery({
    queryKey: dashboardKeys.national(),
    queryFn: () => dashboardApi.getNational(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useStateDashboard(stateId: string) {
  return useQuery({
    queryKey: dashboardKeys.state(stateId),
    queryFn: () => dashboardApi.getState(stateId),
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useDistrictDashboard(districtId: string) {
  return useQuery({
    queryKey: dashboardKeys.district(districtId),
    queryFn: () => dashboardApi.getDistrict(districtId),
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useProjectDashboard(projectId: string) {
  return useQuery({
    queryKey: dashboardKeys.project(projectId),
    queryFn: () => dashboardApi.getProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
