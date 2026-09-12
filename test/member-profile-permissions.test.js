const assert = require("node:assert/strict");
const test = require("node:test");

const { buildMemberProfileUpdate } = require("../src/controllers/memberController");

test("member profile updates preserve all admin-controlled flags", () => {
  const member = {
    full_name: "Existing Member",
    show_in_directory: 1,
    show_mobile_in_directory: 0,
    show_email_in_directory: 1,
    show_city_in_directory: 0,
    show_profession_in_directory: 1,
    show_photo_in_directory: 0,
    show_in_leadership_section: 1,
    is_important_member: 1,
    important_member_order: 3,
    membership_status: "approved",
    approved_by_admin: 1,
    role: "Secretary"
  };
  const craftedBody = {
    full_name: "Updated Member",
    show_in_directory: "0",
    show_mobile_in_directory: "1",
    show_email_in_directory: "0",
    show_city_in_directory: "1",
    show_profession_in_directory: "0",
    show_photo_in_directory: "1",
    show_in_leadership_section: "0",
    is_important_member: "0",
    important_member_order: "999",
    membership_status: "rejected",
    approved_by_admin: "0",
    role: "President"
  };

  const updated = buildMemberProfileUpdate(member, craftedBody, "/uploads/members/existing.jpg");

  for (const field of [
    "show_in_directory", "show_mobile_in_directory", "show_email_in_directory",
    "show_city_in_directory", "show_profession_in_directory", "show_photo_in_directory",
    "show_in_leadership_section", "is_important_member", "important_member_order",
    "membership_status", "approved_by_admin", "role"
  ]) {
    assert.equal(updated[field], member[field], `${field} must remain admin-controlled`);
  }
});

test("member profile view does not render administrative checkbox controls", () => {
  const template = require("node:fs").readFileSync("src/views/member/profile.ejs", "utf8");
  assert.doesNotMatch(template, /type="checkbox"/);
  assert.doesNotMatch(template, /show_(?:in_directory|mobile_in_directory|email_in_directory|city_in_directory|profession_in_directory|photo_in_directory)/);
});

test("admin member edit view retains administrative checkbox controls", () => {
  const template = require("node:fs").readFileSync("src/views/admin/member-edit.ejs", "utf8");
  assert.match(template, /type="checkbox" name="show_in_directory"/);
  assert.match(template, /type="checkbox" name="show_email_in_directory"/);
  assert.match(template, /type="checkbox" name="show_photo_in_directory"/);
});
