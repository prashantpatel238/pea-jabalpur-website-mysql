const { query } = require("../db/mysql");

const DIRECTORY_MEMBER_SELECT = `
  SELECT id, full_name, role, city, profession, email, phone, photo, member_id, join_date,
         show_city_in_directory, show_profession_in_directory, show_email_in_directory,
         show_mobile_in_directory, show_photo_in_directory
  FROM members
`;

const LEADERSHIP_MEMBER_SELECT = `
  SELECT id, full_name, role, leadership_title, profession, city, email, phone, photo,
         show_city_in_directory, show_profession_in_directory, show_email_in_directory,
         show_mobile_in_directory, show_photo_in_directory
  FROM members
`;

function escapeLikePattern(value) {
  return value.replace(/[\\%_]/g, "\\$&");
}

async function getLeadershipMembers(options = {}) {
  const { limit } = options;
  const params = [];
  let sql = `
    ${LEADERSHIP_MEMBER_SELECT}
    WHERE membership_status = 'approved'
      AND role <> 'General Member'
      AND (show_in_leadership_section = 1 OR is_important_member = 1)
    ORDER BY important_member_order ASC, full_name ASC
  `;

  if (limit) {
    sql += " LIMIT ?";
    params.push(Number(limit));
  }

  return query(sql, params);
}

async function getPublicDirectoryMembers(filters = {}) {
  const whereClauses = [
    "membership_status = 'approved'",
    "show_in_directory = 1"
  ];
  const params = [];

  if (filters.search) {
    whereClauses.push("full_name LIKE ? ESCAPE '\\'");
    params.push(`%${escapeLikePattern(filters.search)}%`);
  }

  if (filters.city) {
    whereClauses.push("city = ?");
    params.push(filters.city);
  }

  if (filters.profession) {
    whereClauses.push("profession = ?");
    params.push(filters.profession);
  }

  return query(
    `${DIRECTORY_MEMBER_SELECT}
     WHERE ${whereClauses.join(" AND ")}
     ORDER BY role ASC, full_name ASC`,
    params
  );
}

async function getPublicDirectoryFilterOptions() {
  const [cities, professions] = await Promise.all([
    query(
      `SELECT DISTINCT city
       FROM members
       WHERE membership_status = 'approved'
         AND show_in_directory = 1
         AND show_city_in_directory = 1
         AND city IS NOT NULL
         AND city <> ''
       ORDER BY city ASC`
    ),
    query(
      `SELECT DISTINCT profession
       FROM members
       WHERE membership_status = 'approved'
         AND show_in_directory = 1
         AND show_profession_in_directory = 1
         AND profession IS NOT NULL
         AND profession <> ''
       ORDER BY profession ASC`
    )
  ]);

  return {
    cities: cities.map((row) => row.city),
    professions: professions.map((row) => row.profession)
  };
}

module.exports = {
  getLeadershipMembers,
  getPublicDirectoryFilterOptions,
  getPublicDirectoryMembers
};
