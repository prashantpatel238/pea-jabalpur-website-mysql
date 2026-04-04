const { generateMemberId } = require("../utils/memberId");

async function approveMember(member) {
  if (member.membership_status === "approved" && member.member_id) {
    return member;
  }

  member.membership_status = "approved";
  member.member_id = await generateMemberId();
  member.approval_date = new Date();
  member.approved_by_admin = true;

  await member.save();
  return member;
}

async function rejectMember(member) {
  member.membership_status = "rejected";
  member.member_id = null;
  member.approval_date = null;
  member.approved_by_admin = false;

  await member.save();
  return member;
}

module.exports = {
  approveMember,
  rejectMember
};
