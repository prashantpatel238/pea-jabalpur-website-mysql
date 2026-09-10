const assert = require("node:assert/strict");
const test = require("node:test");

const { buildAdminMemberPayload } = require("../src/utils/memberData");

test("admin edits preserve important member order when the UI omits it", () => {
  const payload = buildAdminMemberPayload(
    { full_name: "Existing Member", email: "member@example.com" },
    { important_member_order: 17 }
  );

  assert.equal(payload.important_member_order, 17);
});

test("admin creates default important member order to zero", () => {
  const payload = buildAdminMemberPayload({ full_name: "New Member", email: "new@example.com" });

  assert.equal(payload.important_member_order, 0);
});
