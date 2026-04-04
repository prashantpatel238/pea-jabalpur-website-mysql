const { Member } = require("../models/Member");

const PUBLIC_LEADERSHIP_SELECT = [
  "full_name",
  "role",
  "leadership_title",
  "profession",
  "city",
  "email",
  "phone",
  "photo",
  "show_city_in_directory",
  "show_profession_in_directory",
  "show_email_in_directory",
  "show_mobile_in_directory",
  "show_photo_in_directory"
].join(" ");

function buildLeadershipQuery() {
  return {
    membership_status: "approved",
    role: { $ne: "General Member" },
    $or: [
      { show_in_leadership_section: true },
      { is_important_member: true }
    ]
  };
}

async function getLeadershipMembers(options = {}) {
  const { limit } = options;
  const query = Member.find(buildLeadershipQuery())
    .select(PUBLIC_LEADERSHIP_SELECT)
    .sort({ important_member_order: 1, full_name: 1 });

  if (limit) {
    query.limit(limit);
  }

  return query.lean();
}

module.exports = {
  buildLeadershipQuery,
  getLeadershipMembers
};
