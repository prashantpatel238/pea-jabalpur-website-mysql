const MEMBER_ROLES = [
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

const LEADERSHIP_ROLES = MEMBER_ROLES.filter((role) => role !== "General Member");

function isMemberRole(role) {
  return MEMBER_ROLES.includes(role);
}

module.exports = {
  LEADERSHIP_ROLES,
  MEMBER_ROLES,
  isMemberRole
};
