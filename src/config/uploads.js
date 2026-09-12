const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");
const localUploadRoot = path.join(projectRoot, "data", "uploads");

function isPathInside(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function getUploadStorageConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const configuredRoot = String(process.env.UPLOAD_ROOT || "").trim();

  if (isProduction && !configuredRoot) {
    throw new Error("UPLOAD_ROOT is required in production and must point to persistent storage outside the deployed application directory.");
  }

  if (isProduction && !path.isAbsolute(configuredRoot)) {
    throw new Error("UPLOAD_ROOT must be an absolute filesystem path in production.");
  }

  const requestedRoot = path.resolve(configuredRoot || localUploadRoot);

  fs.mkdirSync(requestedRoot, { recursive: true });

  const root = fs.realpathSync(requestedRoot);
  const resolvedProjectRoot = fs.realpathSync(projectRoot);

  if (isProduction && isPathInside(resolvedProjectRoot, root)) {
    throw new Error("UPLOAD_ROOT must be outside the deployed application directory in production.");
  }

  const membersDirectory = path.join(root, "members");
  const siteDirectory = path.join(root, "site");
  const galleryDirectory = path.join(root, "gallery");
  const eventsDirectory = path.join(root, "events");

  fs.mkdirSync(membersDirectory, { recursive: true });
  fs.mkdirSync(siteDirectory, { recursive: true });
  fs.mkdirSync(galleryDirectory, { recursive: true });
  fs.mkdirSync(eventsDirectory, { recursive: true });

  return {
    root,
    members: {
      directory: membersDirectory,
      publicPath: "/uploads/members"
    },
    site: {
      directory: siteDirectory,
      publicPath: "/uploads/site"
    },
    gallery: { directory: galleryDirectory, publicPath: "/uploads/gallery" },
    events: { directory: eventsDirectory, publicPath: "/uploads/events" }
  };
}

function getStoredFilePath(publicFilePath, storageArea) {
  if (typeof publicFilePath !== "string") {
    return null;
  }

  const expectedPrefix = `${storageArea.publicPath}/`;

  if (!publicFilePath.startsWith(expectedPrefix)) {
    return null;
  }

  const filename = publicFilePath.slice(expectedPrefix.length);

  if (!filename || filename !== path.basename(filename) || filename.includes("\0")) {
    return null;
  }

  const candidatePath = path.resolve(storageArea.directory, filename);
  const relativePath = path.relative(storageArea.directory, candidatePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return candidatePath;
}

module.exports = {
  getStoredFilePath,
  getUploadStorageConfig
};
