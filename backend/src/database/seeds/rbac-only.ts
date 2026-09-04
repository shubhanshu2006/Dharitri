import "dotenv/config";
import { seedRolesAndPermissions } from "./rbac.seed.js";
import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

async function main() {
  try {
    logger.info("Starting RBAC seeding...");

    await seedRolesAndPermissions();

    logger.info("RBAC seeding completed successfully");
  } catch (error) {
    logger.error("RBAC seeding failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
