const express = require("express");

const {
  renderMemberLogin,
  handleMemberLogin,
  handleMemberLogout,
  renderMemberProfile,
  handleUpdateMemberProfile
} = require("../controllers/memberController");
const { requireMember } = require("../middleware/auth");

const router = express.Router();

router.get("/login", renderMemberLogin);
router.post("/login", handleMemberLogin);
router.post("/logout", handleMemberLogout);
router.get("/profile", requireMember, renderMemberProfile);
router.post("/profile", requireMember, handleUpdateMemberProfile);

module.exports = router;
