const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { getStoredFilePath, getUploadStorageConfig } = require("../config/uploads");
const area = getUploadStorageConfig().gallery;
const types = new Map([["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/webp", ".webp"]]);
const upload = multer({
  storage: multer.diskStorage({ destination: area.directory, filename(req, file, cb) { cb(null, `${Date.now()}-${crypto.randomUUID()}${types.get(file.mimetype)}`); } }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedExtension = types.get(file.mimetype);
    const validExtension = expectedExtension === extension || (expectedExtension === ".jpg" && extension === ".jpeg");
    const accepted = Boolean(expectedExtension && validExtension);
    cb(accepted ? null : new Error("Only matching JPG, PNG, and WEBP image files are allowed."), accepted);
  }
});
function uploadGalleryImage(req, res, next) { upload.single("image")(req, res, error => { if (error) req.galleryUploadError = error.code === "LIMIT_FILE_SIZE" ? "Gallery image must be 5 MB or smaller." : error.message; next(); }); }
function getGalleryPath(file) { return file ? `${area.publicPath}/${file.filename}` : ""; }
function removeGalleryImage(filePath) { const diskPath = getStoredFilePath(filePath, area); if (diskPath && fs.existsSync(diskPath)) fs.unlinkSync(diskPath); }
module.exports = { uploadGalleryImage, getGalleryPath, removeGalleryImage };
