const site = require("../config/site");
const { buildPage } = require("../utils/page");
const { setFormState } = require("../utils/formState");

function getDuplicateKeyMessage(error) {
  const duplicateFields = Object.keys(error.keyValue || {});

  if (duplicateFields.includes("email")) {
    return "This email address is already in use.";
  }

  if (duplicateFields.includes("member_id")) {
    return "A member ID conflict occurred. Please try the action again.";
  }

  if (duplicateFields.includes("key")) {
    return "A generated identifier conflict occurred. Please try again.";
  }

  return "A record with the same unique value already exists.";
}

function normalizeError(error) {
  if (error && error.code === "ER_DUP_ENTRY") {
    return {
      statusCode: 409,
      message: "A record with the same unique value already exists."
    };
  }

  if (error && error.code === 11000) {
    return {
      statusCode: 409,
      message: getDuplicateKeyMessage(error)
    };
  }

  if (error && error.name === "ValidationError") {
    return {
      statusCode: 400,
      message: Object.values(error.errors).map((item) => item.message).join(" ")
    };
  }

  if (error && error.name === "CastError") {
    return {
      statusCode: 404,
      message: "The requested record could not be found."
    };
  }

  return {
    statusCode: error.statusCode || 500,
    message: error.expose ? error.message : "Something went wrong. Please try again."
  };
}

function getRedirectTarget(req) {
  if (req.originalUrl.startsWith("/admin")) {
    return req.get("referer") || "/admin/dashboard";
  }

  if (req.originalUrl.startsWith("/member")) {
    return req.get("referer") || "/member/dashboard";
  }

  if (req.originalUrl.startsWith("/auth")) {
    return "/auth/login";
  }

  if (req.originalUrl.startsWith("/register")) {
    return "/register";
  }

  if (req.originalUrl.startsWith("/contact")) {
    return "/contact";
  }

  return "/";
}

function storeFormStateForRequest(req) {
  if (!req || !req.body) {
    return;
  }

  if (req.originalUrl.startsWith("/register")) {
    setFormState(req, "register", req.body);
    return;
  }

  if (req.originalUrl.startsWith("/auth/login")) {
    setFormState(req, "authLogin", req.body);
    return;
  }

  if (req.originalUrl.startsWith("/member/profile")) {
    setFormState(req, "memberProfile", req.body);
    return;
  }

  if (req.originalUrl.startsWith("/admin/settings")) {
    setFormState(req, "adminSettings", req.body);
    return;
  }

  if (req.originalUrl.match(/^\/admin\/members\/[^/]+\/edit/)) {
    setFormState(req, "adminEditMember", req.body);
    return;
  }

  if (req.originalUrl === "/admin/members") {
    setFormState(req, "adminCreateMember", req.body);
  }
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const normalized = normalizeError(error);

  console.error(`Request failed: ${req.method} ${req.originalUrl}`);
  console.error(error);

  if (req.originalUrl.startsWith("/auth/login")) {
    return res.status(normalized.statusCode).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: normalized.message
    });
  }

  if (req.method === "POST" && req.session) {
    storeFormStateForRequest(req);
    req.session.flash = {
      type: "error",
      message: normalized.message
    };

    return res.redirect(getRedirectTarget(req));
  }

  return res.status(normalized.statusCode).render("public/error", {
    page: {
      title: `Something Went Wrong - ${site.title}`,
      path: req.path
    },
    errorMessage: normalized.message
  });
}

module.exports = {
  errorHandler
};
