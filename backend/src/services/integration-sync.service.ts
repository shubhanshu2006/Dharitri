import { prisma } from "../database/client.js";
import landRecordService from "./land-record.service.js";
import cadastralService from "./cadastral.service.js";
import { logger } from "../utils/logger.js";

export class IntegrationSyncService {
  async syncParcelData(cadastralParcelId: string): Promise<{
    landRecordSynced: boolean;
    geometrySynced: boolean;
  }> {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: cadastralParcelId },
    });

    if (!parcel) {
      throw new Error("Cadastral parcel not found");
    }

    logger.info("Starting full parcel data sync", {
      parcelId: cadastralParcelId,
      parcelReference: parcel.parcelReference,
    });

    let landRecordSynced = false;
    let geometrySynced = false;

    try {
      await landRecordService.syncLandRecord(cadastralParcelId);
      landRecordSynced = true;
      logger.info("Land record sync completed", {
        parcelId: cadastralParcelId,
      });
    } catch (error) {
      logger.error("Land record sync failed", {
        parcelId: cadastralParcelId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    try {
      await cadastralService.syncGeometry(cadastralParcelId);
      geometrySynced = true;
      logger.info("Geometry sync completed", { parcelId: cadastralParcelId });
    } catch (error) {
      logger.error("Geometry sync failed", {
        parcelId: cadastralParcelId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    await this.recordSyncEvent(
      cadastralParcelId,
      landRecordSynced,
      geometrySynced,
    );

    logger.info("Full parcel data sync completed", {
      parcelId: cadastralParcelId,
      landRecordSynced,
      geometrySynced,
    });

    return { landRecordSynced, geometrySynced };
  }

  private async recordSyncEvent(
    cadastralParcelId: string,
    landRecordSynced: boolean,
    geometrySynced: boolean,
  ): Promise<void> {
    const status = landRecordSynced && geometrySynced ? "SUCCEEDED" : "FAILED";

    await prisma.integrationSync.create({
      data: {
        integrationSourceId:
          process.env.DEFAULT_INTEGRATION_SOURCE_ID ||
          "00000000-0000-0000-0000-000000000001",
        entityType: "CADASTRAL_PARCEL",
        entityId: cadastralParcelId,
        operation: "FULL_SYNC",
        status,
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: {
          landRecordSynced,
          geometrySynced,
          recordsProcessed: landRecordSynced && geometrySynced ? 2 : 1,
        },
      },
    });
  }

  async bulkSyncParcels(cadastralParcelIds: string[]): Promise<{
    total: number;
    successful: number;
    failed: number;
  }> {
    logger.info("Starting bulk parcel sync", {
      count: cadastralParcelIds.length,
    });

    let successful = 0;
    let failed = 0;

    for (const parcelId of cadastralParcelIds) {
      try {
        await this.syncParcelData(parcelId);
        successful++;
      } catch (error) {
        logger.error("Bulk sync failed for parcel", {
          parcelId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        failed++;
      }
    }

    logger.info("Bulk parcel sync completed", {
      total: cadastralParcelIds.length,
      successful,
      failed,
    });

    return {
      total: cadastralParcelIds.length,
      successful,
      failed,
    };
  }
}

export default new IntegrationSyncService();
