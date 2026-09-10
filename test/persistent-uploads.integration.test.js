const assert = require("node:assert/strict");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const test = require("node:test");

function request(server, requestPath) {
  const { port } = server.address();

  return new Promise((resolve, reject) => {
    http.get({ hostname: "127.0.0.1", port, path: requestPath }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({
        body: Buffer.concat(chunks).toString(),
        statusCode: response.statusCode
      }));
    }).on("error", reject);
  });
}

function start(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function stop(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}

test("member, logo, and favicon URLs survive an application restart with the same external root", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pea-persistent-uploads-"));
  const previousRoot = process.env.UPLOAD_ROOT;
  const previousEnvironment = process.env.NODE_ENV;
  const previousSecret = process.env.SESSION_SECRET;

  process.env.NODE_ENV = "production";
  process.env.UPLOAD_ROOT = root;
  process.env.SESSION_SECRET = "integration-test-secret";

  try {
    fs.mkdirSync(path.join(root, "members"), { recursive: true });
    fs.mkdirSync(path.join(root, "site"), { recursive: true });
    fs.writeFileSync(path.join(root, "members", "member.jpg"), "member-photo");
    fs.writeFileSync(path.join(root, "site", "logo.png"), "site-logo");
    fs.writeFileSync(path.join(root, "site", "favicon.ico"), "site-favicon");

    const { createApp } = require("../src/app");

    for (let deployment = 0; deployment < 2; deployment += 1) {
      const server = await start(createApp());

      try {
        const member = await request(server, "/uploads/members/member.jpg");
        const logo = await request(server, "/uploads/site/logo.png");
        const favicon = await request(server, "/uploads/site/favicon.ico");

        assert.deepEqual(member, { body: "member-photo", statusCode: 200 });
        assert.deepEqual(logo, { body: "site-logo", statusCode: 200 });
        assert.deepEqual(favicon, { body: "site-favicon", statusCode: 200 });
      } finally {
        await stop(server);
      }
    }
  } finally {
    if (previousRoot === undefined) delete process.env.UPLOAD_ROOT;
    else process.env.UPLOAD_ROOT = previousRoot;
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
    if (previousSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previousSecret;
    fs.rmSync(root, { recursive: true, force: true });
  }
});
