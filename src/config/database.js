const mongoose = require("mongoose");
const { getAppConfig } = require("./env");

async function connectToDatabase() {
  const { mongoUri } = getAppConfig();

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

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
  mongoose
};
