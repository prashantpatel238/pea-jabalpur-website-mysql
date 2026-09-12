const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { getAppConfig } = require("../config/env");
const { findActiveAdminByEmail } = require("../repositories/adminRepository");
const { findApprovedMemberByEmail } = require("../repositories/memberRepository");
const {
  consumeResetToken,
  createResetToken,
  findResetAccount,
  findValidResetToken
} = require("../repositories/passwordResetRepository");
const {
  sendPasswordChangedEmail,
  sendPasswordResetEmail
} = require("../services/notificationEmailService");
const { buildPage } = require("../utils/page");

const NEUTRAL_MESSAGE = "If an account exists for this email, password reset instructions have been sent.";
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

function renderForgot(req, res) {
  res.render("auth/forgot-password", { page: buildPage("/forgot-password", "Forgot Password") });
}

async function requestReset(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const admin = await findActiveAdminByEmail(email);
  const member = admin ? null : await findApprovedMemberByEmail(email);
  const user = admin || member;

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await createResetToken({
      accountType: admin ? "admin" : "member",
      accountId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt
    });
    const origin = (getAppConfig().siteUrl || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");

    try {
      await sendPasswordResetEmail(user, `${origin}/reset-password/${rawToken}`);
    } catch (error) {
      // Keep the response neutral so account existence cannot be inferred.
      console.error("Password reset email delivery failed:", error?.message || "Unknown email error");
    }
  }

  return res.render("auth/forgot-password", {
    page: buildPage("/forgot-password", "Forgot Password"),
    successMessage: NEUTRAL_MESSAGE
  });
}

async function renderReset(req, res) {
  const valid = await findValidResetToken(hashToken(req.params.token));
  return res.status(valid ? 200 : 400).render("auth/reset-password", {
    page: buildPage("/reset-password", "Reset Password"),
    token: req.params.token,
    invalid: !valid
  });
}

async function resetPassword(req, res) {
  const token = req.params.token;
  const record = await findValidResetToken(hashToken(token));
  const password = String(req.body.password || "");

  if (!record) {
    return res.status(400).render("auth/reset-password", {
      page: buildPage("/reset-password", "Reset Password"), token, invalid: true
    });
  }
  if (password.length < 8 || password !== req.body.confirm_password) {
    return res.status(400).render("auth/reset-password", {
      page: buildPage("/reset-password", "Reset Password"), token, invalid: false,
      errorMessage: "Passwords must match and contain at least 8 characters."
    });
  }

  const account = await findResetAccount(record);
  await consumeResetToken(record, await bcrypt.hash(password, 12));
  if (account) {
    try {
      await sendPasswordChangedEmail(account);
    } catch (error) {
      console.error("Password changed confirmation email delivery failed:", error?.message || "Unknown email error");
    }
  }

  req.session.flash = { type: "success", message: "Password reset successfully. You can now sign in." };
  return res.redirect("/auth/login");
}

module.exports = { renderForgot, requestReset, renderReset, resetPassword };
