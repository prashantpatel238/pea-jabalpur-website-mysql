const dotenv = require("dotenv");
const { createApp } = require("./app");
const { connectToDatabase, disconnectFromDatabase } = require("./config/database");
const { getAppConfig, validateEnvironment } = require("./config/env");
const { ensureInitialAdmin } = require("./services/adminBootstrap");

require("./models/Admin");
require("./models/Member");
require("./models/Notice");

dotenv.config();

async function startServer() {
  validateEnvironment();

  const app = createApp();
  const { port } = getAppConfig();

  await connectToDatabase();
  await ensureInitialAdmin();

  const server = app.listen(port, () => {
    console.log(`PEA Jabalpur site running at http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
