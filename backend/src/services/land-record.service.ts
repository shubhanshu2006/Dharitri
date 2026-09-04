import { prisma } from "../database/client.js";
import {
  LandRecordProvider,
  LandRecordQuery,
  LandRecordResponse,
} from "../integrations/land-records/land-record.interface.js";
import mockLandRecordAdapter from "../integrations/land-records/mock-land-record.adapter.js";
import { NotFoundError, IntegrationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import crypto from "crypto";

export class LandRecordService {
  private providers: LandRecordProvider[] = [mockLandRecordAdapter];

  getProviderForState(stateId: string): LandRecordProvider {
    const provider = this.providers.find((p) => p.supportsState(stateId));
    if (!provider) {
      throw new IntegrationError(
        `No land record provider available for state: ${stateId}`,
      );
    }
    return provider;
  }

  async lookupLandRecord(
    query: LandRecordQuery,
  ): Promise<LandRecordResponse | null> {
    const provider = this.getProviderForState(query.stateId);

    logger.info("Looking up land record", {
      provider: provider.name,
      query,
    });

    try {
      const record = await provider.lookup(query);
      return record;
    } catch (error) {
      logger.error("Land record lookup failed", {
        provider: provider.name,
        query,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new IntegrationError(
        "Failed to fetch land record from external source",
      );
    }
  }

  async syncLandRecord(cadastralParcelId: string): Promise<void> {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: cadastralParcelId },
    });

    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    const query: LandRecordQuery = {
      parcelReference: parcel.parcelReference,
      surveyNumber: parcel.surveyNumber || undefined,
      ulpin: parcel.ulpin || undefined,
      stateId: parcel.stateId,
      districtId: parcel.districtId,
      tehsilId: parcel.tehsilId || undefined,
      villageId: parcel.villageId || undefined,
    };

    logger.info("Syncing land record for parcel", {
      parcelId: cadastralParcelId,
      parcelReference: parcel.parcelReference,
    });

    const record = await this.lookupLandRecord(query);

    if (!record) {
      logger.warn("Land record not found for parcel", {
        parcelId: cadastralParcelId,
        parcelReference: parcel.parcelReference,
      });
      return;
    }

    const normalizedPayload = {
      parcelReference: record.parcelReference,
      surveyNumber: record.surveyNumber,
      ulpin: record.ulpin,
      areaSqMeters: record.areaSqMeters,
      landCategory: record.landCategory,
      ownerName: record.ownerName,
      ownershipType: record.ownershipType,
      recordStatus: record.recordStatus,
      recordVersion: record.recordVersion,
      lastUpdated: record.lastUpdated,
    };

    const rawPayloadHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(record.rawData || {}))
      .digest("hex");

    await prisma.landRecordReference.upsert({
      where: {
        sourceSystem_sourceRecordId: {
          sourceSystem: record.sourceSystem,
          sourceRecordId: record.sourceRecordId,
        },
      },
      update: {
        recordStatus: record.recordStatus,
        recordVersion: record.recordVersion,
        retrievedAt: new Date(),
        rawPayloadHash,
        normalizedPayload,
      },
      create: {
        cadastralParcel: { connect: { id: cadastralParcelId } },
        sourceSystem: record.sourceSystem,
        sourceRecordId: record.sourceRecordId,
        parcelReference: record.parcelReference,
        surveyNumber: record.surveyNumber,
        ulpin: record.ulpin,
        recordStatus: record.recordStatus,
        recordVersion: record.recordVersion,
        retrievedAt: new Date(),
        rawPayloadHash,
        normalizedPayload,
      },
    });

    logger.info("Land record synced successfully", {
      parcelId: cadastralParcelId,
      sourceSystem: record.sourceSystem,
      sourceRecordId: record.sourceRecordId,
    });
  }

  async getLandRecordHistory(cadastralParcelId: string) {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: cadastralParcelId },
    });

    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    return prisma.landRecordReference.findMany({
      where: { cadastralParcelId },
      orderBy: { retrievedAt: "desc" },
    });
  }

  async getLatestLandRecord(cadastralParcelId: string) {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: cadastralParcelId },
    });

    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    return prisma.landRecordReference.findFirst({
      where: { cadastralParcelId },
      orderBy: { retrievedAt: "desc" },
    });
  }
}

export default new LandRecordService();
