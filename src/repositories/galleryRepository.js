const { getConnection, query } = require("../db/mysql");

async function listGalleryImages({ activeOnly = false } = {}) {
  return query(`SELECT id, title, caption, image_path, event_date, display_order, is_active, created_at, updated_at
    FROM gallery_images ${activeOnly ? "WHERE is_active = 1" : ""}
    ORDER BY display_order ASC, event_date DESC, id DESC`);
}
async function findGalleryImageById(id) { return (await query("SELECT * FROM gallery_images WHERE id = ? LIMIT 1", [id]))[0] || null; }
async function countGalleryImages() {
  const rows = await query("SELECT COUNT(*) AS total FROM gallery_images");
  return Number(rows[0].total);
}
async function createGalleryImage(item, maximumItems) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("SELECT id FROM gallery_images FOR UPDATE");
    const [[count]] = await connection.query("SELECT COUNT(*) AS total FROM gallery_images");
    if (Number(count.total) >= maximumItems) {
      await connection.rollback();
      return { affectedRows: 0 };
    }
    const [result] = await connection.execute(`INSERT INTO gallery_images (title, caption, image_path, event_date, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)`, [item.title, item.caption, item.image_path, item.event_date, item.display_order, item.is_active]);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
async function updateGalleryImage(id, item) {
  return query(`UPDATE gallery_images SET title=?, caption=?, image_path=?, event_date=?, display_order=?, is_active=? WHERE id=?`,
    [item.title, item.caption, item.image_path, item.event_date, item.display_order, item.is_active, id]);
}
async function deleteGalleryImage(id) { return query("DELETE FROM gallery_images WHERE id = ?", [id]); }
module.exports = { listGalleryImages, findGalleryImageById, countGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage };
