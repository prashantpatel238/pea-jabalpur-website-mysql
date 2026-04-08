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

async function addColumnIfMissing(connection, tableName, columnName, definition) {
  const [rows] = await connection.execute(
    `SELECT 1
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = ?
       AND column_name = ?
     LIMIT 1`,
    [tableName, columnName]
  );

  if (rows.length) {
    return;
  }

  await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
}

async function addCheckConstraintIfMissing(connection, tableName, constraintName, definition) {
  const [rows] = await connection.execute(
    `SELECT 1
     FROM information_schema.table_constraints
     WHERE constraint_schema = DATABASE()
       AND table_name = ?
       AND constraint_name = ?
     LIMIT 1`,
    [tableName, constraintName]
  );

  if (rows.length) {
    return;
  }

  await connection.query(
    `ALTER TABLE \`${tableName}\`
     ADD CONSTRAINT \`${constraintName}\` CHECK (${definition})`
  );
}

async function ensureMemberColumns(connection) {
  await addColumnIfMissing(
    connection,
    "members",
    "blood_group",
    "ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Prefer not to say', '') NOT NULL DEFAULT '' AFTER `gender`"
  );

  await addColumnIfMissing(
    connection,
    "members",
    "children_count",
    "INT UNSIGNED NULL DEFAULT NULL AFTER `spouse_name`"
  );

  await addCheckConstraintIfMissing(
    connection,
    "members",
    "chk_members_children_count",
    "`children_count` IS NULL OR `children_count` >= 0"
  );
}

async function bootstrapDatabase() {
  const connection = await getConnection();

  try {
    await createTablesIfNotExist(connection);
    await ensureMemberColumns(connection);
    await ensureDefaultSiteSettingsRow(connection);
  } finally {
    connection.release();
  }
}

module.exports = {
  addColumnIfMissing,
  addCheckConstraintIfMissing,
  bootstrapDatabase,
  createTablesIfNotExist,
  ensureMemberColumns,
  ensureDefaultSiteSettingsRow
};
