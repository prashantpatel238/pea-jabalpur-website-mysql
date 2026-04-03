const express = require("express");
const site = require("../config/site");
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
router.get("/leadership", renderLeadership);
router.get("/important-members", (req, res) => res.redirect(301, "/leadership"));
router.get("/directory", renderDirectory);
router.get("/register", renderRegistration);
router.post("/register", handleRegistrationRequest);
router.get("/notices", renderNotices);
router.get("/resources/:slug", (req, res) => renderResource(req, res, req.params.slug));
router.get("/admin", (req, res) => {
  res.render("admin/dashboard", {
    site,
    page: { title: `Admin Dashboard - ${site.title}`, path: "/admin" }
  });
});

module.exports = router;
