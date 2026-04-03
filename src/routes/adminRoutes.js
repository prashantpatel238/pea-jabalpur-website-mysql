const express = require("express");

const {
  renderAdminLogin,
  handleAdminLogin,
  handleAdminLogout,
  renderDashboard,
  handleCreateMember,
  renderEditMember,
  handleUpdateMember,
  handleApproveMember,
  handleRejectMember,
  handleDeleteMember,
  handleCreateNotice,
  renderEditNotice,
  handleUpdateNotice,
  handleDeleteNotice
} = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/login", renderAdminLogin);
router.post("/login", handleAdminLogin);
router.post("/logout", handleAdminLogout);
router.get("/", requireAdmin, renderDashboard);
router.post("/members", requireAdmin, handleCreateMember);
router.get("/members/:id/edit", requireAdmin, renderEditMember);
router.post("/members/:id/edit", requireAdmin, handleUpdateMember);
router.post("/members/:id/approve", requireAdmin, handleApproveMember);
router.post("/members/:id/reject", requireAdmin, handleRejectMember);
router.post("/members/:id/delete", requireAdmin, handleDeleteMember);
router.post("/notices", requireAdmin, handleCreateNotice);
router.get("/notices/:id/edit", requireAdmin, renderEditNotice);
router.post("/notices/:id/edit", requireAdmin, handleUpdateNotice);
router.post("/notices/:id/delete", requireAdmin, handleDeleteNotice);

module.exports = router;
