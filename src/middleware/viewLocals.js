const site = require("../config/site");
const { buildAbsoluteUrl, getDefaultSeoImage, getSiteOrigin } = require("../utils/seo");

function attachViewLocals(req, res, next) {
  const currentUser = req.session ? req.session.user || null : null;

  res.locals.site = res.locals.site || site;
  res.locals.currentUser = currentUser;
  res.locals.isAdmin = currentUser?.role === "admin";
  res.locals.isMember = currentUser?.role === "member";
  res.locals.currentAdmin = currentUser?.role === "admin" ? currentUser : null;
  res.locals.currentMember = currentUser?.role === "member" ? currentUser : null;
  res.locals.flash = req.session ? req.session.flash : null;
  res.locals.formState = req.session ? req.session.formState || {} : {};
  res.locals.siteOrigin = getSiteOrigin();
  res.locals.currentUrl = buildAbsoluteUrl((req.originalUrl || req.path || "/").split("?")[0]);
  res.locals.defaultRobots = req.path.startsWith("/admin") || req.path.startsWith("/auth") || req.path.startsWith("/member")
    ? "noindex, nofollow"
    : "index, follow";

  if (res.locals.siteSettings) {
    res.locals.defaultSeoImage = getDefaultSeoImage(res.locals.siteSettings);
  }

  if (req.session) {
    delete req.session.flash;
    delete req.session.formState;
  }

  next();
}

module.exports = {
  attachViewLocals
};
