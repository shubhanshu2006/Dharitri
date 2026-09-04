import "dotenv/config";
import { seedCadastralParcels } from "./cadastral.seed.js";
import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

async function main() {
  try {
    logger.info("Starting cadastral parcels seeding...");

    await seedCadastralParcels();

    logger.info("Cadastral parcels seeding completed successfully");
  } catch (error) {
    logger.error("Cadastral parcels seeding failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
