const { getAppConfig } = require("../config/env");
const { sendEmail } = require("./emailService");

const ASSOCIATION_NAME = "Professional Engineers Association Jabalpur";
const OFFICIAL_EMAIL = "admin@professionalpeajbp.in";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absoluteUrl(path) {
  const origin = (getAppConfig().siteUrl || "").replace(/\/$/, "");
  return `${origin}${path}`;
}

function emailLayout(content) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;padding:20px;color:#0f172a;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden"><div style="background:#1d4ed8;color:#ffffff;padding:20px;font-size:20px;font-weight:700">${ASSOCIATION_NAME}</div><div style="padding:24px;line-height:1.6">${content}</div></div></body></html>`;
}

function button(label, url) {
  const safeUrl = escapeHtml(url);
  return `<p style="margin:24px 0"><a href="${safeUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">${escapeHtml(label)}</a></p><p style="font-size:13px;color:#475569;word-break:break-all">${safeUrl}</p>`;
}

async function sendRegistrationReceivedEmail(member) {
  const name = member.full_name || "Applicant";
  return sendEmail({
    to: member.email,
    subject: "Membership Application Received – PEA Jabalpur",
    text: `Dear ${name},\n\nThank you for applying for membership with ${ASSOCIATION_NAME}.\n\nYour membership application has been received and is currently pending administrator approval.\n\nYou will receive another email after your application has been reviewed.\n\nRegards,\n${ASSOCIATION_NAME}`,
    html: emailLayout(`<p>Dear ${escapeHtml(name)},</p><p>Thank you for applying for membership with ${ASSOCIATION_NAME}.</p><p>Your membership application has been received and is currently <strong>pending administrator approval</strong>.</p><p>You will receive another email after your application has been reviewed.</p><p>Regards,<br>${ASSOCIATION_NAME}</p>`)
  });
}

async function sendNewRegistrationAdminEmail(member) {
  const reviewUrl = absoluteUrl("/admin/members/pending");
  const adminEmail = getAppConfig().admin.email || OFFICIAL_EMAIL;
  const date = member.created_at ? new Date(member.created_at) : new Date();
  const fields = [
    ["Full Name", member.full_name], ["Email", member.email], ["Mobile", member.phone],
    ["Profession", member.profession], ["City", member.city], ["Registration Date", date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]
  ];
  return sendEmail({
    to: adminEmail,
    subject: `New Membership Request – ${member.full_name}`,
    text: `${fields.map(([key, value]) => `${key}: ${value || "Not provided"}`).join("\n")}\n\nReview Pending Members: ${reviewUrl}`,
    html: emailLayout(`<p>A new public membership request has been received.</p><table style="width:100%;border-collapse:collapse">${fields.map(([key, value]) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:700">${escapeHtml(key)}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(value || "Not provided")}</td></tr>`).join("")}</table>${button("Review Pending Members", reviewUrl)}`)
  });
}

async function sendMembershipApprovedEmail(member) {
  const loginUrl = absoluteUrl("/auth/login");
  const name = member.full_name || "Member";
  return sendEmail({
    to: member.email,
    subject: "Membership Approved – PEA Jabalpur",
    text: `Dear ${name},\n\nYour membership application has been approved.\n\nMembership ID: ${member.member_id}\n\nYou can now sign in to your member account.\n\nSign In: ${loginUrl}\n\nRegards,\n${ASSOCIATION_NAME}`,
    html: emailLayout(`<p>Dear ${escapeHtml(name)},</p><p>Your membership application has been approved.</p><p><strong>Membership ID:</strong><br>${escapeHtml(member.member_id)}</p><p>You can now sign in to your member account.</p>${button("Sign In", loginUrl)}<p>Regards,<br>${ASSOCIATION_NAME}</p>`)
  });
}

async function sendMembershipRejectedEmail(member) {
  const name = member.full_name || "Applicant";
  return sendEmail({
    to: member.email,
    subject: "Membership Application Update – PEA Jabalpur",
    text: `Dear ${name},\n\nYour membership application has been reviewed.\n\nAt this time, the application has not been approved.\n\nFor further information, please contact: ${OFFICIAL_EMAIL}\n\nRegards,\n${ASSOCIATION_NAME}`,
    html: emailLayout(`<p>Dear ${escapeHtml(name)},</p><p>Your membership application has been reviewed.</p><p>At this time, the application has not been approved.</p><p>For further information, please contact: <a href="mailto:${OFFICIAL_EMAIL}">${OFFICIAL_EMAIL}</a></p><p>Regards,<br>${ASSOCIATION_NAME}</p>`)
  });
}

async function sendPasswordResetEmail(user, resetUrl) {
  const name = user.display_name || user.full_name || "Member";
  return sendEmail({
    to: user.email,
    subject: "Reset your PEA Jabalpur password",
    text: `Hello ${name},\n\nUse this link within 30 minutes to reset your password: ${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html: emailLayout(`<p>Hello ${escapeHtml(name)},</p><p>Use the link below within 30 minutes to reset your password.</p>${button("Reset Password", resetUrl)}<p>If you did not request this, you can ignore this email.</p>`)
  });
}

async function sendPasswordChangedEmail(user) {
  const name = user.display_name || user.full_name || "Member";
  return sendEmail({
    to: user.email,
    subject: "Your PEA Jabalpur password was changed",
    text: `Hello ${name},\n\nYour PEA Jabalpur account password was successfully changed.\n\nIf you made this change, no action is required.\n\nIf you did not make this change, please contact: ${OFFICIAL_EMAIL}`,
    html: emailLayout(`<p>Hello ${escapeHtml(name)},</p><p>Your PEA Jabalpur account password was successfully changed.</p><p>If you made this change, no action is required.</p><p>If you did not make this change, please contact: <a href="mailto:${OFFICIAL_EMAIL}">${OFFICIAL_EMAIL}</a></p>`)
  });
}

async function sendLoginOtpEmail(user, code) {
  const { auth } = getAppConfig();
  const name = user.display_name || "Member";
  return sendEmail({
    to: user.email,
    subject: "Your PEA Jabalpur login code",
    text: `Hello ${name},\n\nYour one-time login code is: ${code}\nThis code will expire in ${auth.otpExpiresMinutes} minutes.\n\nIf you did not request this login, you can ignore this email.`,
    html: emailLayout(`<p>Hello ${escapeHtml(name)},</p><p>Your one-time login code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${escapeHtml(code)}</p><p>This code will expire in ${auth.otpExpiresMinutes} minutes.</p><p>If you did not request this login, you can ignore this email.</p>`)
  });
}

module.exports = {
  sendLoginOtpEmail,
  sendMembershipApprovedEmail,
  sendMembershipRejectedEmail,
  sendNewRegistrationAdminEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendRegistrationReceivedEmail
};
