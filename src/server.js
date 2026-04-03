const dotenv = require("dotenv");
const { createApp } = require("./app");
const { connectToDatabase } = require("./config/database");

require("./models/Member");
require("./models/Notice");

dotenv.config();

function validateEnvironment() {
  const requiredVariables = ["MONGODB_URI", "SESSION_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
}

async function startServer() {
  validateEnvironment();

  const app = createApp();
  const port = process.env.PORT || 3000;

  await connectToDatabase();

  app.listen(port, () => {
    console.log(`PEA Jabalpur site running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
