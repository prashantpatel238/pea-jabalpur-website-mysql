const bcrypt = require("bcryptjs");

const {
  findActiveAdminByEmail,
  updateAdminLastLoginAt
} = require("../repositories/adminRepository");
const {
  findApprovedMemberByEmail,
  updateMemberById
} = require("../repositories/memberRepository");
const { buildPage } = require("../utils/page");
const { sanitizeFormState } = require("../utils/formState");

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function renderLogin(req, res) {
  if (req.session.user?.role === "admin") {
    return res.redirect("/admin/dashboard");
  }

  if (req.session.user?.role === "member") {
    return res.redirect("/member/dashboard");
  }

  return res.render("auth/login", {
    page: buildPage("/auth/login", "Login"),
    formData: res.locals.formState.authLogin || {}
  });
}

async function handleLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const admin = await findActiveAdminByEmail(email);

  if (admin) {
    const isValidAdminPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidAdminPassword) {
      return res.status(401).render("auth/login", {
        page: buildPage("/auth/login", "Login"),
        errorMessage: "Invalid email or password.",
        formData: sanitizeFormState(req.body)
      });
    }

    await updateAdminLastLoginAt(admin.id);

    await regenerateSession(req);
    req.session.user = {
      id: String(admin.id),
      email: admin.email,
      role: "admin",
      display_name: admin.display_name
    };
    req.session.flash = { type: "success", message: "Login successful." };

    return res.redirect("/admin/dashboard");
  }

  const member = await findApprovedMemberByEmail(email);

  if (!member) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Invalid email or password.",
      formData: sanitizeFormState(req.body)
    });
  }

  const isValidMemberPassword = await bcrypt.compare(password, member.password_hash);

  if (!isValidMemberPassword) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Invalid email or password.",
      formData: sanitizeFormState(req.body)
    });
  }

  await updateMemberById(member.id, {
    ...member,
    last_login_at: new Date()
  });

  await regenerateSession(req);
  req.session.user = {
    id: String(member.id),
    email: member.email,
    role: "member",
    display_name: member.full_name
  };
  req.session.flash = { type: "success", message: "Login successful." };

  return res.redirect("/member/dashboard");
}

async function handleLogout(req, res) {
  await destroySession(req);
  res.clearCookie("connect.sid");
  return res.redirect("/auth/login");
}

module.exports = {
  renderLogin,
  handleLogin,
  handleLogout
};
