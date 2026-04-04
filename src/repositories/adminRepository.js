const { query } = require("../db/mysql");

async function countAdmins() {
  const rows = await query("SELECT COUNT(*) AS count FROM admins");
  return Number(rows[0]?.count || 0);
}

async function findActiveAdminByEmail(email) {
  const rows = await query(
    `SELECT id, email, password_hash, display_name, is_active, last_login_at, created_at, updated_at
     FROM admins
     WHERE email = ? AND is_active = 1
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

async function createAdmin({ email, password_hash, display_name }) {
  const result = await query(
    `INSERT INTO admins (email, password_hash, display_name)
     VALUES (?, ?, ?)`,
    [email, password_hash, display_name]
  );

  return {
    id: String(result.insertId),
    email,
    password_hash,
    display_name,
    is_active: 1
  };
}

async function updateAdminLastLoginAt(id, lastLoginAt = new Date()) {
  await query(
    `UPDATE admins
     SET last_login_at = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [lastLoginAt, id]
  );
}

module.exports = {
  countAdmins,
  createAdmin,
  findActiveAdminByEmail,
  updateAdminLastLoginAt
};
