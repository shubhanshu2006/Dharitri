import app from "./app.js";
import { connectDB, disconnectDB } from "./database/connect.js";
import { logger } from "./utils/logger.js";

const PORT = parseInt(process.env.PORT || "5000", 10);

async function startServer(): Promise<void> {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
      });
      logger.info(`Health check available at: http://localhost:${PORT}/health`);
      logger.info(`API available at: http://localhost:${PORT}/api/v1`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await disconnectDB();
          logger.info("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown", {
            error: error instanceof Error ? error.message : "Unknown error",
          });
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

startServer();
