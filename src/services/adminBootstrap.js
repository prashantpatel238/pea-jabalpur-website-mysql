const bcrypt = require("bcryptjs");

const { getAppConfig } = require("../config/env");
const { countAdmins, createAdmin } = require("../repositories/adminRepository");

async function ensureInitialAdmin() {
  const adminCount = await countAdmins();

  if (adminCount > 0) {
    return;
  }

  const { admin } = getAppConfig();
  const email = (admin.email || "").trim().toLowerCase();
  const password = admin.password || "";
  const displayName = (admin.name || "Administrator").trim();

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to create the first admin.");
  }

  const password_hash = await bcrypt.hash(password, 12);

  await createAdmin({
    email,
    password_hash,
    display_name: displayName
  });
}

module.exports = {
  ensureInitialAdmin
};
