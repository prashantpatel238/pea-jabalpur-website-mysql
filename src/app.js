const path = require("path");
const express = require("express");
const session = require("express-session");
const connectMongo = require("connect-mongo");

const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const memberRoutes = require("./routes/memberRoutes");
const { notFoundHandler } = require("./middleware/notFound");
const { attachViewLocals } = require("./middleware/viewLocals");

function createApp() {
  const app = express();
  const mongoStoreFactory = connectMongo.default || connectMongo.MongoStore || connectMongo;

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(session({
    secret: process.env.SESSION_SECRET || "development-session-secret",
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGODB_URI ? mongoStoreFactory.create({ mongoUrl: process.env.MONGODB_URI }) : undefined,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8
    }
  }));
  app.use(attachViewLocals);

  app.use("/", publicRoutes);
  app.use("/admin", adminRoutes);
  app.use("/member", memberRoutes);
  app.use(notFoundHandler);

  return app;
}

module.exports = { createApp };
