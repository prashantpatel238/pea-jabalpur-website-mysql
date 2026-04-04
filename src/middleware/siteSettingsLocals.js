const { getSiteSettingsLocals } = require("../services/siteSettingsService");

async function attachSiteSettings(req, res, next) {
  const locals = await getSiteSettingsLocals();

  res.locals.siteSettings = locals.siteSettings;
  res.locals.site = locals.site;

  next();
}

module.exports = {
  attachSiteSettings
};
