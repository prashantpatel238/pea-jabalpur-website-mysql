const { query } = require("../db/mysql");

async function listGalleryImages({ activeOnly = false } = {}) {
  return query(`SELECT id, title, caption, image_path, event_date, display_order, is_active, created_at, updated_at
    FROM gallery_images ${activeOnly ? "WHERE is_active = 1" : ""}
    ORDER BY display_order ASC, event_date DESC, id DESC`);
}
async function findGalleryImageById(id) { return (await query("SELECT * FROM gallery_images WHERE id = ? LIMIT 1", [id]))[0] || null; }
async function createGalleryImage(item) {
  return query(`INSERT INTO gallery_images (title, caption, image_path, event_date, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)`, [item.title, item.caption, item.image_path, item.event_date, item.display_order, item.is_active]);
}
async function updateGalleryImage(id, item) {
  return query(`UPDATE gallery_images SET title=?, caption=?, image_path=?, event_date=?, display_order=?, is_active=? WHERE id=?`,
    [item.title, item.caption, item.image_path, item.event_date, item.display_order, item.is_active, id]);
}
async function deleteGalleryImage(id) { return query("DELETE FROM gallery_images WHERE id = ?", [id]); }
module.exports = { listGalleryImages, findGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage };
