const crypto = require("crypto");

const { getAppConfig } = require("../config/env");
const { sendLoginOtpEmail } = require("./notificationEmailService");

const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtpCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}

function maskEmailAddress(email) {
  const [localPart, domain] = String(email || "").split("@");
  if (!localPart || !domain) return "your registered email";

  const visibleLength = Math.min(2, localPart.length);
  return `${localPart.slice(0, visibleLength)}${"*".repeat(Math.max(4, localPart.length - visibleLength))}@${domain}`;
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
    sentAt: new Date().toISOString(),
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

  const actualHash = Buffer.from(hashOtpCode(code), "hex");
  const expectedHash = Buffer.from(record.codeHash, "hex");
  if (actualHash.length !== expectedHash.length || !crypto.timingSafeEqual(actualHash, expectedHash)) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true };
}

async function sendLoginOtp(user, code) {
  await sendLoginOtpEmail(user, code);
}

module.exports = {
  buildOtpSessionRecord,
  generateOtpCode,
  MAX_OTP_ATTEMPTS,
  maskEmailAddress,
  OTP_RESEND_COOLDOWN_MS,
  sendLoginOtp,
  verifyOtpCode
};
