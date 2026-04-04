const express = require("express");

const {
  renderLogin,
  handleLogin,
  handleLogout
} = require("../controllers/authController");
const { loginRateLimit } = require("../middleware/loginRateLimit");

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", loginRateLimit, handleLogin);
router.post("/logout", handleLogout);

module.exports = router;
