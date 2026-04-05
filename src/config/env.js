const requiredDatabaseEnvironmentVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "SESSION_SECRET"
];

const requiredEnvironmentVariables = [
  ...requiredDatabaseEnvironmentVariables,
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME"
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

function getMissingDatabaseEnvironmentVariables() {
  return requiredDatabaseEnvironmentVariables.filter((name) => !process.env[name]);
}

function validateDatabaseEnvironment() {
  const missingVariables = getMissingDatabaseEnvironmentVariables();

  if (missingVariables.length) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
}

function getAppConfig() {
  return {
    isProduction: process.env.NODE_ENV === "production",
    port: Number(process.env.PORT) || 3000,
    database: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME
    },
    sessionSecret: process.env.SESSION_SECRET,
    siteUrl: process.env.SITE_URL,
    admin: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME
    }
  };
}

module.exports = {
  getAppConfig,
  getMissingDatabaseEnvironmentVariables,
  getMissingEnvironmentVariables,
  validateDatabaseEnvironment,
  validateEnvironment
};
