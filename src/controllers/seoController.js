const { getPublicSitePaths, buildAbsoluteUrl, buildSitemapXml, getSiteOrigin } = require("../utils/seo");

function renderRobotsTxt(req, res) {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /auth",
    "Disallow: /member",
    "Disallow: /uploads",
    `Sitemap: ${buildAbsoluteUrl("/sitemap.xml")}`
  ];

  res.type("text/plain").send(lines.join("\n"));
}

function renderSitemapXml(req, res) {
  const now = new Date().toISOString();
  const entries = getPublicSitePaths().map((path) => ({
    loc: buildAbsoluteUrl(path),
    lastmod: now,
    changefreq: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.7
  }));

  res.type("application/xml").send(buildSitemapXml(entries));
}

module.exports = {
  renderRobotsTxt,
  renderSitemapXml
};
