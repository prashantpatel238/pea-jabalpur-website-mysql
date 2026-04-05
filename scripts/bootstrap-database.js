const dotenv = require("dotenv");

const { connectToDatabase, disconnectFromDatabase, formatDatabaseConnectionError } = require("../src/config/database");
const { getAppConfig, validateDatabaseEnvironment } = require("../src/config/env");
const { bootstrapDatabase } = require("../src/services/databaseBootstrap");

dotenv.config();

async function run() {
  validateDatabaseEnvironment();

  const { database } = getAppConfig();

  try {
    await connectToDatabase();
    await bootstrapDatabase();
    console.log("MySQL bootstrap completed successfully.");
  } catch (error) {
    console.error("MySQL bootstrap failed.");
    console.error(formatDatabaseConnectionError(error, database));
    process.exitCode = 1;
  } finally {
    await disconnectFromDatabase();
  }
}

void run();
