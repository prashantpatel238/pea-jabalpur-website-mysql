const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const publicRoutes = require("./routes/publicRoutes");
const { notFoundHandler } = require("./middleware/notFound");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", publicRoutes);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`PEA Jabalpur site running at http://localhost:${port}`);
});
