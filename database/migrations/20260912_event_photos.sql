ALTER TABLE `notices`
  ADD COLUMN `image_path` VARCHAR(500) NULL DEFAULT NULL AFTER `expiry_date`;
