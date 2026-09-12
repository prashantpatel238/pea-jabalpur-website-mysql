const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildOtpSessionRecord,
  generateOtpCode,
  MAX_OTP_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  verifyOtpCode
} = require("../src/services/authOtpService");

test("OTP records contain only a hash and enforce configured security limits", () => {
  const code = generateOtpCode();
  const record = buildOtpSessionRecord({
    id: 7,
    email: "member@example.com",
    role: "member",
    display_name: "Test Member"
  }, code);

  assert.match(code, /^\d{6}$/);
  assert.equal(record.code, undefined);
  assert.notEqual(record.codeHash, code);
  assert.equal(record.attempts, 0);
  assert.equal(verifyOtpCode(record, code).ok, true);
  assert.equal(verifyOtpCode(record, "000000").reason, "invalid");
  assert.equal(verifyOtpCode({ ...record, expiresAt: new Date(Date.now() - 1).toISOString() }, code).reason, "expired");
  assert.equal(MAX_OTP_ATTEMPTS, 5);
  assert.equal(OTP_RESEND_COOLDOWN_MS, 60_000);
});

test("transactional templates use safe recipients, URLs, subjects, and omit secrets", async () => {
  const emailServicePath = require.resolve("../src/services/emailService");
  const notificationPath = require.resolve("../src/services/notificationEmailService");
  const originalEmailModule = require.cache[emailServicePath];
  const originalSiteUrl = process.env.SITE_URL;
  const originalAdminEmail = process.env.ADMIN_EMAIL;
  const sent = [];

  require.cache[emailServicePath] = {
    id: emailServicePath,
    filename: emailServicePath,
    loaded: true,
    exports: { sendEmail: async (message) => sent.push(message) }
  };
  delete require.cache[notificationPath];
  process.env.SITE_URL = "https://professionalpeajbp.in/";
  process.env.ADMIN_EMAIL = "admin@professionalpeajbp.in";

  try {
    const notifications = require(notificationPath);
    const member = {
      id: 10,
      full_name: "A & B <Engineers>",
      email: "member@example.com",
      phone: "9999999999",
      profession: "Civil Engineer",
      city: "Jabalpur",
      member_id: "PEA-001",
      created_at: "2026-09-12T10:00:00Z"
    };
    await notifications.sendRegistrationReceivedEmail(member);
    await notifications.sendNewRegistrationAdminEmail(member);
    await notifications.sendMembershipApprovedEmail(member);
    await notifications.sendMembershipRejectedEmail(member);
    await notifications.sendPasswordResetEmail(member, "https://professionalpeajbp.in/reset-password/safe-token");
    await notifications.sendPasswordChangedEmail(member);

    assert.deepEqual(sent.map((message) => message.subject), [
      "Membership Application Received – PEA Jabalpur",
      "New Membership Request – A & B <Engineers>",
      "Membership Approved – PEA Jabalpur",
      "Membership Application Update – PEA Jabalpur",
      "Reset your PEA Jabalpur password",
      "Your PEA Jabalpur password was changed"
    ]);
    assert.equal(sent[1].to, "admin@professionalpeajbp.in");
    assert.match(sent[1].text, /https:\/\/professionalpeajbp\.in\/admin\/members\/pending/);
    assert.match(sent[2].text, /https:\/\/professionalpeajbp\.in\/auth\/login/);
    assert.match(sent[0].html, /A &amp; B &lt;Engineers&gt;/);
    assert.doesNotMatch(sent[5].text, /safe-token|password_hash|new password:/i);
  } finally {
    delete require.cache[notificationPath];
    if (originalEmailModule) require.cache[emailServicePath] = originalEmailModule;
    else delete require.cache[emailServicePath];
    if (originalSiteUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = originalSiteUrl;
    if (originalAdminEmail === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = originalAdminEmail;
  }
});
