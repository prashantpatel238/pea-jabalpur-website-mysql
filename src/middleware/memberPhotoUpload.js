const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const { getStoredFilePath, getUploadStorageConfig } = require("../config/uploads");

const uploadStorage = getUploadStorageConfig().members;
const uploadDirectory = uploadStorage.directory;
const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const extension = allowedMimeTypes.get(file.mimetype) || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP image uploads are allowed."));
    }

    return cb(null, true);
  }
});

function uploadMemberPhoto(req, res, next) {
  upload.single("photo")(req, res, (error) => {
    if (error) {
      req.photoUploadError = error.message === "File too large"
        ? "Member photo must be 2 MB or smaller."
        : error.message;
    }

    next();
  });
}

function getPhotoPath(file) {
  if (!file) {
    return "";
  }

  return `${uploadStorage.publicPath}/${file.filename}`;
}

function removeUploadedMemberPhoto(photoPath) {
  const resolvedPath = getStoredFilePath(photoPath, uploadStorage);

  if (!resolvedPath) {
    return;
  }

  if (fs.existsSync(resolvedPath) && fs.lstatSync(resolvedPath).isFile()) {
    fs.unlinkSync(resolvedPath);
  }
}

module.exports = {
  uploadMemberPhoto,
  getPhotoPath,
  removeUploadedMemberPhoto
};
