const { query } = require("../db/mysql");

async function findDefaultSiteSettingsRow() {
  const rows = await query(
    `SELECT id, _singleton, site_title, site_tagline, logo_path, favicon_path,
            contact_phone, whatsapp_number, contact_email, address, google_map_embed_url,
            facebook_url, instagram_url, youtube_url, footer_text, created_at, updated_at
     FROM site_settings
     WHERE _singleton = 'default'
     LIMIT 1`
  );

  return rows[0] || null;
}

async function createDefaultSiteSettingsRow(values) {
  const result = await query(
    `INSERT INTO site_settings (
      _singleton, site_title, site_tagline, logo_path, favicon_path,
      contact_phone, whatsapp_number, contact_email, address, google_map_embed_url,
      facebook_url, instagram_url, youtube_url, footer_text
    ) VALUES (
      'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`,
    [
      values.site_title,
      values.site_tagline,
      values.logo_path,
      values.favicon_path,
      values.contact_phone,
      values.whatsapp_number,
      values.contact_email,
      values.address,
      values.google_map_embed_url,
      values.facebook_url,
      values.instagram_url,
      values.youtube_url,
      values.footer_text
    ]
  );

  return {
    id: String(result.insertId),
    _singleton: "default",
    ...values
  };
}

async function updateSiteSettingsRow(id, values) {
  await query(
    `UPDATE site_settings
     SET site_title = ?,
         site_tagline = ?,
         logo_path = ?,
         favicon_path = ?,
         contact_phone = ?,
         whatsapp_number = ?,
         contact_email = ?,
         address = ?,
         google_map_embed_url = ?,
         facebook_url = ?,
         instagram_url = ?,
         youtube_url = ?,
         footer_text = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      values.site_title,
      values.site_tagline,
      values.logo_path,
      values.favicon_path,
      values.contact_phone,
      values.whatsapp_number,
      values.contact_email,
      values.address,
      values.google_map_embed_url,
      values.facebook_url,
      values.instagram_url,
      values.youtube_url,
      values.footer_text,
      id
    ]
  );

  return findDefaultSiteSettingsRow();
}

module.exports = {
  createDefaultSiteSettingsRow,
  findDefaultSiteSettingsRow,
  updateSiteSettingsRow
};
