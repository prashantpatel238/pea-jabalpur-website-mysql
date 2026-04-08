const express = require("express");
const { uploadMemberPhoto } = require("../middleware/memberPhotoUpload");
const { uploadSiteAssets } = require("../middleware/siteSettingsUpload");

const {
  renderDashboard,
  renderPendingMembers,
  renderApprovedMembers,
  renderMemberDetail,
  handleCreateMember,
  renderEditMember,
  handleUpdateMember,
  handleApproveMember,
  handleRejectMember,
  handleDeleteMember,
  handleExportMembers,
  handleCreateNotice,
  renderEditNotice,
  handleUpdateNotice,
  handleDeleteNotice
} = require("../controllers/adminController");
const {
  renderSettings,
  handleUpdateSettings
} = require("../controllers/adminSettingsController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAdmin, (req, res) => res.redirect("/admin/dashboard"));
router.get("/dashboard", requireAdmin, renderDashboard);
router.get("/settings", requireAdmin, renderSettings);
router.post("/settings", requireAdmin, uploadSiteAssets, handleUpdateSettings);
router.get("/members/pending", requireAdmin, renderPendingMembers);
router.get("/members/approved", requireAdmin, renderApprovedMembers);
router.get("/members/export", requireAdmin, handleExportMembers);
router.get("/members/:id", requireAdmin, renderMemberDetail);
router.post("/members", requireAdmin, uploadMemberPhoto, handleCreateMember);
router.get("/members/:id/edit", requireAdmin, renderEditMember);
router.post("/members/:id/edit", requireAdmin, uploadMemberPhoto, handleUpdateMember);
router.post("/members/:id/approve", requireAdmin, handleApproveMember);
router.post("/members/:id/reject", requireAdmin, handleRejectMember);
router.post("/members/:id/delete", requireAdmin, handleDeleteMember);
router.post("/notices", requireAdmin, handleCreateNotice);
router.get("/notices/:id/edit", requireAdmin, renderEditNotice);
router.post("/notices/:id/edit", requireAdmin, handleUpdateNotice);
router.post("/notices/:id/delete", requireAdmin, handleDeleteNotice);

module.exports = router;
