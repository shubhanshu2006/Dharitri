import { connectDB, disconnectDB } from "./database/connect.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });

const shutdownServer = async () => {
  try {
    await disconnectDB();
    console.log("Server is shutting down gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during server shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdownServer);
process.on("SIGTERM", shutdownServer);
