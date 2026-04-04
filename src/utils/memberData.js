function calculateAge(dob) {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function parseCheckbox(body, fieldName) {
  return Boolean(body[fieldName]);
}

function normalizePublicMemberInput(body) {
  return {
    full_name: body.full_name || body.name || "",
    email: (body.email || "").trim().toLowerCase(),
    phone: (body.phone || "").trim(),
    profession: (body.profession || "").trim(),
    role: body.role || "General Member",
    city: (body.city || "").trim(),
    address: (body.address || "").trim(),
    dob: body.dob || body.date_of_birth || null,
    gender: (body.gender || "").toLowerCase(),
    marital_status: (body.marital_status || "").toLowerCase(),
    spouse_name: (body.spouse_name || "").trim(),
    marriage_date: body.marriage_date || null
  };
}

function buildAdminMemberPayload(body, existingMember) {
  return {
    full_name: (body.full_name ?? existingMember?.full_name ?? "").trim(),
    email: (body.email ?? existingMember?.email ?? "").trim().toLowerCase(),
    phone: (body.phone ?? existingMember?.phone ?? "").trim(),
    profession: (body.profession ?? existingMember?.profession ?? "").trim(),
    role: body.role || existingMember?.role || "General Member",
    city: (body.city ?? existingMember?.city ?? "").trim(),
    address: (body.address ?? existingMember?.address ?? "").trim(),
    dob: body.dob ?? existingMember?.dob ?? null,
    gender: (body.gender ?? existingMember?.gender ?? "").toLowerCase(),
    marital_status: (body.marital_status ?? existingMember?.marital_status ?? "").toLowerCase(),
    marriage_date: body.marriage_date ?? existingMember?.marriage_date ?? null,
    spouse_name: (body.spouse_name ?? existingMember?.spouse_name ?? "").trim(),
    leadership_title: (body.leadership_title ?? existingMember?.leadership_title ?? "").trim(),
    notes: (body.notes ?? existingMember?.notes ?? "").trim(),
    admin_notes: (body.admin_notes ?? existingMember?.admin_notes ?? "").trim(),
    show_in_directory: parseCheckbox(body, "show_in_directory"),
    show_mobile_in_directory: parseCheckbox(body, "show_mobile_in_directory"),
    show_email_in_directory: parseCheckbox(body, "show_email_in_directory"),
    show_city_in_directory: parseCheckbox(body, "show_city_in_directory"),
    show_profession_in_directory: parseCheckbox(body, "show_profession_in_directory"),
    show_photo_in_directory: parseCheckbox(body, "show_photo_in_directory"),
    show_in_leadership_section: parseCheckbox(body, "show_in_leadership_section"),
    is_important_member: parseCheckbox(body, "is_important_member"),
    important_member_order: Number(body.important_member_order || 0),
    registration_source: (body.registration_source || existingMember?.registration_source || "admin").trim(),
    age: calculateAge(body.dob ?? existingMember?.dob ?? null)
  };
}

module.exports = {
  buildAdminMemberPayload,
  calculateAge,
  normalizePublicMemberInput,
  parseCheckbox
};
