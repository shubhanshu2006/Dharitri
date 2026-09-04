export interface LandRecordQuery {
  parcelReference?: string;
  surveyNumber?: string;
  ulpin?: string;
  stateId: string;
  districtId: string;
  tehsilId?: string;
  villageId?: string;
}

export interface LandRecordResponse {
  parcelReference: string;
  surveyNumber?: string;
  ulpin?: string;
  subDivisionNumber?: string;
  areaSqMeters: number;
  landCategory?: string;
  ownerName?: string;
  ownershipType?: string;
  recordStatus?: string;
  recordVersion?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  lastUpdated?: Date;
  sourceSystem: string;
  sourceRecordId: string;
  rawData?: Record<string, unknown>;
}

export interface LandRecordProvider {
  name: string;
  supportsState(stateId: string): boolean;
  lookup(query: LandRecordQuery): Promise<LandRecordResponse | null>;
  bulkLookup(
    queries: LandRecordQuery[],
  ): Promise<(LandRecordResponse | null)[]>;
}
