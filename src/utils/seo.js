const { getAppConfig } = require("../config/env");

function getSiteOrigin() {
  const { siteUrl } = getAppConfig();
  return (siteUrl || "http://localhost:3000").replace(/\/+$/, "");
}

function buildAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${normalizedPath}`;
}

function getDefaultSeoImage(siteSettings) {
  const imagePath = siteSettings.logo_path || "/assets/images/pea-mark.svg";
  return buildAbsoluteUrl(imagePath);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getPublicSitePaths() {
  return [
    "/",
    "/about",
    "/contact",
    "/leadership",
    "/member-directory",
    "/register",
    "/notices"
  ];
}

function buildSitemapXml(entries) {
  const urls = entries.map((entry) => {
    const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
    const changefreq = entry.changefreq ? `<changefreq>${escapeXml(entry.changefreq)}</changefreq>` : "";
    const priority = typeof entry.priority === "number" ? `<priority>${entry.priority.toFixed(1)}</priority>` : "";

    return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}${changefreq}${priority}</url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

module.exports = {
  buildAbsoluteUrl,
  buildSitemapXml,
  escapeXml,
  getDefaultSeoImage,
  getPublicSitePaths,
  getSiteOrigin
};
