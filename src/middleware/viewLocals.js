const site = require("../config/site");
const { buildAbsoluteUrl, getDefaultSeoImage, getSiteOrigin } = require("../utils/seo");

function attachViewLocals(req, res, next) {
  res.locals.site = site;
  res.locals.currentAdmin = req.session ? req.session.admin : null;
  res.locals.currentMember = req.session ? req.session.member : null;
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
