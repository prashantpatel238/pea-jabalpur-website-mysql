const { getAppConfig } = require("./env");
const { closePool, getPool, pingDatabase } = require("../db/mysql");

async function connectToDatabase() {
  const { database } = getAppConfig();

  console.log(`Connecting to MySQL: ${getDatabaseConnectionSummary(database)}`);

  try {
    await pingDatabase();
    console.log(`MySQL connected: ${getDatabaseConnectionSummary(database)}`);
  } catch (error) {
    console.error("MySQL connection failed:");
    console.error(formatDatabaseConnectionError(error, database));
    throw error;
  }

  return getPool();
}

async function disconnectFromDatabase() {
  await closePool();
}

function getDatabaseConnectionSummary(databaseConfig) {
  if (!databaseConfig) {
    return "MySQL configuration not provided";
  }

  const host = databaseConfig.host || "(unknown host)";
  const port = databaseConfig.port || 3306;
  const databaseName = databaseConfig.name || "(unknown database)";

  return `${host}:${port}/${databaseName}`;
}

function formatDatabaseConnectionError(error, databaseConfig) {
  const details = [
    `Target: ${getDatabaseConnectionSummary(databaseConfig)}`,
    `Error type: ${error.name || "UnknownError"}`,
    `Message: ${error.message || "No error message provided"}`
  ];

  if (error.code) {
    details.push(`Code: ${error.code}`);
  }

  if (error.errno) {
    details.push(`Errno: ${error.errno}`);
  }

  if (/ER_ACCESS_DENIED_ERROR/i.test(error.code || "")) {
    details.push("Hint: Verify DB_USER and DB_PASSWORD for the selected Hostinger database.");
  } else if (/ECONNREFUSED|ETIMEDOUT|PROTOCOL_CONNECTION_LOST/i.test(error.code || "")) {
    details.push("Hint: Confirm DB_HOST, DB_PORT, and Hostinger remote MySQL access settings.");
  } else if (/ER_BAD_DB_ERROR/i.test(error.code || "")) {
    details.push("Hint: Check that DB_NAME matches the database created in Hostinger.");
  }

  return details.join("\n");
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  formatDatabaseConnectionError,
  getDatabaseConnectionSummary
};
