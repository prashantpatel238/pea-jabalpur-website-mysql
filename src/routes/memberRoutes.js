const express = require("express");
const { uploadMemberPhoto } = require("../middleware/memberPhotoUpload");

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
router.post("/profile", requireMember, uploadMemberPhoto, handleUpdateMemberProfile);

module.exports = router;
