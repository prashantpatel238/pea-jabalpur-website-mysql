const { getConnection, query } = require("../db/mysql");

function getAccountTable(accountType) {
  if (accountType === "admin") return { table: "admins", nameColumn: "display_name" };
  if (accountType === "member") return { table: "members", nameColumn: "full_name" };
  throw new Error("Unsupported password reset account type.");
}

async function createResetToken({ accountType, accountId, tokenHash, expiresAt }) {
  getAccountTable(accountType);
  await query(
    "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE account_type = ? AND account_id = ? AND used_at IS NULL",
    [accountType, accountId]
  );
  return query(
    "INSERT INTO password_reset_tokens (account_type, account_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
    [accountType, accountId, tokenHash, expiresAt]
  );
}

async function findValidResetToken(tokenHash) {
  const rows = await query(
    "SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1",
    [tokenHash]
  );
  return rows[0] || null;
}

async function findResetAccount(record) {
  const { table, nameColumn } = getAccountTable(record.account_type);
  const rows = await query(
    `SELECT id, email, ${nameColumn} AS display_name FROM ${table} WHERE id = ? LIMIT 1`,
    [record.account_id]
  );
  return rows[0] || null;
}

async function consumeResetToken(record, passwordHash) {
  const { table } = getAccountTable(record.account_type);
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP",
      [record.id]
    );
    if (!result.affectedRows) throw new Error("Reset token is no longer valid.");
    await connection.execute(`UPDATE ${table} SET password_hash = ? WHERE id = ?`, [passwordHash, record.account_id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  consumeResetToken,
  createResetToken,
  findResetAccount,
  findValidResetToken
};
