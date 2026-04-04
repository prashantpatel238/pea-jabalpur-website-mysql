const helmet = require("helmet");

const secureHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
});

module.exports = {
  secureHeaders
};
