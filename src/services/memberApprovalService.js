const { updateMemberById } = require("../repositories/adminMemberRepository");
const { generateMemberId } = require("../utils/memberId");

async function approveMember(member) {
  if (member.membership_status === "approved" && member.member_id) {
    return updateMemberById(member.id, {
      ...member,
      approval_date: member.approval_date || new Date(),
      approved_by_admin: true
    });
  }

  return updateMemberById(member.id, {
    ...member,
    membership_status: "approved",
    show_in_directory: member.registration_source === "public_form" && !member.show_in_directory
      ? true
      : member.show_in_directory,
    member_id: await generateMemberId(),
    approval_date: new Date(),
    approved_by_admin: true
  });
}

async function rejectMember(member) {
  return updateMemberById(member.id, {
    ...member,
    membership_status: "rejected",
    member_id: null,
    approval_date: null,
    approved_by_admin: false
  });
}

module.exports = {
  approveMember,
  rejectMember
};
