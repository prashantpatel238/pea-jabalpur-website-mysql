const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { getStoredFilePath, getUploadStorageConfig } = require("../config/uploads");

const area = getUploadStorageConfig().events;
const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: area.directory,
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${crypto.randomUUID()}${allowedTypes.get(file.mimetype)}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const expected = allowedTypes.get(file.mimetype);
    const extensionMatches = extension === expected || (expected === ".jpg" && extension === ".jpeg");
    const accepted = Boolean(expected && extensionMatches);
    callback(accepted ? null : new Error("Only matching JPEG, JPG, PNG, and WebP image files are allowed."), accepted);
  }
});

function uploadEventPhoto(req, res, next) {
  upload.single("event_photo")(req, res, (error) => {
    if (error) {
      req.eventPhotoUploadError = error.code === "LIMIT_FILE_SIZE"
        ? "Event photo must be 5 MB or smaller."
        : error.message;
    }
    next();
  });
}

function getEventPhotoPath(file) {
  return file ? `${area.publicPath}/${file.filename}` : null;
}

function removeEventPhoto(filePath) {
  const diskPath = getStoredFilePath(filePath, area);
  if (diskPath && fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
}

module.exports = { getEventPhotoPath, removeEventPhoto, uploadEventPhoto };
