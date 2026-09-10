const { MEMBER_ROLES } = require("../constants/memberRoles");

function getMemberRoleOrderSql(column = "role") {
  const trustedColumn = column === "members.role" ? column : "role";
  const cases = MEMBER_ROLES.map((role, index) => `WHEN '${role.replace(/'/g, "''")}' THEN ${index + 1}`);

  return `CASE ${trustedColumn} ${cases.join(" ")} ELSE 99 END`;
}

module.exports = { getMemberRoleOrderSql };
