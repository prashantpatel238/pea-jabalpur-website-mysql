const mysql = require("mysql2/promise");

const { getAppConfig } = require("../config/env");

let pool;

function buildPoolConfig() {
  const { database, isProduction } = getAppConfig();

  return {
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    database: database.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    namedPlaceholders: true,
    timezone: "Z",
    ssl: isProduction ? { rejectUnauthorized: false } : undefined
  };
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(buildPoolConfig());
  }

  return pool;
}

async function query(sql, params) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

async function getConnection() {
  return getPool().getConnection();
}

async function pingDatabase() {
  const connection = await getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

async function closePool() {
  if (!pool) {
    return;
  }

  const activePool = pool;
  pool = null;
  await activePool.end();
}

module.exports = {
  closePool,
  getConnection,
  getPool,
  pingDatabase,
  query
};
