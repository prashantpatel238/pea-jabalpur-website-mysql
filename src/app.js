const path = require("path");
const express = require("express");
const session = require("express-session");
const connectMongo = require("connect-mongo");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const memberRoutes = require("./routes/memberRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { notFoundHandler } = require("./middleware/notFound");
const { secureHeaders } = require("./middleware/security");
const { attachSiteSettings } = require("./middleware/siteSettingsLocals");
const { attachViewLocals } = require("./middleware/viewLocals");
const { getAppConfig } = require("./config/env");

function createApp() {
  const app = express();
  const mongoStoreFactory = connectMongo.default || connectMongo.MongoStore || connectMongo;
  const { isProduction, mongoUri, sessionSecret } = getAppConfig();

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(secureHeaders);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: mongoUri ? mongoStoreFactory.create({ mongoUrl: mongoUri }) : undefined,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8
    }
  }));
  app.use(attachSiteSettings);
  app.use(attachViewLocals);

  app.use("/", publicRoutes);
  app.use("/auth", authRoutes);
  app.use("/admin", adminRoutes);
  app.use("/member", memberRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
