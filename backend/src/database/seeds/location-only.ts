import "dotenv/config";
import { seedLocations } from "./location.seed.js";
import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

async function main() {
  try {
    logger.info("Starting locations seeding...");

    await seedLocations();

    logger.info("Locations seeding completed successfully");
  } catch (error) {
    logger.error("Locations seeding failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
