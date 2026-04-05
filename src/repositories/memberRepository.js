const { query } = require("../db/mysql");

const MEMBER_SELECT = `
  SELECT id, full_name, photo, member_id, profession, role, city, join_date, age,
         leadership_title, dob, gender, marital_status, marriage_date, spouse_name,
         phone, email, password_hash, address, notes, admin_notes, membership_status,
         approval_date, approved_by_admin, show_in_directory, show_mobile_in_directory,
         show_email_in_directory, show_city_in_directory, show_profession_in_directory,
         show_photo_in_directory, show_in_leadership_section, is_important_member,
         important_member_order, registration_source, last_login_at, created_at, updated_at
  FROM members
`;

function normalizeBoolean(value) {
  return value ? 1 : 0;
}

function mapMemberPayload(member) {
  return [
    member.full_name,
    member.photo || "",
    member.member_id ?? null,
    member.profession || "",
    member.role || "General Member",
    member.city || "",
    member.age ?? null,
    member.leadership_title || "",
    member.dob || null,
    member.gender || "",
    member.marital_status || "",
    member.marriage_date || null,
    member.spouse_name || "",
    member.phone || "",
    member.email,
    member.password_hash,
    member.address || "",
    member.notes || "",
    member.admin_notes || "",
    member.membership_status || "pending",
    member.approval_date || null,
    normalizeBoolean(member.approved_by_admin),
    normalizeBoolean(member.show_in_directory),
    normalizeBoolean(member.show_mobile_in_directory),
    normalizeBoolean(member.show_email_in_directory),
    normalizeBoolean(member.show_city_in_directory),
    normalizeBoolean(member.show_profession_in_directory),
    normalizeBoolean(member.show_photo_in_directory),
    normalizeBoolean(member.show_in_leadership_section),
    normalizeBoolean(member.is_important_member),
    Number(member.important_member_order || 0),
    member.registration_source || "public_form",
    member.last_login_at || null
  ];
}

async function findMemberIdByEmail(email) {
  const rows = await query(
    `SELECT id
     FROM members
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0]?.id || null;
}

async function createPendingMemberRegistration(member) {
  const result = await query(
    `INSERT INTO members (
      full_name,
      photo,
      member_id,
      profession,
      role,
      city,
      age,
      leadership_title,
      dob,
      gender,
      marital_status,
      marriage_date,
      spouse_name,
      phone,
      email,
      password_hash,
      address,
      notes,
      admin_notes,
      membership_status,
      approval_date,
      approved_by_admin,
      show_in_directory,
      show_mobile_in_directory,
      show_email_in_directory,
      show_city_in_directory,
      show_profession_in_directory,
      show_photo_in_directory,
      show_in_leadership_section,
      is_important_member,
      important_member_order,
      registration_source,
      last_login_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`,
    [
      member.full_name,
      member.photo || "",
      null,
      member.profession || "",
      member.role || "General Member",
      member.city || "",
      member.age ?? null,
      member.leadership_title || "",
      member.dob || null,
      member.gender || "",
      member.marital_status || "",
      member.marriage_date || null,
      member.spouse_name || "",
      member.phone || "",
      member.email,
      member.password_hash,
      member.address || "",
      member.notes || "",
      member.admin_notes || "",
      "pending",
      null,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      member.registration_source || "public_form",
      null
    ]
  );

  return String(result.insertId);
}

async function findApprovedMemberByEmail(email) {
  const rows = await query(
    `${MEMBER_SELECT}
     WHERE email = ?
       AND membership_status = 'approved'
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

async function findMemberById(id) {
  const rows = await query(
    `${MEMBER_SELECT}
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function updateMemberById(id, member) {
  await query(
    `UPDATE members
     SET full_name = ?,
         photo = ?,
         member_id = ?,
         profession = ?,
         role = ?,
         city = ?,
         age = ?,
         leadership_title = ?,
         dob = ?,
         gender = ?,
         marital_status = ?,
         marriage_date = ?,
         spouse_name = ?,
         phone = ?,
         email = ?,
         password_hash = ?,
         address = ?,
         notes = ?,
         admin_notes = ?,
         membership_status = ?,
         approval_date = ?,
         approved_by_admin = ?,
         show_in_directory = ?,
         show_mobile_in_directory = ?,
         show_email_in_directory = ?,
         show_city_in_directory = ?,
         show_profession_in_directory = ?,
         show_photo_in_directory = ?,
         show_in_leadership_section = ?,
         is_important_member = ?,
         important_member_order = ?,
         registration_source = ?,
         last_login_at = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [...mapMemberPayload(member), id]
  );

  return findMemberById(id);
}

async function listCelebrationMembers() {
  return query(
    `${MEMBER_SELECT}
     WHERE membership_status = 'approved'
       AND (dob IS NOT NULL OR marriage_date IS NOT NULL)`
  );
}

module.exports = {
  createPendingMemberRegistration,
  findApprovedMemberByEmail,
  findMemberById,
  findMemberIdByEmail,
  listCelebrationMembers,
  updateMemberById
};
