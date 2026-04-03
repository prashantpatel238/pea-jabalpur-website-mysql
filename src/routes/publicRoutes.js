const express = require("express");
const {
  renderHome,
  renderAbout,
  renderContact,
  renderLeadership,
  renderDirectory,
  renderRegistration,
  renderNotices,
  renderResource,
  handleRegistrationRequest,
  handleContactRequest
} = require("../controllers/publicController");

const router = express.Router();

router.get("/", renderHome);
router.get("/about", renderAbout);
router.get("/contact", renderContact);
router.post("/contact", handleContactRequest);
router.get("/leadership", (req, res) => res.redirect(301, "/important-members"));
router.get("/important-members", renderLeadership);
router.get("/member-directory", renderDirectory);
router.get("/directory", (req, res) => res.redirect(301, "/member-directory"));
router.get("/register", renderRegistration);
router.post("/register", handleRegistrationRequest);
router.get("/notices", renderNotices);
router.get("/resources/:slug", (req, res) => renderResource(req, res, req.params.slug));

module.exports = router;
