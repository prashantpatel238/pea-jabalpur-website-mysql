const { updateMemberById } = require("../repositories/adminMemberRepository");
const { generateMemberId } = require("../utils/memberId");
const {
  sendMembershipApprovedEmail,
  sendMembershipRejectedEmail
} = require("./notificationEmailService");

async function sendStatusNotification(label, sender, member) {
  try {
    await sender(member);
  } catch (error) {
    console.error(`Email delivery failed (${label}, member ${member.id}):`, error?.message || "Unknown email error");
  }
}

async function approveMember(member) {
  if (member.membership_status === "approved" && member.member_id) {
    return updateMemberById(member.id, {
      ...member,
      approval_date: member.approval_date || new Date(),
      approved_by_admin: true
    });
  }

  const updatedMember = await updateMemberById(member.id, {
    ...member,
    membership_status: "approved",
    show_in_directory: member.registration_source === "public_form" && !member.show_in_directory
      ? true
      : member.show_in_directory,
    member_id: await generateMemberId(),
    approval_date: new Date(),
    approved_by_admin: true
  });
  await sendStatusNotification("membership approval", sendMembershipApprovedEmail, updatedMember);
  return updatedMember;
}

async function rejectMember(member) {
  const wasRejected = member.membership_status === "rejected";
  const updatedMember = await updateMemberById(member.id, {
    ...member,
    membership_status: "rejected",
    member_id: null,
    approval_date: null,
    approved_by_admin: false
  });
  if (!wasRejected) {
    await sendStatusNotification("membership rejection", sendMembershipRejectedEmail, updatedMember);
  }
  return updatedMember;
}

module.exports = {
  approveMember,
  rejectMember
};
