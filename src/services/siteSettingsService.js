const site = require("../config/site");
const {
  createDefaultSiteSettingsRow,
  findDefaultSiteSettingsRow,
  updateSiteSettingsRow
} = require("../repositories/siteSettingsRepository");

const DEFAULT_MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.3947!2d79.9!3d23.1815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDEwJzUzLjQiTiA3OcKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890";

function getDefaultSiteSettingsValues() {
  const facebook = site.socialLinks.find((link) => link.label === "Facebook")?.href || "";
  const instagram = site.socialLinks.find((link) => link.label === "Instagram")?.href || "";
  const youtube = site.socialLinks.find((link) => link.label === "YouTube")?.href || "";

  return {
    site_title: site.title,
    site_tagline: site.tagline,
    logo_path: site.logoPath,
    favicon_path: site.logoPath,
    contact_phone: site.contact.phone,
    whatsapp_number: site.contact.whatsapp,
    contact_email: site.contact.email,
    address: site.contact.addressLines.join(", "),
    google_map_embed_url: DEFAULT_MAP_EMBED_URL,
    facebook_url: facebook === "#" ? "" : facebook,
    instagram_url: instagram === "#" ? "" : instagram,
    youtube_url: youtube === "#" ? "" : youtube,
    footer_text: `${site.title}. All rights reserved.`
  };
}

function buildPublicSiteSettings(settings = {}) {
  return {
    ...getDefaultSiteSettingsValues(),
    ...settings
  };
}

function buildTemplateSite(siteSettings) {
  const normalizedAddress = siteSettings.address || "";

  return {
    ...site,
    title: siteSettings.site_title,
    tagline: siteSettings.site_tagline,
    logoPath: siteSettings.logo_path,
    contact: {
      ...site.contact,
      addressLines: normalizedAddress
        .split(",")
        .map((line) => line.trim())
        .filter(Boolean),
      phone: siteSettings.contact_phone,
      whatsapp: siteSettings.whatsapp_number,
      email: siteSettings.contact_email
    },
    socialLinks: [
      { label: "Facebook", href: siteSettings.facebook_url || "#" },
      { label: "Instagram", href: siteSettings.instagram_url || "#" },
      { label: "YouTube", href: siteSettings.youtube_url || "#" }
    ]
  };
}

async function findCanonicalSiteSettings() {
  return findDefaultSiteSettingsRow();
}

async function ensureSiteSettings() {
  const canonicalSettings = await findCanonicalSiteSettings();

  if (canonicalSettings) {
    return canonicalSettings;
  }

  return createDefaultSiteSettingsRow(getDefaultSiteSettingsValues());
}

async function getSiteSettings() {
  const settings = await findCanonicalSiteSettings();

  if (!settings) {
    return null;
  }

  return buildPublicSiteSettings(settings);
}

async function getOrCreateSiteSettings() {
  const existingSettings = await findCanonicalSiteSettings();

  if (existingSettings) {
    return existingSettings;
  }

  return ensureSiteSettings();
}

async function saveSiteSettings(values) {
  const existingSettings = await getOrCreateSiteSettings();

  return updateSiteSettingsRow(existingSettings.id, values);
}

async function getSiteSettingsLocals() {
  try {
    const settings = await getSiteSettings();
    const siteSettings = settings || buildPublicSiteSettings();

    return {
      siteSettings,
      site: buildTemplateSite(siteSettings)
    };
  } catch (error) {
    const siteSettings = buildPublicSiteSettings();

    return {
      siteSettings,
      site: buildTemplateSite(siteSettings)
    };
  }
}

module.exports = {
  buildPublicSiteSettings,
  buildTemplateSite,
  ensureSiteSettings,
  getDefaultSiteSettingsValues,
  getOrCreateSiteSettings,
  getSiteSettings,
  getSiteSettingsLocals,
  saveSiteSettings
};
