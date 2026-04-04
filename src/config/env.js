const requiredEnvironmentVariables = [
  "MONGODB_URI",
  "SESSION_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD"
];

function getMissingEnvironmentVariables() {
  return requiredEnvironmentVariables.filter((name) => !process.env[name]);
}

function validateEnvironment() {
  const missingVariables = getMissingEnvironmentVariables();

  if (missingVariables.length) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
}

function getAppConfig() {
  return {
    isProduction: process.env.NODE_ENV === "production",
    port: Number(process.env.PORT) || 3000,
    mongoUri: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET
  };
}

module.exports = {
  getAppConfig,
  getMissingEnvironmentVariables,
  validateEnvironment
};
