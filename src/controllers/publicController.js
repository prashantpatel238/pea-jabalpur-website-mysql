const site = require("../config/site");
const {
  homeStats,
  homeFeatures,
  leadershipMembers,
  aboutValues,
  directoryMembers,
  resourcePages
} = require("../config/publicContent");

const getBaseViewData = (page) => ({
  site,
  page
});

const renderHome = (req, res) => {
  res.render("public/home", {
    ...getBaseViewData({ title: `${site.title} - Connecting Engineering Excellence`, path: "/" }),
    stats: homeStats,
    features: homeFeatures,
    leaders: leadershipMembers
  });
};

const renderAbout = (req, res) => {
  res.render("public/about", {
    ...getBaseViewData({ title: `About Us - ${site.title}`, path: "/about" }),
    values: aboutValues
  });
};

const renderContact = (req, res) => {
  res.render("public/contact", {
    ...getBaseViewData({ title: `Contact Us - ${site.title}`, path: "/contact" })
  });
};

const renderLeadership = (req, res) => {
  res.render("public/leadership", {
    ...getBaseViewData({ title: `Leadership Team - ${site.title}`, path: "/leadership" }),
    members: leadershipMembers
  });
};

const renderDirectory = (req, res) => {
  res.render("public/directory", {
    ...getBaseViewData({ title: `Member Directory - ${site.title}`, path: "/directory" }),
    members: directoryMembers
  });
};

const renderRegistration = (req, res) => {
  res.render("public/register", {
    ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" })
  });
};

const renderNotices = (req, res) => {
  res.render("public/notices", {
    ...getBaseViewData({ title: `Notice Board - ${site.title}`, path: "/notices" })
  });
};

const renderResource = (req, res, key) => {
  const resource = resourcePages[key];

  if (!resource) {
    return res.status(404).render("public/not-found", {
      ...getBaseViewData({ title: `Page Not Found - ${site.title}`, path: req.path })
    });
  }

  return res.render("public/resource", {
    ...getBaseViewData({ title: `${resource.title} - ${site.title}`, path: req.path }),
    resource
  });
};

const handleRegistrationRequest = (req, res) => {
  // TODO: Replace this placeholder handler with MongoDB-backed pending member registration.
  // TODO: Never generate member_id here. It must only be created after admin approval.
  res.status(202).render("public/register", {
    ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
    formSubmitted: true
  });
};

const handleContactRequest = (req, res) => {
  // TODO: Connect this form to a validated contact workflow or admin inbox.
  res.status(202).render("public/contact", {
    ...getBaseViewData({ title: `Contact Us - ${site.title}`, path: "/contact" }),
    formSubmitted: true
  });
};

module.exports = {
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
};
