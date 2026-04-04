const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");

async function ensureInitialAdmin() {
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    return;
  }

  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const displayName = (process.env.ADMIN_NAME || "Administrator").trim();

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to create the first admin.");
  }

  const password_hash = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    password_hash,
    display_name: displayName
  });
}

module.exports = {
  ensureInitialAdmin
};
