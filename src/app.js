const path = require("path");
const express = require("express");

const publicRoutes = require("./routes/publicRoutes");
const { notFoundHandler } = require("./middleware/notFound");

function createApp() {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use("/", publicRoutes);
  app.use(notFoundHandler);

  return app;
}

module.exports = { createApp };
