const mongoose = require("mongoose");

const { getAppConfig } = require("./env");

let listenersAttached = false;

function getMongoConnectionSummary(mongoUri) {
  if (!mongoUri) {
    return "MongoDB URI not provided";
  }

  try {
    const parsedUrl = new URL(mongoUri);
    const databaseName = parsedUrl.pathname.replace(/^\//, "") || "(default)";
    const hosts = parsedUrl.host || "(unknown host)";

    return `${hosts}/${databaseName}`;
  } catch (error) {
    return "Unable to parse MongoDB URI";
  }
}

function formatMongoConnectionError(error, mongoUri) {
  const details = [
    `Target: ${getMongoConnectionSummary(mongoUri)}`,
    `Error type: ${error.name || "UnknownError"}`,
    `Message: ${error.message || "No error message provided"}`
  ];

  if (error.code) {
    details.push(`Code: ${error.code}`);
  }

  if (error.cause && error.cause.message) {
    details.push(`Cause: ${error.cause.message}`);
  }

  if (error.name === "MongooseServerSelectionError") {
    details.push("Hint: Check the Atlas URI, database user credentials, IP allowlist, and current network access.");
  } else if (/authentication/i.test(error.message || "")) {
    details.push("Hint: Verify the Atlas username, password, and auth database in MONGODB_URI.");
  } else if (/ENOTFOUND|querySrv/i.test(error.message || "")) {
    details.push("Hint: DNS lookup failed. Confirm the Atlas cluster hostname and local DNS/network access.");
  } else if (/ECONNREFUSED|timed out|timeout/i.test(error.message || "")) {
    details.push("Hint: The database could not be reached in time. Check firewall rules, Atlas IP access, and internet connectivity.");
  }

  return details.join("\n");
}

function attachConnectionListeners() {
  if (listenersAttached) {
    return;
  }

  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB runtime error:");
    console.error(formatMongoConnectionError(error, getAppConfig().mongoUri));
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected.");
  });
}

async function connectToDatabase() {
  const { mongoUri } = getAppConfig();

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB.");
  }

  mongoose.set("strictQuery", true);
  attachConnectionListeners();

  console.log(`Connecting to MongoDB Atlas: ${getMongoConnectionSummary(mongoUri)}`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(formatMongoConnectionError(error, mongoUri));
    throw error;
  }

  return mongoose.connection;
}

async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  formatMongoConnectionError,
  getMongoConnectionSummary,
  mongoose
};
