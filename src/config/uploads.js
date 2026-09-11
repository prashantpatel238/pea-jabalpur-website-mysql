const fs = require("fs");
const os = require("os");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");
const localUploadRoot = path.join(projectRoot, "data", "uploads");
let hasWarnedAboutProductionFallback = false;

function isPathInside(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function getUploadStorageConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const configuredRoot = String(process.env.UPLOAD_ROOT || "").trim();
  const productionFallbackRoot = path.join(os.homedir(), ".pea-jabalpur", "uploads");

  if (isProduction && configuredRoot && !path.isAbsolute(configuredRoot)) {
    throw new Error("UPLOAD_ROOT must be an absolute filesystem path in production.");
  }

  const requestedRoot = path.resolve(
    configuredRoot || (isProduction ? productionFallbackRoot : localUploadRoot)
  );

  fs.mkdirSync(requestedRoot, { recursive: true });

  const root = fs.realpathSync(requestedRoot);
  const resolvedProjectRoot = fs.realpathSync(projectRoot);

  if (isProduction && isPathInside(resolvedProjectRoot, root)) {
    throw new Error("UPLOAD_ROOT must be outside the deployed application directory in production.");
  }

  if (isProduction && !configuredRoot && !hasWarnedAboutProductionFallback) {
    console.error(
      `[UPLOAD STORAGE WARNING] UPLOAD_ROOT is not configured. `
      + `Using persistent home-directory storage at ${root}. `
      + "Set UPLOAD_ROOT explicitly in Hostinger and include this directory in backups."
    );
    hasWarnedAboutProductionFallback = true;
  }

  const membersDirectory = path.join(root, "members");
  const siteDirectory = path.join(root, "site");

  fs.mkdirSync(membersDirectory, { recursive: true });
  fs.mkdirSync(siteDirectory, { recursive: true });

  return {
    root,
    usingProductionFallback: isProduction && !configuredRoot,
    members: {
      directory: membersDirectory,
      publicPath: "/uploads/members"
    },
    site: {
      directory: siteDirectory,
      publicPath: "/uploads/site"
    }
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
