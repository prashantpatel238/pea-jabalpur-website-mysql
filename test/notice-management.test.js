const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const { NOTICE_LIMIT, NoticeLimitError, normalizeType } = require("../src/repositories/noticeRepository");

test("notices and events have independent ten-record limit messaging", () => {
  assert.equal(NOTICE_LIMIT, 10);
  assert.match(new NoticeLimitError("notice").message, /maximum of 10 notices/);
  assert.match(new NoticeLimitError("event").message, /maximum of 10 events/);
});

test("notice type input is constrained to the shared table types", () => {
  assert.equal(normalizeType("notice"), "notice");
  assert.equal(normalizeType("event"), "event");
  assert.equal(normalizeType("crafted-value"), "notice");
});

test("admin and public views expose responsive event-photo controls", () => {
  const dashboard = fs.readFileSync("src/views/admin/dashboard.ejs", "utf8");
  const publicNotices = fs.readFileSync("src/views/public/notices.ejs", "utf8");
  assert.match(dashboard, /name="event_photo"/);
  assert.match(dashboard, /data-notice-count/);
  assert.match(publicNotices, /aspect-video w-full rounded-2xl object-cover/);
});
