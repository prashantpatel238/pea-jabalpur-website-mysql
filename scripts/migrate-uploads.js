const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { getUploadStorageConfig } = require("../src/config/uploads");

const projectRoot = path.resolve(__dirname, "..");
const uploadStorage = getUploadStorageConfig();

function copyLegacyFiles(areaName) {
  const sourceDirectory = path.join(projectRoot, "public", "uploads", areaName);
  const destinationDirectory = uploadStorage[areaName].directory;

  if (!fs.existsSync(sourceDirectory)) {
    console.log(`No legacy ${areaName} directory found at ${sourceDirectory}.`);
    return { copied: 0, skipped: 0 };
  }

  let copied = 0;
  let skipped = 0;

  for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) {
      skipped += 1;
      continue;
    }

    const sourcePath = path.join(sourceDirectory, entry.name);
    const destinationPath = path.join(destinationDirectory, entry.name);

    try {
      fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
      copied += 1;
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }

      skipped += 1;
    }
  }

  console.log(`${areaName}: copied ${copied}, skipped ${skipped}; source files were not deleted.`);
  return { copied, skipped };
}

console.log(`Migrating legacy uploads into ${uploadStorage.root}`);
copyLegacyFiles("members");
copyLegacyFiles("site");
console.log("Migration copy complete. Verify uploaded URLs before removing any legacy files.");
