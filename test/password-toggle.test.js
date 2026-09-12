const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

test("all password inputs are hidden by default and receive the shared toggle", () => {
  const viewFiles = [
    "src/views/auth/login.ejs",
    "src/views/auth/reset-password.ejs",
    "src/views/public/register.ejs",
    "src/views/member/profile.ejs",
    "src/views/member/login.ejs",
    "src/views/admin/dashboard.ejs",
    "src/views/admin/member-edit.ejs"
  ];

  for (const file of viewFiles) {
    const template = fs.readFileSync(file, "utf8");
    assert.match(template, /type="password"/, `${file} should keep passwords hidden by default`);
  }

  const script = fs.readFileSync("public/js/main.js", "utf8");
  assert.match(script, /input\[type="password"\]/);
  assert.match(script, /aria-label", "Show password"/);
  assert.match(script, /showPassword \? "text" : "password"/);
  assert.match(script, /showPassword \? "Hide password" : "Show password"/);
});
