const express = require("express");

const {
  redirectMemberLogin,
  renderMemberDashboard,
  renderMemberProfile,
  handleUpdateMemberProfile
} = require("../controllers/memberController");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { requireMember } = require("../middleware/auth");
const { loginRateLimit } = require("../middleware/loginRateLimit");

const router = express.Router();

router.get("/login", redirectMemberLogin);
router.post("/login", loginRateLimit, handleLogin);
router.post("/logout", handleLogout);
router.get("/dashboard", requireMember, renderMemberDashboard);
router.get("/profile", requireMember, renderMemberProfile);
router.post("/profile", requireMember, handleUpdateMemberProfile);

module.exports = router;
