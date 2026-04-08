const bcrypt = require("bcryptjs");

const { buildOtpSessionRecord, generateOtpCode, sendLoginOtp, verifyOtpCode } = require("../services/authOtpService");
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
    formData: res.locals.formState.authLogin || {},
    otpState: req.session.authOtp || null
  });
}

async function findLoginUserByEmail(email) {
  const admin = await findActiveAdminByEmail(email);

  if (admin) {
    return {
      id: admin.id,
      email: admin.email,
      role: "admin",
      display_name: admin.display_name,
      password_hash: admin.password_hash
    };
  }

  const member = await findApprovedMemberByEmail(email);

  if (!member) {
    return null;
  }

  return {
    id: member.id,
    email: member.email,
    role: "member",
    display_name: member.full_name,
    password_hash: member.password_hash,
    member
  };
}

async function completeLogin(req, user) {
  if (user.role === "admin") {
    await updateAdminLastLoginAt(user.id);
  } else if (user.role === "member") {
    await updateMemberById(user.id, {
      ...user.member,
      last_login_at: new Date()
    });
  }

  await regenerateSession(req);
  req.session.user = {
    id: String(user.id),
    email: user.email,
    role: user.role,
    display_name: user.display_name
  };
  req.session.flash = { type: "success", message: "Login successful." };
}

async function handleLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  const user = await findLoginUserByEmail(email);

  if (!user) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Invalid email or password.",
      formData: sanitizeFormState(req.body),
      otpState: req.session.authOtp || null
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Invalid email or password.",
      formData: sanitizeFormState(req.body),
      otpState: req.session.authOtp || null
    });
  }

  await completeLogin(req, user);
  return res.redirect(user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
}

async function handleRequestOtpLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const user = await findLoginUserByEmail(email);

  if (!user) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "No active admin or approved member account was found for this email.",
      formData: sanitizeFormState(req.body),
      otpState: req.session.authOtp || null
    });
  }

  const code = generateOtpCode();
  await sendLoginOtp(user, code);

  req.session.authOtp = buildOtpSessionRecord(user, code);

  return res.render("auth/login", {
    page: buildPage("/auth/login", "Login"),
    formData: { email: user.email },
    otpState: req.session.authOtp,
    otpRequested: true
  });
}

async function handleVerifyOtpLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const otp = (req.body.otp || "").trim();
  const otpState = req.session.authOtp;

  if (!otpState || !otpState.user || otpState.user.email !== email) {
    return res.status(400).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "Please request a new OTP and try again.",
      formData: { email },
      otpState: null
    });
  }

  const verification = verifyOtpCode(otpState, otp);

  if (!verification.ok) {
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: verification.reason === "expired"
        ? "Your OTP has expired. Please request a new one."
        : "Invalid OTP. Please try again.",
      formData: { email },
      otpState
    });
  }

  const user = await findLoginUserByEmail(email);

  if (!user) {
    delete req.session.authOtp;
    return res.status(401).render("auth/login", {
      page: buildPage("/auth/login", "Login"),
      errorMessage: "This account is no longer available for OTP login.",
      formData: { email },
      otpState: null
    });
  }

  delete req.session.authOtp;
  await completeLogin(req, user);
  return res.redirect(user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
}

async function handleLogout(req, res) {
  await destroySession(req);
  res.clearCookie("connect.sid");
  return res.redirect("/auth/login");
}

module.exports = {
  renderLogin,
  handleLogin,
  handleRequestOtpLogin,
  handleVerifyOtpLogin,
  handleLogout
};
