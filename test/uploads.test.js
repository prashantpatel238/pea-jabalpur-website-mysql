const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");

const { getStoredFilePath, getUploadStorageConfig } = require("../src/config/uploads");

function restoreEnvironmentVariable(name, value) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

test("upload configuration preserves public URLs while using an external root", () => {
  const previousRoot = process.env.UPLOAD_ROOT;
  const previousEnvironment = process.env.NODE_ENV;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pea-uploads-"));

  try {
    process.env.NODE_ENV = "production";
    process.env.UPLOAD_ROOT = root;
    const config = getUploadStorageConfig();

    assert.equal(config.root, root);
    assert.equal(config.members.publicPath, "/uploads/members");
    assert.equal(config.site.publicPath, "/uploads/site");
    assert.ok(fs.statSync(config.members.directory).isDirectory());
    assert.ok(fs.statSync(config.site.directory).isDirectory());
  } finally {
    restoreEnvironmentVariable("NODE_ENV", previousEnvironment);
    restoreEnvironmentVariable("UPLOAD_ROOT", previousRoot);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("production rejects missing or deployment-local upload roots", () => {
  const previousRoot = process.env.UPLOAD_ROOT;
  const previousEnvironment = process.env.NODE_ENV;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.UPLOAD_ROOT;
    assert.throws(() => getUploadStorageConfig(), /UPLOAD_ROOT is required/);

    process.env.UPLOAD_ROOT = path.resolve(__dirname, "..", "data", "uploads");
    assert.throws(() => getUploadStorageConfig(), /outside the deployed application/);
  } finally {
    restoreEnvironmentVariable("NODE_ENV", previousEnvironment);
    restoreEnvironmentVariable("UPLOAD_ROOT", previousRoot);
  }
});

test("stored file resolution rejects traversal and cross-area paths", () => {
  const previousRoot = process.env.UPLOAD_ROOT;
  const previousEnvironment = process.env.NODE_ENV;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pea-uploads-"));

  try {
    process.env.NODE_ENV = "production";
    process.env.UPLOAD_ROOT = root;
    const config = getUploadStorageConfig();

    assert.equal(
      getStoredFilePath("/uploads/members/photo.jpg", config.members),
      path.join(root, "members", "photo.jpg")
    );
    assert.equal(getStoredFilePath("/uploads/members/../site/logo.png", config.members), null);
    assert.equal(getStoredFilePath("/uploads/site/logo.png", config.members), null);
    assert.equal(getStoredFilePath("/etc/passwd", config.members), null);
  } finally {
    restoreEnvironmentVariable("NODE_ENV", previousEnvironment);
    restoreEnvironmentVariable("UPLOAD_ROOT", previousRoot);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
