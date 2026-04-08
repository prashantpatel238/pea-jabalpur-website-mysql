const nodemailer = require("nodemailer");

const { getAppConfig } = require("../config/env");

let transporter = null;

function hasSmtpConfig() {
  const { smtp } = getAppConfig();
  return Boolean(smtp.host && smtp.user && smtp.password && smtp.fromEmail);
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { smtp } = getAppConfig();

  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.password
    }
  });

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const { smtp, isProduction } = getAppConfig();

  if (!hasSmtpConfig()) {
    if (isProduction) {
      throw new Error("OTP email delivery is not configured. Please set SMTP environment variables.");
    }

    console.log("[DEV EMAIL FALLBACK]");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    return;
  }

  await getTransporter().sendMail({
    from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
    to,
    subject,
    text,
    html
  });
}

module.exports = {
  hasSmtpConfig,
  sendEmail
};
