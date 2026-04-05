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

async function findNoticeById(id) {
  const rows = await query(
    `${NOTICE_SELECT}
     WHERE id = ?
     LIMIT 1`,
    [id]
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
  listNotices,
  updateNoticeById
};
