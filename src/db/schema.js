const { getDefaultSiteSettingsValues } = require("../services/siteSettingsService");

const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS admins (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(150) NOT NULL DEFAULT 'Administrator',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admins_email (email),
    KEY idx_admins_is_active (is_active)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS members (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    photo VARCHAR(255) NOT NULL DEFAULT '',
    member_id VARCHAR(50) NULL DEFAULT NULL,
    profession VARCHAR(150) NOT NULL DEFAULT '',
    role ENUM(
      'President',
      'Vice President',
      'Secretary',
      'Joint Secretary',
      'Treasurer',
      'Media Prabhari',
      'Core Committee Member',
      'General Member'
    ) NOT NULL DEFAULT 'General Member',
    city VARCHAR(120) NOT NULL DEFAULT '',
    join_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    age TINYINT UNSIGNED NULL DEFAULT NULL,
    leadership_title VARCHAR(150) NOT NULL DEFAULT '',
    dob DATE NULL DEFAULT NULL,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say', '') NOT NULL DEFAULT '',
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Prefer not to say', '') NOT NULL DEFAULT '',
    marital_status ENUM('single', 'married', 'divorced', 'widowed', 'prefer_not_to_say', '') NOT NULL DEFAULT '',
    marriage_date DATE NULL DEFAULT NULL,
    spouse_name VARCHAR(150) NOT NULL DEFAULT '',
    children_count INT UNSIGNED NULL DEFAULT NULL,
    phone VARCHAR(20) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT NULL,
    notes TEXT NULL,
    admin_notes TEXT NULL,
    membership_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    approval_date DATETIME NULL DEFAULT NULL,
    approved_by_admin TINYINT(1) NOT NULL DEFAULT 0,
    show_in_directory TINYINT(1) NOT NULL DEFAULT 0,
    show_mobile_in_directory TINYINT(1) NOT NULL DEFAULT 0,
    show_email_in_directory TINYINT(1) NOT NULL DEFAULT 0,
    show_city_in_directory TINYINT(1) NOT NULL DEFAULT 1,
    show_profession_in_directory TINYINT(1) NOT NULL DEFAULT 1,
    show_photo_in_directory TINYINT(1) NOT NULL DEFAULT 1,
    show_in_leadership_section TINYINT(1) NOT NULL DEFAULT 0,
    is_important_member TINYINT(1) NOT NULL DEFAULT 0,
    important_member_order INT UNSIGNED NOT NULL DEFAULT 0,
    registration_source VARCHAR(50) NOT NULL DEFAULT 'public_form',
    last_login_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_members_email (email),
    UNIQUE KEY uq_members_member_id (member_id),
    KEY idx_members_role (role),
    KEY idx_members_status (membership_status),
    KEY idx_members_directory (membership_status, show_in_directory, full_name),
    KEY idx_members_leadership (membership_status, show_in_leadership_section, important_member_order),
    KEY idx_members_role_status_order (role, membership_status, important_member_order),
    KEY idx_members_city (city),
    KEY idx_members_profession (profession),
    KEY idx_members_join_date (join_date),
    CONSTRAINT chk_members_age CHECK (age IS NULL OR (age >= 0 AND age <= 130)),
    CONSTRAINT chk_members_children_count CHECK (children_count IS NULL OR children_count >= 0),
    CONSTRAINT chk_members_important_member_order CHECK (important_member_order >= 0),
    CONSTRAINT chk_members_approval_workflow CHECK (
      (
        membership_status = 'approved'
        AND member_id IS NOT NULL
        AND approval_date IS NOT NULL
        AND approved_by_admin = 1
      )
      OR
      (
        membership_status IN ('pending', 'rejected')
        AND member_id IS NULL
        AND approval_date IS NULL
        AND approved_by_admin = 0
      )
    )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    _singleton VARCHAR(50) NOT NULL DEFAULT 'default',
    site_title VARCHAR(255) NOT NULL DEFAULT '',
    site_tagline VARCHAR(255) NOT NULL DEFAULT '',
    logo_path VARCHAR(255) NOT NULL DEFAULT '',
    favicon_path VARCHAR(255) NOT NULL DEFAULT '',
    contact_phone VARCHAR(20) NOT NULL DEFAULT '',
    whatsapp_number VARCHAR(20) NOT NULL DEFAULT '',
    contact_email VARCHAR(255) NOT NULL DEFAULT '',
    address TEXT NULL,
    google_map_embed_url TEXT NULL,
    facebook_url VARCHAR(500) NOT NULL DEFAULT '',
    instagram_url VARCHAR(500) NOT NULL DEFAULT '',
    youtube_url VARCHAR(500) NOT NULL DEFAULT '',
    footer_text TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_site_settings_singleton (_singleton)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS notices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content MEDIUMTEXT NULL,
    type ENUM('notice', 'event') NOT NULL DEFAULT 'notice',
    event_date DATETIME NULL DEFAULT NULL,
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NULL DEFAULT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_by_admin VARCHAR(255) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_notices_type (type),
    KEY idx_notices_event_date (event_date),
    KEY idx_notices_publish_date (publish_date),
    KEY idx_notices_expiry_date (expiry_date),
    KEY idx_notices_is_published (is_published),
    KEY idx_notices_public_feed (is_published, publish_date, sort_order),
    CONSTRAINT chk_notices_sort_order CHECK (sort_order >= 0)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS import_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'manual',
    entity_name VARCHAR(50) NOT NULL DEFAULT 'members',
    status ENUM('started', 'completed', 'failed', 'partial') NOT NULL DEFAULT 'started',
    total_rows INT UNSIGNED NOT NULL DEFAULT 0,
    successful_rows INT UNSIGNED NOT NULL DEFAULT 0,
    failed_rows INT UNSIGNED NOT NULL DEFAULT 0,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL DEFAULT NULL,
    created_by_admin_email VARCHAR(255) NOT NULL DEFAULT '',
    error_summary TEXT NULL,
    metadata_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_import_logs_status (status),
    KEY idx_import_logs_entity_name (entity_name),
    KEY idx_import_logs_started_at (started_at),
    KEY idx_import_logs_created_by_admin_email (created_by_admin_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

function buildDefaultSiteSettingsInsert() {
  const values = getDefaultSiteSettingsValues();

  return {
    sql: `INSERT INTO site_settings (
      _singleton,
      site_title,
      site_tagline,
      logo_path,
      favicon_path,
      contact_phone,
      whatsapp_number,
      contact_email,
      address,
      google_map_embed_url,
      facebook_url,
      instagram_url,
      youtube_url,
      footer_text
    )
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
      SELECT 1
      FROM site_settings
      WHERE _singleton = ?
      LIMIT 1
    )`,
    values: [
      "default",
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
      "default"
    ]
  };
}

module.exports = {
  buildDefaultSiteSettingsInsert,
  createTableStatements
};
