import { ProjectStatus, ProjectType } from "../../generated/prisma/enums.js";

export interface CreateProjectDto {
  projectCode: string;
  name: string;
  projectType: ProjectType;
  description?: string;
  implementingAgencyId?: string;
  ministryId?: string;
  stateId: string;
  districtId?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  implementingAgencyId?: string;
  ministryId?: string;
  districtId?: string;
}

export interface ProjectQueryParams {
  status?: ProjectStatus;
  projectType?: ProjectType;
  stateId?: string;
  districtId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMilestoneDto {
  name: string;
  description?: string;
  dueDate?: Date;
  sequence: number;
}

export interface UpdateMilestoneDto {
  name?: string;
  description?: string;
  dueDate?: Date;
  completedAt?: Date;
  status?: string;
  sequence?: number;
}

export interface AddProjectMemberDto {
  userId: string;
  role: string;
}
