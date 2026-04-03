const site = require("../config/site");

function notFoundHandler(req, res) {
  res.status(404).render("public/not-found", {
    site,
    page: {
      title: `Page Not Found - ${site.title}`,
      path: req.path
    }
  });
}

module.exports = { notFoundHandler };
