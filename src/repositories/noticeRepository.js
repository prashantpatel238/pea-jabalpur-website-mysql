const { query } = require("../db/mysql");

const NOTICE_SELECT = `
  SELECT id, title, content, type, event_date, publish_date, expiry_date,
         is_published, sort_order, created_by_admin, created_at, updated_at
  FROM notices
`;

async function listNotices() {
  return query(
    `${NOTICE_SELECT}
     ORDER BY created_at DESC`
  );
}

async function listPublishedNotices() {
  return query(
    `${NOTICE_SELECT}
     WHERE is_published = 1
     ORDER BY event_date DESC, publish_date DESC, sort_order ASC`
  );
}

async function findNoticeById(id) {
  const rows = await query(
    `${NOTICE_SELECT}
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function findRecentMatchingNotice(notice) {
  const rows = await query(
    `${NOTICE_SELECT}
     WHERE created_by_admin = ?
       AND title = ?
       AND content = ?
       AND type = ?
       AND ((event_date IS NULL AND ? IS NULL) OR event_date = ?)
       AND ((publish_date IS NULL AND ? IS NULL) OR publish_date = ?)
       AND ((expiry_date IS NULL AND ? IS NULL) OR expiry_date = ?)
       AND is_published = ?
       AND sort_order = ?
       AND created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 MINUTE)
     ORDER BY id DESC
     LIMIT 1`,
    [
      notice.created_by_admin || "",
      notice.title,
      notice.content || "",
      notice.type || "notice",
      notice.event_date || null,
      notice.event_date || null,
      notice.publish_date || null,
      notice.publish_date || null,
      notice.expiry_date || null,
      notice.expiry_date || null,
      notice.is_published ? 1 : 0,
      Number(notice.sort_order || 0)
    ]
  );

  return rows[0] || null;
}

async function createNotice(notice) {
  const result = await query(
    `INSERT INTO notices (
      title, content, type, event_date, publish_date, expiry_date,
      is_published, sort_order, created_by_admin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      notice.title,
      notice.content || "",
      notice.type || "notice",
      notice.event_date || null,
      notice.publish_date || new Date(),
      notice.expiry_date || null,
      notice.is_published ? 1 : 0,
      Number(notice.sort_order || 0),
      notice.created_by_admin || ""
    ]
  );

  return findNoticeById(result.insertId);
}

async function updateNoticeById(id, notice) {
  await query(
    `UPDATE notices
     SET title = ?,
         content = ?,
         type = ?,
         event_date = ?,
         publish_date = ?,
         expiry_date = ?,
         is_published = ?,
         sort_order = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      notice.title,
      notice.content || "",
      notice.type || "notice",
      notice.event_date || null,
      notice.publish_date || new Date(),
      notice.expiry_date || null,
      notice.is_published ? 1 : 0,
      Number(notice.sort_order || 0),
      id
    ]
  );

  return findNoticeById(id);
}

async function deleteNoticeById(id) {
  await query("DELETE FROM notices WHERE id = ?", [id]);
}

module.exports = {
  createNotice,
  deleteNoticeById,
  findNoticeById,
  findRecentMatchingNotice,
  listNotices,
  listPublishedNotices,
  updateNoticeById
};
