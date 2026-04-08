const crypto = require("crypto");

const { getAppConfig } = require("../config/env");
const { sendEmail } = require("./emailService");

function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtpCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

function buildOtpSessionRecord(user, code) {
  const { auth } = getAppConfig();
  const expiresAt = new Date(Date.now() + auth.otpExpiresMinutes * 60 * 1000);

  return {
    user: {
      id: String(user.id),
      email: user.email,
      role: user.role,
      display_name: user.display_name
    },
    codeHash: hashOtpCode(code),
    expiresAt: expiresAt.toISOString(),
    attempts: 0
  };
}

function verifyOtpCode(record, code) {
  if (!record || !code) {
    return { ok: false, reason: "missing" };
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  if (record.codeHash !== hashOtpCode(code)) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true };
}

async function sendLoginOtp(user, code) {
  const { auth, siteUrl } = getAppConfig();
  const subject = `Your PEA Jabalpur login OTP is ${code}`;
  const text = [
    `Hello ${user.display_name || "Member"},`,
    "",
    `Your one-time login code is: ${code}`,
    `This code will expire in ${auth.otpExpiresMinutes} minutes.`,
    "",
    `If you did not request this login, you can ignore this email.`,
    siteUrl ? `Site: ${siteUrl}` : ""
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <p>Hello ${user.display_name || "Member"},</p>
      <p>Your one-time login code is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
      <p>This code will expire in ${auth.otpExpiresMinutes} minutes.</p>
      <p>If you did not request this login, you can ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
}

module.exports = {
  buildOtpSessionRecord,
  generateOtpCode,
  sendLoginOtp,
  verifyOtpCode
};
