import { prisma } from "./client.js";
import { logger } from "../utils/logger.js";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    logger.info("Database already connected");
    return;
  }

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    isConnected = true;
    logger.info("Database connected successfully", {
      database: "PostgreSQL",
      orm: "Prisma",
    });
  } catch (error) {
    logger.error("Database connection failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) {
    return;
  }

  try {
    await prisma.$disconnect();
    isConnected = false;
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Database disconnect failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

export const isDatabaseConnected = (): boolean => {
  return isConnected;
};
