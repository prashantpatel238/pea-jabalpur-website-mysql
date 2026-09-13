const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const { LEADERSHIP_ROLES, MEMBER_ROLES, isMemberRole } = require("../src/constants/memberRoles");
const { buildAdminMemberPayload, normalizePublicMemberInput } = require("../src/utils/memberData");
const { getMemberRoleOrderSql } = require("../src/utils/memberRoleOrder");

const EXPECTED_ROLES = [
  "President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Media Prabhari",
  "Core Committee Member",
  "KARYAKARINI SADASYA",
  "General Member"
];

test("member role list has the required order and whitelist", () => {
  assert.deepEqual(MEMBER_ROLES, EXPECTED_ROLES);
  assert.deepEqual(LEADERSHIP_ROLES, EXPECTED_ROLES.slice(0, -1));
  assert.equal(isMemberRole("KARYAKARINI SADASYA"), true);
  assert.equal(isMemberRole("Arbitrary Role"), false);
});

test("new role is accepted by admin and registration payloads", () => {
  const adminPayload = buildAdminMemberPayload({
    full_name: "New Member",
    email: "member@example.com",
    role: "KARYAKARINI SADASYA"
  });
  const registrationPayload = normalizePublicMemberInput({ role: "KARYAKARINI SADASYA" });

  assert.equal(adminPayload.role, "KARYAKARINI SADASYA");
  assert.equal(adminPayload.show_in_leadership_section, true);
  assert.equal(registrationPayload.role, "KARYAKARINI SADASYA");
});

test("admin edit preserves an existing role when role is omitted or invalid", () => {
  const existingMember = { role: "Secretary" };

  assert.equal(buildAdminMemberPayload({}, existingMember).role, "Secretary");
  assert.equal(buildAdminMemberPayload({ role: "Arbitrary Role" }, existingMember).role, "Secretary");
});

test("SQL role ordering is generated from the central role list", () => {
  const sql = getMemberRoleOrderSql();

  EXPECTED_ROLES.forEach((role, index) => {
    assert.match(sql, new RegExp(`WHEN '${role}' THEN ${index + 1}`));
  });
});

test("leadership and directory repositories retain approval and visibility rules", () => {
  const source = fs.readFileSync("src/repositories/publicMemberRepository.js", "utf8");

  assert.match(source, /membership_status = 'approved'[\s\S]*role <> 'General Member'[\s\S]*getMemberRoleOrderSql\(\)/);
  assert.match(source, /membership_status = 'approved'[\s\S]*show_in_directory = 1[\s\S]*getMemberRoleOrderSql\(\)/);
});

test("member role dropdowns use the shared role list", () => {
  for (const templatePath of [
    "src/views/admin/dashboard.ejs",
    "src/views/admin/member-edit.ejs",
    "src/views/public/register.ejs"
  ]) {
    const template = fs.readFileSync(templatePath, "utf8");
    assert.match(template, /memberRoles\.forEach\(\(role\)/, templatePath);
  }
});
