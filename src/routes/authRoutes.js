const express = require("express");

const {
  renderLogin,
  handleLogin,
  handleLogout
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

module.exports = router;
