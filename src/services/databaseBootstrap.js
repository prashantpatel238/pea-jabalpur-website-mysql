const { getConnection } = require("../db/mysql");
const { buildDefaultSiteSettingsInsert, createTableStatements } = require("../db/schema");

async function createTablesIfNotExist(connection) {
  for (const statement of createTableStatements) {
    await connection.query(statement);
  }
}

async function ensureDefaultSiteSettingsRow(connection) {
  const insertStatement = buildDefaultSiteSettingsInsert();
  await connection.execute(insertStatement.sql, insertStatement.values);
}

async function bootstrapDatabase() {
  const connection = await getConnection();

  try {
    await createTablesIfNotExist(connection);
    await ensureDefaultSiteSettingsRow(connection);
  } finally {
    connection.release();
  }
}

module.exports = {
  bootstrapDatabase,
  createTablesIfNotExist,
  ensureDefaultSiteSettingsRow
};
