CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, `account_type` ENUM('member','admin') NOT NULL, `account_id` BIGINT UNSIGNED NOT NULL, `token_hash` CHAR(64) NOT NULL, `expires_at` DATETIME NOT NULL, `used_at` DATETIME NULL, `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_password_reset_token_hash` (`token_hash`), KEY `idx_password_reset_account` (`account_type`,`account_id`), KEY `idx_password_reset_expiry` (`expires_at`,`used_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `gallery_images` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, `title` VARCHAR(200) NOT NULL, `caption` TEXT NULL, `image_path` VARCHAR(500) NOT NULL, `event_date` DATE NULL, `display_order` INT UNSIGNED NOT NULL DEFAULT 0, `is_active` TINYINT(1) NOT NULL DEFAULT 1, `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), KEY `idx_gallery_public` (`is_active`,`display_order`,`event_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
