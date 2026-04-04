const dotenv = require("dotenv");

const { createApp } = require("./app");
const { connectToDatabase, disconnectFromDatabase, formatMongoConnectionError } = require("./config/database");
const { getAppConfig, validateEnvironment } = require("./config/env");
const { ensureInitialAdmin } = require("./services/adminBootstrap");
const { ensureSiteSettings } = require("./services/siteSettingsService");

require("./models/Admin");
require("./models/Member");
require("./models/Notice");
require("./models/SiteSetting");

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
  const { port, mongoUri } = getAppConfig();

  try {
    await connectToDatabase();
    await ensureInitialAdmin();
    await ensureSiteSettings();
  } catch (error) {
    console.error("Server startup halted during dependency initialization.");

    if (error.name && error.name.includes("Mongo")) {
      console.error(formatMongoConnectionError(error, mongoUri));
    } else {
      console.error(error);
    }

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
