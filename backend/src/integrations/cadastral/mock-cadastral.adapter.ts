import {
  CadastralProvider,
  CadastralQuery,
  CadastralGeometryResponse,
} from "./cadastral.interface.js";
import { logger } from "../../utils/logger.js";

export class MockCadastralAdapter implements CadastralProvider {
  name = "MOCK_CADASTRAL";

  private mockGeometries: Map<string, CadastralGeometryResponse> = new Map([
    [
      "MH-MUM-001",
      {
        parcelReference: "MH-MUM-001",
        surveyNumber: "123",
        ulpin: "270190100010001",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [72.8777, 19.076],
              [72.8827, 19.076],
              [72.8827, 19.081],
              [72.8777, 19.081],
              [72.8777, 19.076],
            ],
          ],
        },
        areaSqMeters: 5000.0,
        srid: 4326,
        sourceSystem: "MOCK_CADASTRAL",
        sourceRecordId: "MOCK_GEOM_001",
        retrievedAt: new Date(),
        metadata: { source: "mock" },
      },
    ],
    [
      "MH-MUM-002",
      {
        parcelReference: "MH-MUM-002",
        surveyNumber: "124",
        ulpin: "270190100010002",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [72.8827, 19.076],
              [72.8877, 19.076],
              [72.8877, 19.081],
              [72.8827, 19.081],
              [72.8827, 19.076],
            ],
          ],
        },
        areaSqMeters: 3500.0,
        srid: 4326,
        sourceSystem: "MOCK_CADASTRAL",
        sourceRecordId: "MOCK_GEOM_002",
        retrievedAt: new Date(),
        metadata: { source: "mock" },
      },
    ],
    [
      "KA-BLR-001",
      {
        parcelReference: "KA-BLR-001",
        surveyNumber: "456",
        ulpin: "290660100010001",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [77.5946, 12.9716],
              [77.5996, 12.9716],
              [77.5996, 12.9766],
              [77.5946, 12.9766],
              [77.5946, 12.9716],
            ],
          ],
        },
        areaSqMeters: 7500.0,
        srid: 4326,
        sourceSystem: "MOCK_CADASTRAL",
        sourceRecordId: "MOCK_GEOM_003",
        retrievedAt: new Date(),
        metadata: { source: "mock" },
      },
    ],
  ]);

  supportsState(stateId: string): boolean {
    return true;
  }

  async fetchGeometry(
    query: CadastralQuery,
  ): Promise<CadastralGeometryResponse | null> {
    logger.info("Mock cadastral geometry fetch", { query });

    await new Promise((resolve) => setTimeout(resolve, 150));

    if (query.parcelReference) {
      const geometry = this.mockGeometries.get(query.parcelReference);
      if (geometry) {
        logger.info("Mock cadastral geometry found", {
          parcelReference: query.parcelReference,
        });
        return { ...geometry, retrievedAt: new Date() };
      }
    }

    if (query.ulpin) {
      for (const geometry of this.mockGeometries.values()) {
        if (geometry.ulpin === query.ulpin) {
          logger.info("Mock cadastral geometry found by ULPIN", {
            ulpin: query.ulpin,
          });
          return { ...geometry, retrievedAt: new Date() };
        }
      }
    }

    if (query.surveyNumber) {
      for (const geometry of this.mockGeometries.values()) {
        if (geometry.surveyNumber === query.surveyNumber) {
          logger.info("Mock cadastral geometry found by survey number", {
            surveyNumber: query.surveyNumber,
          });
          return { ...geometry, retrievedAt: new Date() };
        }
      }
    }

    logger.info("Mock cadastral geometry not found", { query });
    return null;
  }

  async bulkFetchGeometry(
    queries: CadastralQuery[],
  ): Promise<(CadastralGeometryResponse | null)[]> {
    logger.info("Mock bulk cadastral geometry fetch", {
      count: queries.length,
    });

    const results = await Promise.all(
      queries.map((query) => this.fetchGeometry(query)),
    );

    return results;
  }
}

export default new MockCadastralAdapter();
