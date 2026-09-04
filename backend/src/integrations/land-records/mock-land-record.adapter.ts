import {
  LandRecordProvider,
  LandRecordQuery,
  LandRecordResponse,
} from "./land-record.interface.js";
import { logger } from "../../utils/logger.js";

export class MockLandRecordAdapter implements LandRecordProvider {
  name = "MOCK_LAND_RECORDS";

  private mockRecords: Map<string, LandRecordResponse> = new Map([
    [
      "MH-MUM-001",
      {
        parcelReference: "MH-MUM-001",
        surveyNumber: "123",
        ulpin: "270190100010001",
        areaSqMeters: 5000.0,
        landCategory: "AGRICULTURAL",
        ownerName: "Test Owner 1",
        ownershipType: "INDIVIDUAL",
        recordStatus: "ACTIVE",
        recordVersion: "v1.0",
        village: "Test Village 1",
        tehsil: "Test Tehsil",
        district: "Mumbai",
        state: "Maharashtra",
        lastUpdated: new Date("2026-01-01"),
        sourceSystem: "MOCK_LAND_RECORDS",
        sourceRecordId: "MOCK_001",
        rawData: { mockField: "mockValue" },
      },
    ],
    [
      "MH-MUM-002",
      {
        parcelReference: "MH-MUM-002",
        surveyNumber: "124",
        ulpin: "270190100010002",
        areaSqMeters: 3500.0,
        landCategory: "RESIDENTIAL",
        ownerName: "Test Owner 2",
        ownershipType: "JOINT",
        recordStatus: "ACTIVE",
        recordVersion: "v1.0",
        village: "Test Village 2",
        tehsil: "Test Tehsil",
        district: "Mumbai",
        state: "Maharashtra",
        lastUpdated: new Date("2026-01-15"),
        sourceSystem: "MOCK_LAND_RECORDS",
        sourceRecordId: "MOCK_002",
        rawData: { mockField: "mockValue" },
      },
    ],
    [
      "KA-BLR-001",
      {
        parcelReference: "KA-BLR-001",
        surveyNumber: "456",
        ulpin: "290660100010001",
        areaSqMeters: 7500.0,
        landCategory: "COMMERCIAL",
        ownerName: "Test Company Ltd",
        ownershipType: "CORPORATE",
        recordStatus: "ACTIVE",
        recordVersion: "v1.0",
        village: "Test Village 3",
        tehsil: "Test Tehsil",
        district: "Bangalore Urban",
        state: "Karnataka",
        lastUpdated: new Date("2026-02-01"),
        sourceSystem: "MOCK_LAND_RECORDS",
        sourceRecordId: "MOCK_003",
        rawData: { mockField: "mockValue" },
      },
    ],
  ]);

  supportsState(stateId: string): boolean {
    return true;
  }

  async lookup(query: LandRecordQuery): Promise<LandRecordResponse | null> {
    logger.info("Mock land record lookup", { query });

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (query.parcelReference) {
      const record = this.mockRecords.get(query.parcelReference);
      if (record) {
        logger.info("Mock land record found", {
          parcelReference: query.parcelReference,
        });
        return { ...record };
      }
    }

    if (query.ulpin) {
      for (const record of this.mockRecords.values()) {
        if (record.ulpin === query.ulpin) {
          logger.info("Mock land record found by ULPIN", {
            ulpin: query.ulpin,
          });
          return { ...record };
        }
      }
    }

    if (query.surveyNumber) {
      for (const record of this.mockRecords.values()) {
        if (record.surveyNumber === query.surveyNumber) {
          logger.info("Mock land record found by survey number", {
            surveyNumber: query.surveyNumber,
          });
          return { ...record };
        }
      }
    }

    logger.info("Mock land record not found", { query });
    return null;
  }

  async bulkLookup(
    queries: LandRecordQuery[],
  ): Promise<(LandRecordResponse | null)[]> {
    logger.info("Mock bulk land record lookup", { count: queries.length });

    const results = await Promise.all(
      queries.map((query) => this.lookup(query)),
    );

    return results;
  }
}

export default new MockLandRecordAdapter();
