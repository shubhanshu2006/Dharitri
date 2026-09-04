import "dotenv/config";
import { seedCompensationRuleSets } from "./compensation-ruleset.js";
import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

async function main() {
  try {
    logger.info("Starting compensation rule set seeding...");
    await seedCompensationRuleSets();
    logger.info("Compensation rule set seeding completed");
  } catch (error) {
    logger.error("Compensation rule set seeding failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
