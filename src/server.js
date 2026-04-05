const dotenv = require("dotenv");

const { createApp } = require("./app");
const { connectToDatabase, disconnectFromDatabase, formatDatabaseConnectionError } = require("./config/database");
const { getAppConfig, validateEnvironment } = require("./config/env");
const { ensureInitialAdmin } = require("./services/adminBootstrap");
const { ensureSiteSettings } = require("./services/siteSettingsService");
const { bootstrapDatabase } = require("./services/databaseBootstrap");

dotenv.config();

let httpServer = null;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (httpServer) {
    await new Promise((resolve) => {
      httpServer.close(resolve);
    });
  }

  await disconnectFromDatabase();
  process.exit(0);
}

function registerProcessHandlers() {
  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
  });
}

async function startServer() {
  validateEnvironment();

  const app = createApp();
  const { port, database } = getAppConfig();

  try {
    await connectToDatabase();
    await bootstrapDatabase();
    await ensureInitialAdmin();
    await ensureSiteSettings();
  } catch (error) {
    console.error("Server startup halted during dependency initialization.");
    console.error(formatDatabaseConnectionError(error, database));

    throw error;
  }

  httpServer = app.listen(port, () => {
    console.log(`PEA Jabalpur site running at http://localhost:${port}`);
  });
}

registerProcessHandlers();

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
