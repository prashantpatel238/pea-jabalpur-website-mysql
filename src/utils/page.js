const site = require("../config/site");

function buildPage(path, title, options = {}) {
  return {
    path,
    title: `${title} - ${site.title}`,
    description: options.description || "",
    canonical: options.canonical || path,
    robots: options.robots || "",
    ogType: options.ogType || "website",
    structuredData: options.structuredData || null
  };
}

module.exports = {
  buildPage
};
