const { getConnection, query } = require("../db/mysql");

const NOTICE_LIMIT = 10;
const NOTICE_TYPES = new Set(["notice", "event"]);
const NOTICE_SELECT = `
  SELECT id, title, content, type, event_date, publish_date, expiry_date,
         image_path, is_published, sort_order, created_by_admin, created_at, updated_at
  FROM notices
`;

class NoticeLimitError extends Error {
  constructor(type) {
    super(type === "event"
      ? "Event limit reached. A maximum of 10 events is allowed. Please delete an old event before adding a new one."
      : "Notice limit reached. A maximum of 10 notices is allowed. Please delete an old notice before adding a new one.");
    this.name = "NoticeLimitError";
    this.type = type;
  }
}

function normalizeType(type) {
  return NOTICE_TYPES.has(type) ? type : "notice";
}

async function listNotices() {
  return query(`${NOTICE_SELECT} ORDER BY created_at DESC`);
}

async function countNoticesByType(type) {
  const rows = await query("SELECT COUNT(*) AS total FROM notices WHERE type = ?", [normalizeType(type)]);
  return Number(rows[0].total);
}

async function listPublishedNotices() {
  return query(`${NOTICE_SELECT} WHERE is_published = 1 ORDER BY event_date DESC, publish_date DESC, sort_order ASC`);
}

async function findNoticeById(id) {
  const rows = await query(`${NOTICE_SELECT} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findRecentMatchingNotice(notice) {
  const rows = await query(
    `${NOTICE_SELECT} WHERE created_by_admin = ? AND title = ? AND content = ? AND type = ?
       AND ((event_date IS NULL AND ? IS NULL) OR event_date = ?)
       AND ((publish_date IS NULL AND ? IS NULL) OR publish_date = ?)
       AND ((expiry_date IS NULL AND ? IS NULL) OR expiry_date = ?)
       AND is_published = ? AND sort_order = ?
       AND created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 MINUTE)
     ORDER BY id DESC LIMIT 1`,
    [notice.created_by_admin || "", notice.title, notice.content || "", normalizeType(notice.type),
      notice.event_date || null, notice.event_date || null, notice.publish_date || null, notice.publish_date || null,
      notice.expiry_date || null, notice.expiry_date || null, notice.is_published ? 1 : 0, Number(notice.sort_order || 0)]
  );
  return rows[0] || null;
}

async function createNotice(notice) {
  const type = normalizeType(notice.type);
  const connection = await getConnection();
  const lockName = `pea-notices-limit-${type}`;
  let lockAcquired = false;
  try {
    const [lockRows] = await connection.execute("SELECT GET_LOCK(?, 10) AS acquired", [lockName]);
    lockAcquired = Number(lockRows[0].acquired) === 1;
    if (!lockAcquired) throw new Error("Could not reserve a notice/event creation slot. Please try again.");

    const [countRows] = await connection.execute("SELECT COUNT(*) AS total FROM notices WHERE type = ?", [type]);
    if (Number(countRows[0].total) >= NOTICE_LIMIT) throw new NoticeLimitError(type);

    const [result] = await connection.execute(
      `INSERT INTO notices (title, content, type, event_date, publish_date, expiry_date, image_path,
        is_published, sort_order, created_by_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [notice.title, notice.content || "", type, notice.event_date || null, notice.publish_date || new Date(),
        notice.expiry_date || null, type === "event" ? notice.image_path || null : null,
        notice.is_published ? 1 : 0, Number(notice.sort_order || 0), notice.created_by_admin || ""]
    );
    return findNoticeById(result.insertId);
  } finally {
    if (lockAcquired) await connection.execute("SELECT RELEASE_LOCK(?)", [lockName]);
    connection.release();
  }
}

async function updateNoticeById(id, notice) {
  const type = normalizeType(notice.type);
  const existing = await findNoticeById(id);
  const connection = await getConnection();
  const lockName = `pea-notices-limit-${type}`;
  let lockAcquired = false;
  try {
    if (existing && existing.type !== type) {
      const [lockRows] = await connection.execute("SELECT GET_LOCK(?, 10) AS acquired", [lockName]);
      lockAcquired = Number(lockRows[0].acquired) === 1;
      if (!lockAcquired) throw new Error("Could not reserve a notice/event slot. Please try again.");
      const [countRows] = await connection.execute("SELECT COUNT(*) AS total FROM notices WHERE type = ?", [type]);
      if (Number(countRows[0].total) >= NOTICE_LIMIT) throw new NoticeLimitError(type);
    }
    await connection.execute(
    `UPDATE notices SET title = ?, content = ?, type = ?, event_date = ?, publish_date = ?, expiry_date = ?,
       image_path = ?, is_published = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [notice.title, notice.content || "", type, notice.event_date || null,
      notice.publish_date || new Date(), notice.expiry_date || null, notice.image_path || null,
      notice.is_published ? 1 : 0, Number(notice.sort_order || 0), id]
    );
  } finally {
    if (lockAcquired) await connection.execute("SELECT RELEASE_LOCK(?)", [lockName]);
    connection.release();
  }
  return findNoticeById(id);
}

async function deleteNoticeById(id) {
  const notice = await findNoticeById(id);
  if (notice) await query("DELETE FROM notices WHERE id = ?", [id]);
  return notice;
}

module.exports = { NOTICE_LIMIT, NoticeLimitError, countNoticesByType, createNotice, deleteNoticeById,
  findNoticeById, findRecentMatchingNotice, listNotices, listPublishedNotices, normalizeType, updateNoticeById };
