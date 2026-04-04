const site = require("../config/site");

function buildPage(path, title) {
  return {
    path,
    title: `${title} - ${site.title}`
  };
}

module.exports = {
  buildPage
};
