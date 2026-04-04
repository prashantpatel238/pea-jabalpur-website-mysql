const { query } = require("../db/mysql");

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

module.exports = {
  createPendingMemberRegistration,
  findMemberIdByEmail
};
