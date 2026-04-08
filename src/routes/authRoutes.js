const express = require("express");

const {
  renderLogin,
  handleLogin,
  handleRequestOtpLogin,
  handleVerifyOtpLogin,
  handleLogout
} = require("../controllers/authController");
const { loginRateLimit } = require("../middleware/loginRateLimit");

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", loginRateLimit, handleLogin);
router.post("/login/otp/request", loginRateLimit, handleRequestOtpLogin);
router.post("/login/otp/verify", loginRateLimit, handleVerifyOtpLogin);
router.post("/logout", handleLogout);

module.exports = router;
