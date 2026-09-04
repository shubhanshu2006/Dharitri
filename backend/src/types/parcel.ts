export interface CreateCadastralParcelDto {
  parcelReference: string;
  ulpin?: string;
  surveyNumber?: string;
  subDivisionNumber?: string;
  stateId: string;
  districtId: string;
  tehsilId?: string;
  villageId?: string;
  areaSqMeters: number;
  landCategory?: string;
  sourceSystem?: string;
  sourceRecordId?: string;
}

export interface UpdateCadastralParcelDto {
  ulpin?: string;
  surveyNumber?: string;
  subDivisionNumber?: string;
  areaSqMeters?: number;
  landCategory?: string;
}

export interface ParcelQueryParams {
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
  villageId?: string;
  landCategory?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ParcelTimelineEvent {
  id: string;
  eventType: string;
  eventDate: Date;
  description: string;
  actorId?: string;
  actorName?: string;
  metadata?: Record<string, unknown>;
}
