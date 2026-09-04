export interface CreateAcquisitionParcelDto {
  projectId: string;
  cadastralParcelId: string;
  acquisitionReference: string;
  requiredAreaSqMeters: number;
  landCategory?: string;
}

export interface UpdateAcquisitionParcelDto {
  requiredAreaSqMeters?: number;
  landCategory?: string;
}
