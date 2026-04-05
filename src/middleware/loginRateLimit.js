const rateLimit = require("express-rate-limit");

const { buildPage } = require("../utils/page");

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler(req, res) {
    return res.status(429).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Too many login attempts. Please wait a few minutes and try again."
    });
  }
});

module.exports = {
  loginRateLimit
};
