import "dotenv/config";
import { seedRolesAndPermissions } from "./rbac.seed.js";
import { seedLocations } from "./location.seed.js";
import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

async function main() {
  try {
    logger.info("Starting database seeding...");

    await seedRolesAndPermissions();
    await seedLocations();

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Database seeding failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
