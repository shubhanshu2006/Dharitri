import { prisma } from "./client.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("[Database] Already connected");
    return;
  }

  try {
    await prisma.$connect();
    isConnected = true;
    console.log("[Database] Connected successfully");
  } catch (error) {
    console.error("[Database] Connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await prisma.$disconnect();
    isConnected = false;
    console.log("[Database] Disconnected successfully");
  } catch (error) {
    console.error("[Database] Disconnect failed:", error);
    throw error;
  }
};
