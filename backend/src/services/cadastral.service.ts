import { prisma } from "../database/client.js";
import {
  CadastralProvider,
  CadastralQuery,
} from "../integrations/cadastral/cadastral.interface.js";
import mockCadastralAdapter from "../integrations/cadastral/mock-cadastral.adapter.js";
import gisService from "./gis.service.js";
import { NotFoundError, IntegrationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class CadastralService {
  private providers: CadastralProvider[] = [mockCadastralAdapter];

  getProviderForState(stateId: string): CadastralProvider {
    const provider = this.providers.find((p) => p.supportsState(stateId));
    if (!provider) {
      throw new IntegrationError(
        `No cadastral provider available for state: ${stateId}`,
      );
    }
    return provider;
  }

  async fetchGeometry(query: CadastralQuery) {
    const provider = this.getProviderForState(query.stateId);

    logger.info("Fetching cadastral geometry", {
      provider: provider.name,
      query,
    });

    try {
      const geometry = await provider.fetchGeometry(query);
      return geometry;
    } catch (error) {
      logger.error("Cadastral geometry fetch failed", {
        provider: provider.name,
        query,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new IntegrationError(
        "Failed to fetch geometry from cadastral source",
      );
    }
  }

  async syncGeometry(cadastralParcelId: string): Promise<void> {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: cadastralParcelId },
    });

    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    const query: CadastralQuery = {
      parcelReference: parcel.parcelReference,
      surveyNumber: parcel.surveyNumber || undefined,
      ulpin: parcel.ulpin || undefined,
      stateId: parcel.stateId,
      districtId: parcel.districtId,
      tehsilId: parcel.tehsilId || undefined,
      villageId: parcel.villageId || undefined,
    };

    logger.info("Syncing cadastral geometry for parcel", {
      parcelId: cadastralParcelId,
      parcelReference: parcel.parcelReference,
    });

    const geometryData = await this.fetchGeometry(query);

    if (!geometryData) {
      logger.warn("Cadastral geometry not found for parcel", {
        parcelId: cadastralParcelId,
        parcelReference: parcel.parcelReference,
      });
      return;
    }

    await gisService.setCadastralParcelGeometry(
      cadastralParcelId,
      geometryData.geometry,
      geometryData.sourceSystem,
      geometryData.sourceRecordId,
    );

    logger.info("Cadastral geometry synced successfully", {
      parcelId: cadastralParcelId,
      sourceSystem: geometryData.sourceSystem,
      sourceRecordId: geometryData.sourceRecordId,
    });
  }
}

export default new CadastralService();
