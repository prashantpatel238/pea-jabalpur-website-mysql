const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const site = require("../src/config/site");
const {
  buildPublicSiteSettings,
  buildTemplateSite,
  getDefaultSiteSettingsValues
} = require("../src/services/siteSettingsService");

const OFFICIAL_EMAIL = "admin@professionalpeajbp.in";
const OLD_PUBLIC_EMAIL = "info@pea.org";
const projectRoot = path.resolve(__dirname, "..");

test("the default public contact email is the official association address", () => {
  const defaults = getDefaultSiteSettingsValues();

  assert.equal(site.contact.email, OFFICIAL_EMAIL);
  assert.equal(defaults.contact_email, OFFICIAL_EMAIL);
  assert.equal(buildPublicSiteSettings().contact_email, OFFICIAL_EMAIL);
  assert.equal(buildTemplateSite(defaults).contact.email, OFFICIAL_EMAIL);
});

test("contact page and footer use the centralized site setting for text and mailto", () => {
  for (const relativePath of [
    "src/views/public/contact.ejs",
    "src/views/partials/footer.ejs"
  ]) {
    const template = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

    assert.match(template, /href="mailto:<%= siteSettings\.contact_email %>"/);
    assert.match(template, />\s*<%= siteSettings\.contact_email %>\s*<\/a>/);
    assert.doesNotMatch(template, new RegExp(OLD_PUBLIC_EMAIL.replace(".", "\\."), "i"));
  }
});

test("example email sender and administrator identities use the official address", () => {
  const exampleEnvironment = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf8");

  for (const variable of ["ADMIN_EMAIL", "SMTP_USER", "SMTP_FROM_EMAIL"]) {
    assert.match(exampleEnvironment, new RegExp(`^${variable}=${OFFICIAL_EMAIL}$`, "m"));
  }

  assert.match(exampleEnvironment, /^SMTP_PASS=replace_with_real_password_in_hostinger$/m);
  assert.doesNotMatch(exampleEnvironment, new RegExp(OLD_PUBLIC_EMAIL.replace(".", "\\."), "i"));
});

test("a saved Site Settings contact email remains an explicit database override", () => {
  const savedEmail = "database-contact@example.com";
  const siteSettings = buildPublicSiteSettings({ contact_email: savedEmail });

  assert.equal(siteSettings.contact_email, savedEmail);
  assert.equal(buildTemplateSite(siteSettings).contact.email, savedEmail);
});
