const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "..", "public", "uploads", "site");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".ico"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "application/octet-stream"
]);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeExtension = allowedExtensions.has(extension) ? extension : ".png";
    cb(null, `${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const isIcoUpload = extension === ".ico";
    const hasAllowedMimeType = allowedMimeTypes.has(file.mimetype);

    if (!allowedExtensions.has(extension) || (!hasAllowedMimeType || (file.mimetype === "application/octet-stream" && !isIcoUpload))) {
      return cb(new Error("Only JPG, PNG, WEBP, and ICO files are allowed."));
    }

    return cb(null, true);
  }
});

function uploadSiteAssets(req, res, next) {
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
  ])(req, res, (error) => {
    if (error) {
      req.siteAssetUploadError = error.message === "File too large"
        ? "Site logo and favicon files must be 2 MB or smaller."
        : error.message;
    }

    next();
  });
}

function getUploadedSiteAssetPath(files, fieldName) {
  const file = files?.[fieldName]?.[0];

  if (!file) {
    return "";
  }

  return `/uploads/site/${file.filename}`;
}

function removeUploadedSiteAsset(assetPath) {
  if (!assetPath || !assetPath.startsWith("/uploads/site/")) {
    return;
  }

  const resolvedPath = path.resolve(path.join(__dirname, "..", "..", "public", assetPath.replace(/^\//, "")));

  if (!resolvedPath.startsWith(path.resolve(uploadDirectory))) {
    return;
  }

  if (fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath);
  }
}

module.exports = {
  getUploadedSiteAssetPath,
  removeUploadedSiteAsset,
  uploadSiteAssets
};
