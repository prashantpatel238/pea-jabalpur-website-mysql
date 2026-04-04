const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const { buildPage } = require("../utils/page");

async function renderLogin(req, res) {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }

  return res.render("auth/login", {
    page: buildPage("/auth/login", "Admin Login")
  });
}

async function handleLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const admin = await Admin.findOne({ email, is_active: true });

  if (!admin) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Admin Login"),
      errorMessage: "Invalid admin credentials."
    });
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);

  if (!isValidPassword) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Admin Login"),
      errorMessage: "Invalid admin credentials."
    });
  }

  admin.last_login_at = new Date();
  await admin.save();

  req.session.admin = {
    id: admin._id.toString(),
    email: admin.email,
    display_name: admin.display_name
  };
  req.session.flash = { type: "success", message: "Admin login successful." };

  return res.redirect("/admin/dashboard");
}

function handleLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
}

module.exports = {
  renderLogin,
  handleLogin,
  handleLogout
};
