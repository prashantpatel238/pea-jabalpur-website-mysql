const { buildPage } = require("../utils/page");
const {
  buildPublicSiteSettings,
  getDefaultSiteSettingsValues,
  getOrCreateSiteSettings,
  saveSiteSettings
} = require("../services/siteSettingsService");
const {
  getUploadedSiteAssetPath,
  removeUploadedSiteAsset
} = require("../middleware/siteSettingsUpload");
const { setFormState } = require("../utils/formState");
const {
  getEmailValidationMessage,
  getMobileValidationMessage,
  isValidEmail,
  isValidIndianMobileNumber,
  normalizeEmail,
  normalizeMobileNumber
} = require("../utils/validation");

function normalizeSettingsInput(body) {
  return {
    site_title: (body.site_title || "").trim(),
    site_tagline: (body.site_tagline || "").trim(),
    contact_phone: normalizeMobileNumber(body.contact_phone),
    whatsapp_number: normalizeMobileNumber(body.whatsapp_number),
    contact_email: normalizeEmail(body.contact_email),
    address: (body.address || "").trim(),
    google_map_embed_url: (body.google_map_embed_url || "").trim(),
    facebook_url: (body.facebook_url || "").trim(),
    instagram_url: (body.instagram_url || "").trim(),
    youtube_url: (body.youtube_url || "").trim(),
    footer_text: (body.footer_text || "").trim()
  };
}

async function renderSettings(req, res) {
  const settings = await getOrCreateSiteSettings();

  return res.render("admin/settings", {
    page: buildPage("/admin/settings", "Site Settings"),
    settings: {
      ...buildPublicSiteSettings(settings),
      ...(res.locals.formState.adminSettings || {})
    }
  });
}

async function handleUpdateSettings(req, res) {
  if (req.siteAssetUploadError) {
    setFormState(req, "adminSettings", req.body);
    req.session.flash = { type: "error", message: req.siteAssetUploadError };
    return res.redirect("/admin/settings");
  }

  const settings = await getOrCreateSiteSettings();
  const previousLogoPath = settings.logo_path;
  const previousFaviconPath = settings.favicon_path;
  const nextLogoPath = getUploadedSiteAssetPath(req.files, "logo");
  const nextFaviconPath = getUploadedSiteAssetPath(req.files, "favicon");
  const input = normalizeSettingsInput(req.body);

  if (input.contact_email && !isValidEmail(input.contact_email, { allowEmpty: true })) {
    removeUploadedSiteAsset(nextLogoPath);
    removeUploadedSiteAsset(nextFaviconPath);
    setFormState(req, "adminSettings", req.body);
    req.session.flash = { type: "error", message: getEmailValidationMessage("contact email address") };
    return res.redirect("/admin/settings");
  }

  if (input.contact_phone && !isValidIndianMobileNumber(input.contact_phone, { allowEmpty: true })) {
    removeUploadedSiteAsset(nextLogoPath);
    removeUploadedSiteAsset(nextFaviconPath);
    setFormState(req, "adminSettings", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("contact mobile number") };
    return res.redirect("/admin/settings");
  }

  if (input.whatsapp_number && !isValidIndianMobileNumber(input.whatsapp_number, { allowEmpty: true })) {
    removeUploadedSiteAsset(nextLogoPath);
    removeUploadedSiteAsset(nextFaviconPath);
    setFormState(req, "adminSettings", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("WhatsApp mobile number") };
    return res.redirect("/admin/settings");
  }

  const nextSettings = {
    ...settings,
    ...input
  };

  if (nextLogoPath) {
    nextSettings.logo_path = nextLogoPath;
  }

  if (nextFaviconPath) {
    nextSettings.favicon_path = nextFaviconPath;
  }

  if (!nextSettings.site_title) {
    nextSettings.site_title = getDefaultSiteSettingsValues().site_title;
  }

  try {
    await saveSiteSettings(nextSettings);
  } catch (error) {
    removeUploadedSiteAsset(nextLogoPath);
    removeUploadedSiteAsset(nextFaviconPath);
    throw error;
  }

  if (nextLogoPath && previousLogoPath && previousLogoPath !== nextLogoPath) {
    removeUploadedSiteAsset(previousLogoPath);
  }

  if (nextFaviconPath && previousFaviconPath && previousFaviconPath !== nextFaviconPath) {
    removeUploadedSiteAsset(previousFaviconPath);
  }

  req.session.flash = { type: "success", message: "Site settings updated successfully." };
  return res.redirect("/admin/settings");
}

module.exports = {
  renderSettings,
  handleUpdateSettings
};
