import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Project } from "@/types/api";

interface ProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  stateId?: string;
  districtId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ProjectsResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch paginated projects list
 */
export function useProjects(params: ProjectsParams = {}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => api.get<ProjectsResponse>("/projects", params),
  });
}

/**
 * Fetch single project by ID
 */
export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => api.get<Project>(`/projects/${projectId}`),
    enabled: !!projectId,
  });
}

/**
 * Create new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => api.post<Project>("/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

/**
 * Update existing project
 */
export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) =>
      api.patch<Project>(`/projects/${projectId}`, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", projectId], updatedProject);
    },
  });
}

/**
 * Submit project for review
 */
export function useSubmitProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<Project>(`/projects/${projectId}/submit`),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", projectId], updatedProject);
    },
  });
}

/**
 * Approve project
 */
export function useApproveProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<Project>(`/projects/${projectId}/approve`),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", projectId], updatedProject);
    },
  });
}

/**
 * Put project on hold
 */
export function useHoldProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason?: string }) =>
      api.post<Project>(`/projects/${projectId}/hold`, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", projectId], updatedProject);
    },
  });
}

/**
 * Complete project
 */
export function useCompleteProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<Project>(`/projects/${projectId}/complete`),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", projectId], updatedProject);
    },
  });
}

/**
 * Delete project
 */
export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.removeQueries({ queryKey: ["projects", projectId] });
    },
  });
}
